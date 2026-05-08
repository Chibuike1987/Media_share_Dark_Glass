'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Upload, Search, Sparkles, Shield, Zap, Cpu } from 'lucide-react';

export default function LandingPage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="animate-[fadeInUp_0.6s_ease]">
      {/* Hero */}
      <section className="px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
            <span className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
              Share Your Vision.
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">
              Discover Amazing Content.
            </span>
          </h1>
          <p className="text-lg text-[#9d9db5] leading-relaxed max-w-xl mx-auto mb-12">
            An AI-powered media platform built on Azure. Upload stunning images
            and discover them through intelligent search and automated content moderation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isLoggedIn && user ? (
              user.role === 'creator' ? (
                <Link href="/upload" className="inline-flex items-center gap-2 h-13 px-8 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white rounded-2xl font-semibold text-base no-underline hover:no-underline shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all">
                  <Upload className="w-5 h-5" /> Start Uploading
                </Link>
              ) : (
                <Link href="/feed" className="inline-flex items-center gap-2 h-13 px-8 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white rounded-2xl font-semibold text-base no-underline hover:no-underline shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all">
                  <Search className="w-5 h-5" /> Explore Feed
                </Link>
              )
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center h-13 px-8 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white rounded-2xl font-semibold text-base no-underline hover:no-underline shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all">
                  Get Started
                </Link>
                <Link href="/login" className="inline-flex items-center h-13 px-8 bg-white/[0.04] text-[#f0f0f5] border border-white/[0.08] rounded-2xl font-semibold text-base no-underline hover:no-underline hover:bg-white/[0.08] hover:border-[#a855f7]/30 transition-all">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#f0f0f5]">Powered by Azure AI</h2>
            <p className="text-[#9d9db5]">Everything you need to manage and discover visual content.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Cpu, title: 'AI Vision', desc: 'Automatic tagging and captioning powered by Azure AI.' },
              { icon: Shield, title: 'Content Safety', desc: 'Automated moderation flags inappropriate content.' },
              { icon: Search, title: 'Smart Search', desc: 'Find images by AI-detected tags and captions.' },
              { icon: Zap, title: 'Cloud-Native', desc: 'Cosmos DB, Blob Storage, and App Service.' },
            ].map((f) => (
              <div key={f.title} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center hover:border-[#a855f7]/30 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-300 group">
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-[#a855f7]/10 group-hover:bg-[#a855f7]/20 transition-colors">
                  <f.icon className="w-7 h-7 text-[#a855f7]" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-[#f0f0f5]">{f.title}</h3>
                <p className="text-sm text-[#5c5c78] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
