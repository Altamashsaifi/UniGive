import React from 'react';
import {
  ArrowRight,
  Gift,
  Camera,
  Building,
  HeartHandshake
} from 'lucide-react';

export default function HeroBanner({ onOpenCreateListing, onOpenCreateRequest }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-2xl border border-emerald-900/40">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-2 sm:mb-3">
          Pass on textbooks, tools &amp; lab gear to fellow students.
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl">
          Give items away for <span className="text-emerald-400 font-bold">100% Free</span>, swap via <span className="text-purple-300 font-bold">Barter / Exchange</span>, or offer at an affordable <span className="text-amber-300 font-bold">Campus Price</span>. Zero shipping costs — meet securely at the campus library or hostel blocks.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            onClick={onOpenCreateListing}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.96] text-slate-950 font-extrabold text-xs sm:text-sm transition-all duration-150 shadow-lg shadow-emerald-500/25"
          >
            <span>Offer an Item</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCreateRequest}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.96] text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all duration-150 backdrop-blur-sm"
          >
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            <span>Post Wishlist Request</span>
          </button>
        </div>

        {/* 3 Pillars — hidden on mobile, shown on sm+ */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-white/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Free, Barter or ₹ Price</div>
              <div className="text-[11px] text-slate-400">Givers choose donation, book swap, or campus price.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Real Photo Uploads</div>
              <div className="text-[11px] text-slate-400">Direct camera / file upload with instant contact details.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Hostel &amp; Library Handoffs</div>
              <div className="text-[11px] text-slate-400">Zero shipping fees; track &amp; manage posts in My Activity.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
