import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import {
  X,
  UploadCloud,
  MapPin,
  Tag,
  ShieldAlert,
  Sparkles,
  Gift,
  RefreshCw,
  IndianRupee,
  Check,
  Trash2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'BOOKS', label: 'Books & Course Notes' },
  { id: 'LAB_EQUIPMENT', label: 'Lab Equipment & Coats' },
  { id: 'ELECTRONICS', label: 'Electronics & Calculators' },
  { id: 'STATIONERY', label: 'Stationery & Drafters' },
  { id: 'OTHER', label: 'Hostel Gear & Other' },
];

const CONDITIONS = [
  { id: 'NEW', label: 'Brand New (Unused)' },
  { id: 'LIKE_NEW', label: 'Like New (Barely Used)' },
  { id: 'GOOD', label: 'Good (Minor wear, fully functional)' },
  { id: 'FAIR', label: 'Fair (Visible wear, fully functional)' },
];

const PRESET_PICKUPS = [
  'MIET Main Gate',
  'Admin Block',
  'Central Library',
  'Stationary',
  'Begumpul - Idea Lab',
  'Canteen - Cafeteria',
  'Raman Block',
  'LP',
  'Shroff Block',
  'Audi ENtrance',
  'B Block',
  'Boys Hostel - 1',
  'Boys Hostel - 2',
  'Azim Premji Block - M Block',
  'P Block',
  'Khurana Block'
];

export default function CreateListingModal({ isOpen, onClose, onSubmit }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'BOOKS',
    condition: 'GOOD',
    give_type: 'FREE',
    price: '',
    exchange_for: '',
    pickup_location: '',
    image_url: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        category: 'BOOKS',
        condition: 'GOOD',
        give_type: 'FREE',
        price: '',
        exchange_for: '',
        pickup_location: '',
        image_url: '',
      });
      setImagePreview('');
      setImageFile(null);
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file must be under 10MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setImagePreview(dataUrl);
        setFormData((prev) => ({ ...prev, image_url: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide an item title.');
      return;
    }

    if (formData.give_type === 'BARTER' && !formData.exchange_for.trim()) {
      setError('Please specify what item you would like in exchange.');
      return;
    }

    if (formData.give_type === 'AMOUNT' && (!formData.price || parseFloat(formData.price) <= 0)) {
      setError('Please enter a valid amount in ₹.');
      return;
    }

    if (!formData.pickup_location) {
      setError('Please select a campus pickup spot.');
      return;
    }

    try {
      setLoading(true);
      let resolvedImageUrl = formData.image_url;
      if (imageFile) {
        const cloudUrl = await api.uploadItemPhoto(imageFile);
        if (cloudUrl) {
          resolvedImageUrl = cloudUrl;
        }
      }

      await onSubmit({
        ...formData,
        price: formData.give_type === 'AMOUNT' ? parseFloat(formData.price) : 0,
        exchange_for: formData.give_type === 'BARTER' ? formData.exchange_for : null,
        image_url:
          resolvedImageUrl ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post an Item Offer</h2>
              <p className="text-xs text-slate-500">Give away, exchange, or offer at campus price</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Giving Type Selection (Free, Barter, Amount) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              How would you like to offer this item? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Option 1: Free */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, give_type: 'FREE' })}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                  formData.give_type === 'FREE'
                    ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Gift className={`w-4 h-4 ${formData.give_type === 'FREE' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {formData.give_type === 'FREE' && <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">100% Free</div>
                  <div className="text-[10px] text-slate-500">Gift / Donation</div>
                </div>
              </button>

              {/* Option 2: Barter / Exchange */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, give_type: 'BARTER' })}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                  formData.give_type === 'BARTER'
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <RefreshCw className={`w-4 h-4 ${formData.give_type === 'BARTER' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {formData.give_type === 'BARTER' && <Check className="w-3.5 h-3.5 text-purple-600 font-bold" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Exchange / Barter</div>
                  <div className="text-[10px] text-slate-500">Swap for another item</div>
                </div>
              </button>

              {/* Option 3: Fixed Amount */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, give_type: 'AMOUNT' })}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                  formData.give_type === 'AMOUNT'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <IndianRupee className={`w-4 h-4 ${formData.give_type === 'AMOUNT' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {formData.give_type === 'AMOUNT' && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Campus Price</div>
                  <div className="text-[10px] text-slate-500">Fixed ₹ Amount</div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Input for Barter */}
          {formData.give_type === 'BARTER' && (
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-purple-950 mb-1">
                What item or book would you like in return? <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 4th Sem Operating Systems textbook or Arduino Uno shield"
                value={formData.exchange_for}
                onChange={(e) => setFormData({ ...formData, exchange_for: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
              />
            </div>
          )}

          {/* Conditional Input for Fixed Amount */}
          {formData.give_type === 'AMOUNT' && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Requested Campus Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-700">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 150"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2 text-sm bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={150}
              placeholder="e.g. Engineering Graphics Mini Drafter, Casio FX-991EX..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Notes</label>
            <textarea
              rows={2}
              placeholder="State semester completed, highlight notes/markings, include any accessories..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Campus Pickup Spot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Pickup Spot</label>
            <select
              value={formData.pickup_location}
              onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Select pickup spot</option>
              {PRESET_PICKUPS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Real Image Upload Button & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Real Item Photo <span className="text-slate-400 font-normal">(Upload from device or enter link)</span>
            </label>
            
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white transition shadow-md"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Real photo attached
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Click to Upload Real Photo of Item
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Supports PNG, JPG, WEBP (Instant device camera or file upload)
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {/* Or direct image URL */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Or Image URL:</span>
                <input
                  type="url"
                  placeholder="https://... (direct image link)"
                  value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="flex-1 px-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              {loading ? 'Publishing...' : 'Publish Offer'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
