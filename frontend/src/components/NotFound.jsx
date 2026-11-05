import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound({ onGoHome }) {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleHomeClick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none">
      {/* 404 Visual Card */}
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/40 bg-slate-900/60 backdrop-blur-md p-3 sm:p-5 mb-6 animate-fadeIn">
        <img
          src="/404.jpg"
          alt="404 - This page doesn't exist"
          className="w-full h-auto rounded-2xl object-cover shadow-inner"
        />
      </div>

      {/* Return Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
        <button
          onClick={handleHomeClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all duration-150 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Campus Giveaways</span>
        </button>

        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm border border-white/15 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-500">
        UniGive &bull; Intra-University Peer-to-Peer Redistribution
      </p>
    </div>
  );
}
