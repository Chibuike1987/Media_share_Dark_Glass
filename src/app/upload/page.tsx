'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { showToast } from '@/components/Toast';
import type { Post } from '@/lib/types';
import { Upload, Image, CheckCircle, AlertTriangle, Sparkles, Shield, Loader2, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null); const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState(''); const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false); const [result, setResult] = useState<Post | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); else if (user?.role !== 'creator') { showToast('Creators only', 'error'); router.push('/feed'); } }, [isLoggedIn, user, router]);

  const handleFile = (f: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type)) { showToast('Invalid file.', 'error'); return; }
    if (f.size > 10 * 1024 * 1024) { showToast('Max 10MB.', 'error'); return; }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!file) { showToast('Select an image', 'error'); return; } if (!caption.trim()) { showToast('Caption required', 'error'); return; }
    setUploading(true); try { const fd = new FormData(); fd.append('image', file); fd.append('caption', caption); if (location.trim()) fd.append('location', location);
    const res = await api.createPost(fd); setResult(res.data as Post); showToast('Post created!', 'success'); } catch (err) { showToast((err as Error).message, 'error'); } finally { setUploading(false); }
  };

  const resetForm = () => { setFile(null); setPreview(null); setCaption(''); setLocation(''); setResult(null); };
  if (!isLoggedIn || user?.role !== 'creator') return null;

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-extrabold mb-2 flex items-center gap-3 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
        <Upload className="w-6 h-6 text-[#a855f7]" /> Upload New Post
      </h1>
      <p className="text-sm text-[#5c5c78] mb-8">Upload an image for AI analysis and sharing</p>

      {result ? (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 animate-[fadeInUp_0.5s_ease]">
          <div className="text-center mb-6"><CheckCircle className="w-10 h-10 text-[#22c55e] mx-auto mb-2" /><h2 className="text-xl font-bold text-[#f0f0f5]">Post Created!</h2></div>
          <img className="max-h-80 rounded-2xl mx-auto mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" src={result.imageUrl} alt={result.caption} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="bg-white/[0.04] border border-[#a855f7]/20 rounded-2xl p-6 mb-8 space-y-3 text-sm">
            <h3 className="font-bold flex items-center gap-2 text-[#f0f0f5]"><Sparkles className="w-4 h-4 text-[#a855f7]" /> AI Analysis</h3>
            <p className="text-[#9d9db5]">{result.aiCaption}</p>
            <div className="flex flex-wrap gap-1.5">{result.tags.map((t) => <span key={t} className="px-2.5 py-1 bg-[#a855f7]/10 text-[#a855f7] rounded-full text-xs font-medium">{t}</span>)}</div>
            <div className="flex items-center gap-2"><span className="text-[#9d9db5]">Status:</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${result.moderationStatus === 'safe' ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`}>{result.moderationStatus === 'safe' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />} {result.moderationStatus === 'safe' ? 'Safe' : 'Flagged'}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-12 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-semibold hover:-translate-y-0.5 transition-all" onClick={resetForm}>Upload Another</button>
            <button className="flex-1 h-12 bg-white/[0.04] text-[#f0f0f5] border border-white/[0.06] rounded-xl font-semibold hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2" onClick={() => router.push(`/post/${result.id}`)}>View <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center ${dragOver ? 'border-[#a855f7] bg-[#a855f7]/10' : preview ? 'border-white/[0.06] p-4' : 'border-[#a855f7]/30 hover:border-[#a855f7] hover:bg-[#a855f7]/5 p-16'}`}
            onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            {preview ? <img className="max-h-80 rounded-2xl mx-auto" src={preview} alt="Preview" /> : (
              <><div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-white/[0.04]"><Image className="w-8 h-8 text-[#5c5c78]" /></div>
              <span className="text-base font-semibold text-[#f0f0f5] mb-1">Drop an image here or click</span><span className="text-sm text-[#5c5c78]">JPEG, PNG, WebP, GIF — Max 10MB</span></>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          {preview && (<div className="space-y-5 animate-[fadeInUp_0.3s_ease]">
            <div><label className="block text-sm font-medium text-[#f0f0f5] mb-2">Caption *</label>
              <textarea className="w-full px-4 py-3 bg-[#1a1a28] border border-white/[0.06] rounded-xl text-[#f0f0f5] outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all min-h-28 resize-y placeholder:text-[#5c5c78]" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe..." maxLength={2000} required />
              <div className="text-xs text-[#5c5c78] text-right mt-1">{caption.length}/2000</div>
            </div>
            <div><label className="block text-sm font-medium text-[#f0f0f5] mb-2">Location</label>
              <input className="w-full h-11 px-4 bg-[#1a1a28] border border-white/[0.06] rounded-xl text-[#f0f0f5] outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all placeholder:text-[#5c5c78]" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" maxLength={200} />
            </div>
            <button type="submit" className="w-full h-12 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white rounded-xl font-semibold shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2" disabled={uploading}>
              {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Upload & Analyze</>}
            </button>
          </div>)}
        </form>
      )}
    </div>
  );
}
