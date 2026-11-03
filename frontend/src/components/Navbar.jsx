import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  HeartHandshake,
  PlusCircle,
  LogIn,
  LogOut,
  Activity,
  Edit3,
  ChevronDown,
  Menu,
  X,
  Shield
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenCreateListing,
  onOpenCreateRequest,
  onOpenAuth,
  onOpenEditProfile,
  myActivityCount = 0,
}) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <div
            onClick={() => setActiveTab('listings')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Package className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              UniGive
            </span>
          </div>

          {/* Center Tabs — hidden on mobile */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Giveaways</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => setActiveTab('my-activity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'my-activity'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>My Activity</span>
              {myActivityCount > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'my-activity' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {myActivityCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Offer Item button — hidden on very small screens */}
                <button
                  onClick={onOpenCreateListing}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Offer Item</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="group flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 group-hover:ring-2 group-hover:ring-emerald-400 transition relative">
                      {user.full_name ? user.full_name[0] : 'U'}
                      {user.role === 'ADMIN' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-600 rounded-full border-2 border-white" title="Admin"></span>
                      )}
                    </div>
                    <div className="hidden lg:flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{user.full_name}</span>
                      {user.role === 'ADMIN' && (
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                          Admin
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`hidden lg:block w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                      {/* User info header */}
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between gap-1">
                          <div className="text-sm font-bold text-slate-900 truncate">{user.full_name}</div>
                          {user.role === 'ADMIN' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                              <Shield className="w-2.5 h-2.5" />
                              <span>Admin</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-600 truncate" style={{ fontFamily: "'Fira Sans', sans-serif" }}>{user.email}</div>
                      </div>

                      {/* Offer Item — visible in dropdown on mobile */}
                      <button
                        onClick={() => { setProfileOpen(false); onOpenCreateListing(); }}
                        className="sm:hidden w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Offer an Item</span>
                      </button>

                      {/* Edit Profile */}
                      <button
                        onClick={() => { setProfileOpen(false); onOpenEditProfile(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      {/* Sign Out */}
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger — shown on mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fadeIn">
          <button
            onClick={() => handleTabChange('listings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'listings' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Giveaways
          </button>
          <button
            onClick={() => handleTabChange('requests')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'requests' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            Wishlist
          </button>
          <button
            onClick={() => handleTabChange('my-activity')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'my-activity' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            My Activity
            {myActivityCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                {myActivityCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
}
