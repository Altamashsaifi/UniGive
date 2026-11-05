import React, { useState } from 'react';
import {
  Package,
  HeartHandshake,
  Trash2,
  CheckCircle,
  Clock,
  Check,
  AlertTriangle,
  Gift,
  RefreshCw,
  IndianRupee,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  MapPin,
  LogIn
} from 'lucide-react';

export default function MyActivity({
  currentUser,
  listings,
  requests,
  onUpdateStatus,
  onDeleteListing,
  onDeleteRequest,
  onOpenCreateListing,
  onOpenCreateRequest,
  onRequireAuth,
}) {
  const [subTab, setSubTab] = useState('offers'); // 'offers' | 'requests'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Auth gate
  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Campus Sign In Required</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Please sign in with your verified institutional email (<span className="text-emerald-600 font-mono font-bold">@college.ac.in</span>) to view and manage your posted giveaway offers and wishlist requests.
        </p>
        <button
          onClick={() => onRequireAuth && onRequireAuth('Please sign in to view your campus activity.')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / Register</span>
        </button>
      </div>
    );
  }

  // User offers
  const myOffers = listings.filter(
    (item) =>
      item.donor_id === currentUser?.id ||
      (currentUser?.email && item.donor_email && currentUser.email.toLowerCase() === item.donor_email.toLowerCase())
  );

  const myRequests = requests.filter(
    (req) =>
      req.seeker_id === currentUser?.id ||
      (currentUser?.email && req.seeker_email && currentUser.email.toLowerCase() === req.seeker_email.toLowerCase())
  );

  const handleDeleteOffer = (id) => {
    if (onDeleteListing) {
      onDeleteListing(id);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteReq = (id) => {
    if (onDeleteRequest) {
      onDeleteRequest(id);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Activity Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Activity Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {currentUser.full_name}'s Campus Posts
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Manage your active offers, toggle item availability, or take down completed posts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateListing}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md"
            >
              + New Offer
            </button>
            <button
              onClick={onOpenCreateRequest}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition"
            >
              + New Request
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-xs text-slate-400">Total Offers</div>
            <div className="text-xl font-black text-emerald-400 mt-1 tabular-nums">{myOffers.length}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-xs text-slate-400">Available Offers</div>
            <div className="text-xl font-black text-white mt-1 tabular-nums">
              {myOffers.filter((o) => o.status === 'AVAILABLE').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-xs text-slate-400">Active Requests</div>
            <div className="text-xl font-black text-teal-400 mt-1 tabular-nums">{myRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: My Offers vs My Requests */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            subTab === 'offers'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Offers ({myOffers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            subTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>My Seeker Requests ({myRequests.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: My Offers */}
      {subTab === 'offers' && (
        <div className="space-y-4">
          {myOffers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-6">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">You haven't posted any offers yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Have semester books, calculators, or lab coats you no longer need?
              </p>
              <button
                onClick={onOpenCreateListing}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
              >
                Post an Offer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myOffers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.give_type === 'BARTER' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            Barter
                          </span>
                        ) : item.give_type === 'AMOUNT' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            ₹{item.price}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Free
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.description || 'No description'}
                      </p>
                      
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.pickup_location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    
                    {/* Status select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Availability:</span>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'RESERVED'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="CLAIMED">Claimed</option>
                      </select>
                    </div>

                    {/* Take Down Button */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1.5 animate-fadeIn">
                        <button
                          onClick={() => handleDeleteOffer(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Confirm Take Down
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                        title="Remove / Take down this offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Take Down</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: My Requests */}
      {subTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-6">
              <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No active wishlist requests</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Need academic gear or books? Post a request for campus peers to see!
              </p>
              <button
                onClick={onOpenCreateRequest}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
              >
                Post Wishlist Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                        {req.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{req.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {req.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Actions: Take Down Request */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Status: <span className="text-teal-700 font-bold">Active Seeker Request</span>
                    </span>

                    {deleteConfirmId === req.id ? (
                      <div className="flex items-center gap-1.5 animate-fadeIn">
                        <button
                          onClick={() => handleDeleteReq(req.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Confirm Take Down
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(req.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Take Down</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
