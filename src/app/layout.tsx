import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaShare — AI-Powered Media Sharing",
  description: "Upload, discover, and engage with stunning visual content. Powered by Azure AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Ambient gradient glow — contained within viewport */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[rgba(124,58,237,0.08)] blur-[120px]" />
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-[rgba(236,72,153,0.06)] blur-[120px]" />
          <div className="absolute bottom-[-15%] left-[30%] w-[45%] h-[50%] rounded-full bg-[rgba(59,130,246,0.05)] blur-[120px]" />
        </div>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
