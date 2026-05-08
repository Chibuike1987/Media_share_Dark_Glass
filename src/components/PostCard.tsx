'use client';

import type { Post } from '@/lib/types';
import Link from 'next/link';
import { Star, MessageSquare, MapPin, User, CheckCircle, AlertTriangle } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime(); const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({ post }: { post: Post }) {
  const filledStars = Math.round(post.averageRating || 0);

  return (
    <Link href={`/post/${post.id}`} className="block bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden no-underline text-inherit hover:no-underline hover:border-[#a855f7]/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group">
      <div className="relative aspect-square overflow-hidden bg-[#1a1a28]">
        <img className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" src={post.imageUrl} alt={post.caption} loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%231a1a28' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%235c5c78'%3ENo image%3C/text%3E%3C/svg%3E"; }}
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm ${post.moderationStatus === 'safe' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
            {post.moderationStatus === 'safe' ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
            {post.moderationStatus === 'safe' ? 'Safe' : 'Flag'}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        <p className="text-sm text-[#f0f0f5] font-medium line-clamp-2 leading-snug">{post.caption}</p>
        <div className="flex flex-wrap gap-1">{post.tags.slice(0, 3).map((t) => <span key={t} className="px-2 py-0.5 bg-[#a855f7]/10 text-[#a855f7] rounded-full text-xs font-medium">{t}</span>)}</div>
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 text-xs text-[#9d9db5]"><User className="w-3 h-3" />{post.userName}</div>
          <div className="flex items-center gap-2 text-xs text-[#5c5c78]">
            <span className="flex gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < filledStars ? 'text-[#a855f7] fill-[#a855f7]' : 'text-white/10'}`} />)}</span>
            <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
