import React from 'react';
import { BookOpen, Wrench, Cpu, PenTool, LayoutGrid, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Items', icon: LayoutGrid },
  { id: 'BOOKS', label: 'Textbooks & Notes', icon: BookOpen },
  { id: 'LAB_EQUIPMENT', label: 'Lab Equipment', icon: Wrench },
  { id: 'ELECTRONICS', label: 'Electronics & Calc', icon: Cpu },
  { id: 'STATIONERY', label: 'Drawing & Stationery', icon: PenTool },
  { id: 'OTHER', label: 'Hostel & Other', icon: Layers },
];

export default function CategoryFilters({ selectedCategory, onSelectCategory, counts = {} }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        const count = counts[cat.id];

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
            {count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
