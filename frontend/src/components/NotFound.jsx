import React from 'react';

export default function NotFound({ onGoHome }) {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      onClick={handleHomeClick}
      className="fixed inset-0 w-screen h-screen bg-[#071d22] overflow-hidden flex items-center justify-center select-none cursor-pointer"
    >
      {/* Full-screen background image */}
      <img
        src="/404.jpg"
        alt="404 - This page doesn't exist"
        className="w-full h-full object-cover"
      />

      {/* Subtle floating return home button */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleHomeClick();
          }}
          className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs shadow-2xl shadow-emerald-500/40 transition-all cursor-pointer backdrop-blur-md"
        >
          &larr; Return to UniGive Home
        </button>
      </div>
    </div>
  );
}
