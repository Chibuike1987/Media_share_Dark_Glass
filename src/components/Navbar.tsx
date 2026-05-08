'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Search, Palette, Eye, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.06] z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline hover:no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-[#f0f0f5] tracking-tight">MediaShare</span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn && user ? (
            <>
              {user.role === 'creator' ? (
                <Link href="/upload" className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-medium text-sm no-underline hover:no-underline shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all">
                  <Upload className="w-4 h-4" /> Upload
                </Link>
              ) : (
                <Link href="/feed" className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-medium text-sm no-underline hover:no-underline shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all">
                  <Search className="w-4 h-4" /> Explore
                </Link>
              )}
              <Link href={user.role === 'creator' ? '/my-posts' : '/feed'} className="flex items-center gap-2 h-10 px-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-[#9d9db5] no-underline hover:no-underline hover:bg-white/[0.08] transition-all">
                <div className="w-6 h-6 rounded-full bg-[#a855f7]/15 flex items-center justify-center">
                  {user.role === 'creator' ? <Palette className="w-3.5 h-3.5 text-[#a855f7]" /> : <Eye className="w-3.5 h-3.5 text-[#a855f7]" />}
                </div>
                <span className="hidden sm:inline font-medium text-[#f0f0f5]">{user.displayName}</span>
              </Link>
              <button onClick={() => { logout(); router.push('/'); }} className="flex items-center justify-center w-10 h-10 rounded-xl text-[#5c5c78] hover:text-[#f0f0f5] hover:bg-white/[0.04] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="inline-flex items-center h-10 px-5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-medium text-sm no-underline hover:no-underline shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
