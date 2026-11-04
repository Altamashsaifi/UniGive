import React from 'react';
import { Package, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-slate-200 bg-white/70 backdrop-blur-md py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">

          {/* Brand & Mission */}
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200/80 flex items-center justify-center p-0.5">
                <img
                  src="/logo.jpg"
                  alt="UniGive Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">UniGive</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Intra-university peer-to-peer redistribution network. Extending equipment lifecycles, reducing campus waste, and supporting budget-conscious students with zero shipping overhead.
            </p>
          </div>

          {/* Project Team */}
          

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} UniGive Platform. All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
}
