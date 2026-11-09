import React, { useState } from 'react';
import { HeartHandshake, Instagram, ExternalLink, Mail, Plus, MessageCircle, Trash2, Shield } from 'lucide-react';

const CATEGORY_NAMES = {
  BOOKS: 'Textbook / Notes',
  LAB_EQUIPMENT: 'Lab Equipment',
  ELECTRONICS: 'Electronics',
  STATIONERY: 'Stationery',
  OTHER: 'General',
};

export default function SeekerFeed({ requests, onOpenCreateRequest, currentUser, onRequireAuth, onDeleteRequest }) {
  const [activeContactId, setActiveContactId] = useState(null);
  const [adminDeleteId, setAdminDeleteId] = useState(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleContactSeekerClick = (reqId) => {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth('Please sign in with your campus account (@college.ac.in) to contact this seeker.');
      }
      return;
    }
    setActiveContactId(activeContactId === reqId ? null : reqId);
  };

  return (
    <div className="space-y-4">
      {/* Feed Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-600" />
            <span>Campus Wishlist & Seeker Board</span>
          </h2>
          <p className="text-xs text-slate-500">
            Check if you have any spare gear or textbooks that fellow campus students need.
          </p>
        </div>
        <button
          onClick={onOpenCreateRequest}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Wishlist Request</span>
        </button>
      </div>

      {/* Request Grid */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No active wishlist requests</h3>
          <p className="text-xs text-slate-400 mt-1">
            Need something for your lab or semester courses? Post a request to notify campus seniors!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                    {CATEGORY_NAMES[req.category] || req.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  {req.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {req.description || 'No additional details provided.'}
                </p>
              </div>

              {/* Seeker Info and Contact Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {req.seeker_name ? req.seeker_name[0] : 'S'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{req.seeker_name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{req.seeker_department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <div>
                      {adminDeleteId === req.id ? (
                        <div className="flex items-center gap-1 animate-fadeIn">
                          <button
                            onClick={() => {
                              if (onDeleteRequest) onDeleteRequest(req.id);
                              setAdminDeleteId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setAdminDeleteId(null)}
                            className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAdminDeleteId(req.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Admin Moderation: Delete this request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleContactSeekerClick(req.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact Seeker</span>
                  </button>
                </div>
              </div>

              {/* Contact Reveal Tray */}
              {activeContactId === req.id && (
                <div className="mt-3 p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs animate-fadeIn">
                  <div className="text-[11px] font-bold text-teal-950 flex items-center justify-between">
                    <span>Direct Campus Contact:</span>
                    <span className="text-[10px] text-teal-700">Connect for Handoff</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {req.seeker_social_handle && (
                      <a
                        href={`https://instagram.com/${req.seeker_social_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg text-xs font-bold text-pink-900 hover:bg-pink-100 transition shadow-xs"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        <span>Instagram: {req.seeker_social_handle}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-pink-500" />
                      </a>
                    )}

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(req.seeker_email)}&su=${encodeURIComponent(`UniGive: I have ${req.title}`)}&body=${encodeURIComponent(`Hi,\n\nI saw your wishlist request for "${req.title}" on UniGive. I have this item and would like to arrange an in-person handoff.\n\nThanks!`)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(req.seeker_email)}&su=${encodeURIComponent(`UniGive: I have ${req.title}`)}&body=${encodeURIComponent(`Hi,\n\nI saw your wishlist request for "${req.title}" on UniGive. I have this item and would like to arrange an in-person handoff.\n\nThanks!`)}`;
                        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email Seeker</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
