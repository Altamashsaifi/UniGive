import React, { useState } from 'react';
import {
  MapPin,
  MessageCircle,
  Mail,
  CheckCircle,
  Clock,
  Check,
  ExternalLink,
  Gift,
  RefreshCw,
  IndianRupee,
  Building,
  Instagram,
  Trash2,
  Shield
} from 'lucide-react';

const CONDITION_COLORS = {
  NEW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  LIKE_NEW: 'bg-teal-100 text-teal-800 border-teal-300',
  GOOD: 'bg-blue-100 text-blue-800 border-blue-300',
  FAIR: 'bg-amber-100 text-amber-800 border-amber-300',
};

const CATEGORY_NAMES = {
  BOOKS: 'Textbook / Notes',
  LAB_EQUIPMENT: 'Lab Equipment',
  ELECTRONICS: 'Electronics',
  STATIONERY: 'Stationery',
  OTHER: 'General',
};

export default function ListingCard({ listing, currentUser, onUpdateStatus, onDeleteListing, onRequireAuth }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [confirmAdminDelete, setConfirmAdminDelete] = useState(false);

  // Ownership check
  const isGiver =
    currentUser &&
    (currentUser.id === listing.donor_id ||
      (currentUser.email && listing.donor_email && currentUser.email.toLowerCase() === listing.donor_email.toLowerCase()));

  const isAdmin = currentUser?.role === 'ADMIN';

  // Auth check
  const handleContactClick = () => {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth('Please sign in with your campus account (@college.ac.in) to view contact details.');
      }
      return;
    }
    setShowContactModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
            <CheckCircle className="w-3 h-3" />
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
            <Clock className="w-3 h-3" />
            Reserved
          </span>
        );
      case 'CLAIMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500 text-white shadow-sm">
            <Check className="w-3 h-3" />
            Claimed
          </span>
        );
      default:
        return null;
    }
  };

  const renderGivingTypeBadge = () => {
    if (listing.give_type === 'BARTER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
          <RefreshCw className="w-3 h-3 text-purple-600" />
          Barter / Exchange
        </span>
      );
    }
    if (listing.give_type === 'AMOUNT') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
          <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
          <span className="tabular-nums">{listing.price}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <Gift className="w-3 h-3 text-emerald-600" />
        Free Giveaway
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group">
      
      {/* Top Banner / Image Area */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            No Photo Provided
          </div>
        )}

        {/* Status Badge in top-right */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(listing.status)}
        </div>

        {/* Category Pill in top-left */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {CATEGORY_NAMES[listing.category] || listing.category}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Giving Type & Condition Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {renderGivingTypeBadge()}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                CONDITION_COLORS[listing.condition] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {listing.condition?.replace('_', ' ')}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-emerald-700 transition line-clamp-2">
            {listing.title}
          </h3>

          {/* Barter details if specified */}
          {listing.give_type === 'BARTER' && listing.exchange_for && (
            <div className="my-2 p-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-xs">
              <span className="font-bold">Looking to swap for:</span> {listing.exchange_for}
            </div>
          )}

          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {listing.description || 'No additional details provided by giver.'}
          </p>
        </div>

        {/* Footer info: pickup location & giver control */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          
          {/* Pickup location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium truncate">{listing.pickup_location || 'Campus Premises'}</span>
          </div>

          {/* Giver info & actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                {listing.donor_name ? listing.donor_name[0] : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                  <span>{listing.donor_name}</span>
                  {isGiver && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">
                      You
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{listing.donor_department}</div>
              </div>
            </div>

            {/* Actions for Giver vs Non-Giver + Admin Moderation */}
            <div className="flex items-center gap-2">
              {isAdmin && !isGiver && (
                <div className="flex items-center gap-1 pl-1 border-r border-slate-200 pr-2">
                  {confirmAdminDelete ? (
                    <div className="flex items-center gap-1 animate-fadeIn">
                      <button
                        onClick={() => onDeleteListing && onDeleteListing(listing.id)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmAdminDelete(false)}
                        className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmAdminDelete(true)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Admin Moderation: Delete this listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {isGiver ? (
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800">Status:</span>
                  <select
                    value={listing.status}
                    onChange={(e) => onUpdateStatus && onUpdateStatus(listing.id, e.target.value)}
                    className="text-xs font-bold bg-white text-emerald-900 border border-emerald-300 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="CLAIMED">Claimed</option>
                  </select>
                </div>
              ) : (
                <button
                  onClick={handleContactClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-[0.96] text-white shadow-sm transition-all duration-150"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Giver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Contact {listing.donor_name}</h3>
                  <p className="text-[11px] text-slate-500">Arrange campus handoff</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">ITEM</span>
                <span className="font-bold text-slate-800">{listing.title}</span>
              </div>

              {listing.donor_hostel_block && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-700">
                  <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hostel / Campus Room</span>
                    <span className="font-semibold">{listing.donor_hostel_block}</span>
                  </div>
                </div>
              )}

              {/* Instagram */}
              {listing.donor_social_handle && (
                <a
                  href={`https://instagram.com/${listing.donor_social_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-pink-900 hover:bg-pink-100 transition font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram: {listing.donor_social_handle}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                </a>
              )}

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(listing.donor_email)}&su=${encodeURIComponent(`UniGive: Interested in ${listing.title}`)}&body=${encodeURIComponent(`Hi,\n\nI saw your listing for "${listing.title}" on UniGive and would like to arrange an in-person handoff at ${listing.pickup_location || 'campus'}.\n\nThanks!`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-900 hover:bg-red-100 transition font-bold"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span className="truncate">Gmail: {listing.donor_email}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-red-500" />
              </a>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
