'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import StarRating from '@/components/StarRating';
import { showToast } from '@/components/Toast';
import type { Post, Comment } from '@/lib/types';
import { ArrowLeft, CheckCircle, AlertTriangle, Sparkles, Star, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime(); const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const [post, setPost] = useState<Post | null>(null); const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState(''); const [userRating, setUserRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); }, [isLoggedIn, router]);

  const loadPost = useCallback(async () => {
    try { const [pRes, cRes, rRes] = await Promise.all([api.getPost(id), api.getComments(id), api.getRatings(id)]);
    setPost(pRes.data as Post); setComments((cRes.data || []) as Comment[]);
    const rd = rRes.data as { stats: { averageRating: number; totalRatings: number } }; setRatingStats(rd.stats);
    } catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api, id]);

  useEffect(() => { if (isLoggedIn) loadPost(); }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComment = async (e: React.FormEvent) => { e.preventDefault(); if (!commentText.trim()) return; setSubmitting(true);
    try { const res = await api.addComment(id, commentText.trim()); setComments((prev) => [res.data as Comment, ...prev]); setCommentText(''); showToast('Added!', 'success'); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setSubmitting(false); } };

  const handleRate = async (score: number) => { setUserRating(score);
    try { await api.addRating(id, score); showToast(`Rated ${score}/5`, 'success'); const rr = await api.getRatings(id);
    const rd = rr.data as { stats: { averageRating: number; totalRatings: number } }; setRatingStats(rd.stats); }
    catch (err) { showToast((err as Error).message, 'error'); } };

  if (!isLoggedIn) return null;
  if (loading) return <div className="flex flex-col items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" /></div>;
  if (!post) return <div className="text-center py-32"><p className="text-[#5c5c78]">Not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 h-9 px-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] hover:bg-white/[0.08] transition-all mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <img className="w-full rounded-2xl mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" src={post.imageUrl} alt={post.caption} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-white flex items-center justify-center font-bold text-sm">{post.userName.charAt(0).toUpperCase()}</div>
          <div><div className="font-semibold text-sm text-[#f0f0f5]">{post.userName}</div><div className="text-xs text-[#5c5c78]">{timeAgo(post.createdAt)}</div></div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${post.moderationStatus === 'safe' ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`}>
          {post.moderationStatus === 'safe' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />} {post.moderationStatus === 'safe' ? 'Safe' : 'Flagged'}
        </span>
      </div>

      <p className="text-base leading-relaxed text-[#f0f0f5] mb-2">{post.caption}</p>
      {post.location && <p className="flex items-center gap-1.5 text-sm text-[#5c5c78] mb-8"><MapPin className="w-4 h-4" />{post.location}</p>}

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-[#f0f0f5]"><Sparkles className="w-4 h-4 text-[#a855f7]" /> AI Analysis</h3>
        <p className="text-sm text-[#9d9db5] italic mb-3">{post.aiCaption}</p>
        <div className="flex flex-wrap gap-1.5">{post.tags.map((t) => <span key={t} className="px-2.5 py-1 bg-[#a855f7]/10 text-[#a855f7] rounded-full text-xs font-medium">{t}</span>)}</div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-[#f0f0f5]"><Star className="w-4 h-4 text-yellow-400" /> Rating</h3>
        <div className="flex items-center gap-3 mb-3"><span className="text-3xl font-bold text-[#a855f7]">{ratingStats.averageRating}</span><StarRating value={Math.round(ratingStats.averageRating)} readonly size="md" /><span className="text-sm text-[#5c5c78]">({ratingStats.totalRatings})</span></div>
        {user?.role === 'consumer' && <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]"><span className="text-sm text-[#9d9db5]">Rate:</span><StarRating value={userRating} onChange={handleRate} /></div>}
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-[#f0f0f5]"><MessageSquare className="w-4 h-4 text-[#a855f7]" /> Comments ({comments.length})</h3>
        {user?.role === 'consumer' && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input className="flex-1 h-11 px-4 bg-[#1a1a28] border border-white/[0.06] rounded-full text-sm text-[#f0f0f5] outline-none focus:border-[#a855f7] transition-colors placeholder:text-[#5c5c78]" type="text" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={1000} />
            <button type="submit" className="h-11 px-5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 transition-all" disabled={submitting || !commentText.trim()}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
        {comments.length === 0 ? <p className="text-sm text-[#5c5c78] italic">No comments yet.</p> : (
          <div className="divide-y divide-white/[0.04]">{comments.map((c) => (
            <div key={c.id} className="py-4 first:pt-0 last:pb-0"><div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm text-[#f0f0f5]">{c.userName}</span><span className="text-xs text-[#5c5c78]">{timeAgo(c.createdAt)}</span></div><p className="text-sm text-[#9d9db5] leading-relaxed">{c.text}</p></div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
