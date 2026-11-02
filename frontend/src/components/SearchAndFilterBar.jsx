import React from 'react';
import { Search, SlidersHorizontal, CheckCircle2, RotateCcw } from 'lucide-react';

export default function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  conditionFilter,
  setConditionFilter,
  statusFilter,
  setStatusFilter,
  totalCount,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm">
      <div className="flex flex-col gap-3">

        {/* Search Input — full width always */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, textbooks, author, or pickup spot..."
            className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Row — wraps on small screens */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Condition Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 hidden xs:inline">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">Any Condition</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
          </div>

          {/* Available Only Toggle */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              statusFilter === 'AVAILABLE'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Available Only</span>
          </button>

          {/* Reset Filters */}
          {(searchQuery || conditionFilter || statusFilter !== 'AVAILABLE') && (
            <button
              onClick={onReset}
              title="Reset all filters"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Item count — pushed to end */}
          <div className="ml-auto text-xs font-medium text-slate-400">
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </div>
        </div>

      </div>
    </div>
  );
}
