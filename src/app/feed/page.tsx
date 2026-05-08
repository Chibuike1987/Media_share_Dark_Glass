'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import PostCard from '@/components/PostCard';
import { showToast } from '@/components/Toast';
import type { Post, PaginationMeta } from '@/lib/types';
import { Search, X, Image, Loader2, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

export default function FeedPage() {
  const { isLoggedIn } = useAuth(); const api = useApi(); const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]); const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true); const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); const [page, setPage] = useState(1);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); }, [isLoggedIn, router]);

  const loadFeed = useCallback(async (pageNum: number) => {
    setLoading(true); try { const res = await api.getFeed(pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); setIsSearching(false); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api]);

  const handleSearch = useCallback(async (pageNum: number = 1) => {
    if (!searchQuery.trim()) { loadFeed(1); return; } setLoading(true);
    try { const res = await api.searchPosts(searchQuery.trim(), pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); setIsSearching(true); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api, searchQuery, loadFeed]);

  useEffect(() => { if (isLoggedIn) loadFeed(1); }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps
  const handlePageChange = (newPage: number) => { setPage(newPage); isSearching ? handleSearch(newPage) : loadFeed(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  if (!isLoggedIn) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <h1 className="text-2xl font-extrabold text-[#f0f0f5] flex items-center gap-2">
          {isSearching ? `Results for "${searchQuery}"` : <><Compass className="w-6 h-6 text-[#a855f7]" /> Explore</>}
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); handleSearch(1); }} className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c5c78] pointer-events-none" />
          <input className="w-full h-11 pl-11 pr-10 bg-[#1a1a28] border border-white/[0.06] rounded-full text-[#f0f0f5] text-sm outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all placeholder:text-[#5c5c78]" type="text" placeholder="Search by tags, captions, location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {isSearching && <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.06] text-[#9d9db5] hover:text-[#f0f0f5]" onClick={() => { setSearchQuery(''); setPage(1); loadFeed(1); }}><X className="w-3.5 h-3.5" /></button>}
        </form>
      </div>
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-3"><Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" /><p className="text-sm text-[#5c5c78]">Loading posts...</p></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24"><Image className="w-14 h-14 mx-auto mb-5 text-[#5c5c78] opacity-50" /><h3 className="text-lg font-semibold mb-2 text-[#f0f0f5]">{isSearching ? 'No results found' : 'No posts yet'}</h3><p className="text-sm text-[#5c5c78]">{isSearching ? 'Try different terms' : 'Be the first to see content!'}</p></div>
      ) : (<>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button className="flex items-center gap-1.5 h-10 px-5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] hover:bg-white/[0.08] hover:border-[#a855f7]/30 disabled:opacity-30 transition-all" disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(page - 1)}><ChevronLeft className="w-4 h-4" /> Prev</button>
            <span className="text-sm text-[#5c5c78]">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button className="flex items-center gap-1.5 h-10 px-5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] hover:bg-white/[0.08] hover:border-[#a855f7]/30 disabled:opacity-30 transition-all" disabled={!pagination.hasNextPage} onClick={() => handlePageChange(page + 1)}>Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </>)}
    </div>
  );
}
