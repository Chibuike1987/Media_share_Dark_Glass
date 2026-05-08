'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import PostCard from '@/components/PostCard';
import { showToast } from '@/components/Toast';
import type { Post, PaginationMeta } from '@/lib/types';
import { Palette, Upload, Image, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyPostsPage() {
  const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]); const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true); const [page, setPage] = useState(1);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); else if (user?.role !== 'creator') router.push('/feed'); }, [isLoggedIn, user, router]);

  const loadPosts = useCallback(async (pageNum: number) => {
    setLoading(true); try { const res = await api.getMyPosts(pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api]);

  useEffect(() => { if (isLoggedIn && user?.role === 'creator') loadPosts(1); }, [isLoggedIn, user]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!isLoggedIn || user?.role !== 'creator') return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <h1 className="text-2xl font-extrabold text-[#f0f0f5] flex items-center gap-2"><Palette className="w-6 h-6 text-[#a855f7]" /> My Posts</h1>
        <button onClick={() => router.push('/upload')} className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-semibold text-sm shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:-translate-y-0.5 transition-all"><Upload className="w-4 h-4" /> Upload</button>
      </div>
      {loading ? <div className="flex flex-col items-center py-24 gap-3"><Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" /><p className="text-sm text-[#5c5c78]">Loading...</p></div>
      : posts.length === 0 ? <div className="text-center py-24"><Image className="w-14 h-14 mx-auto mb-5 text-[#5c5c78] opacity-50" /><h3 className="text-lg font-semibold mb-2 text-[#f0f0f5]">No posts yet</h3><p className="text-sm text-[#5c5c78] mb-6">Start sharing!</p>
        <button onClick={() => router.push('/upload')} className="inline-flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-semibold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 transition-all"><Upload className="w-4 h-4" /> Upload First Image</button></div>
      : (<>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button className="flex items-center gap-1.5 h-10 px-5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] hover:bg-white/[0.08] disabled:opacity-30 transition-all" disabled={!pagination.hasPrevPage} onClick={() => { setPage(page - 1); loadPosts(page - 1); }}><ChevronLeft className="w-4 h-4" /> Prev</button>
            <span className="text-sm text-[#5c5c78]">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button className="flex items-center gap-1.5 h-10 px-5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] hover:bg-white/[0.08] disabled:opacity-30 transition-all" disabled={!pagination.hasNextPage} onClick={() => { setPage(page + 1); loadPosts(page + 1); }}>Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </>)}
    </div>
  );
}
