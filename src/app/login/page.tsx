'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/components/Toast';
import { Camera, Palette, Eye, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'consumer' | 'creator'>('consumer');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    const form = new FormData(e.currentTarget);
    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const body = tab === 'login' ? { email: form.get('email'), password: form.get('password') } : { email: form.get('email'), password: form.get('password'), displayName: form.get('displayName'), role };
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Request failed');
      setAuth(data.data.user, data.data.token);
      showToast(tab === 'login' ? 'Welcome back!' : 'Account created!', 'success');
      router.push(data.data.user.role === 'creator' ? '/upload' : '/feed');
    } catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.6)] overflow-hidden animate-[fadeInUp_0.5s_ease]">
          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] shadow-[0_0_40px_rgba(168,85,247,0.35)]">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">MediaShare</h1>
            <p className="text-sm text-[#9d9db5] mt-1.5">AI-powered media sharing platform</p>
          </div>

          {/* Tabs */}
          <div className="px-8">
            <div className="flex bg-white/[0.04] p-1 rounded-xl">
              <button className={`flex-1 h-10 rounded-lg font-medium text-sm transition-all ${tab === 'login' ? 'bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white shadow-md' : 'text-[#5c5c78] hover:text-[#9d9db5]'}`} onClick={() => setTab('login')}>Sign In</button>
              <button className={`flex-1 h-10 rounded-lg font-medium text-sm transition-all ${tab === 'signup' ? 'bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white shadow-md' : 'text-[#5c5c78] hover:text-[#9d9db5]'}`} onClick={() => setTab('signup')}>Sign Up</button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pt-8 pb-10">
            <div className="space-y-5">
              {tab === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#f0f0f5] mb-3">Choose your role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-5 border-2 rounded-2xl text-center cursor-pointer transition-all ${role === 'creator' ? 'border-[#a855f7] bg-[#a855f7]/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/[0.06] hover:border-[#a855f7]/30'}`} onClick={() => setRole('creator')}>
                        <Palette className={`w-7 h-7 mx-auto mb-2.5 ${role === 'creator' ? 'text-[#a855f7]' : 'text-[#5c5c78]'}`} />
                        <span className="block font-semibold text-sm text-[#f0f0f5]">Creator</span>
                        <span className="block text-xs text-[#9d9db5] mt-1">Upload & share</span>
                      </div>
                      <div className={`p-5 border-2 rounded-2xl text-center cursor-pointer transition-all ${role === 'consumer' ? 'border-[#a855f7] bg-[#a855f7]/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/[0.06] hover:border-[#a855f7]/30'}`} onClick={() => setRole('consumer')}>
                        <Eye className={`w-7 h-7 mx-auto mb-2.5 ${role === 'consumer' ? 'text-[#a855f7]' : 'text-[#5c5c78]'}`} />
                        <span className="block font-semibold text-sm text-[#f0f0f5]">Consumer</span>
                        <span className="block text-xs text-[#9d9db5] mt-1">Browse & engage</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f0f0f5] mb-2" htmlFor="displayName">Display Name</label>
                    <input className="w-full h-11 px-4 bg-[#1a1a28] border border-white/[0.06] rounded-xl text-[#f0f0f5] outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all placeholder:text-[#5c5c78]" name="displayName" id="displayName" type="text" placeholder="Your name" required />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-[#f0f0f5] mb-2" htmlFor="email">Email</label>
                <input className="w-full h-11 px-4 bg-[#1a1a28] border border-white/[0.06] rounded-xl text-[#f0f0f5] outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all placeholder:text-[#5c5c78]" name="email" id="email" type="email" placeholder="you@email.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#f0f0f5] mb-2" htmlFor="password">Password</label>
                <input className="w-full h-11 px-4 bg-[#1a1a28] border border-white/[0.06] rounded-xl text-[#f0f0f5] outline-none focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-all placeholder:text-[#5c5c78]" name="password" id="password" type="password" placeholder="••••••••" required minLength={6} />
              </div>

              <button type="submit" className="w-full h-12 mt-2 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white rounded-xl font-semibold shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (tab === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
