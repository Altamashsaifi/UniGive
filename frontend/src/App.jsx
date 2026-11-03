import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilters from './components/CategoryFilters';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import ListingCard from './components/ListingCard';
import SeekerFeed from './components/SeekerFeed';
import MyActivity from './components/MyActivity';
import CreateListingModal from './components/CreateListingModal';
import CreateRequestModal from './components/CreateRequestModal';
import EditProfileModal from './components/EditProfileModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { Sparkles, PackageOpen } from 'lucide-react';

export default function App() {
  const { user, token } = useAuth();

  // Navigation tab: 'listings' | 'requests' | 'my-activity'
  const [activeTab, setActiveTab] = useState('listings');

  // Filter States for Giveaway Feed
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');

  // Data States
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Requirement 2 & 7: Helper to require sign-in
  const handleRequireAuth = (message = 'Please sign in with your campus account (@college.ac.in) to continue.') => {
    showToast(message, 'info');
    setIsAuthOpen(true);
  };

  // Requirement 1: Fetch ALL listings without restricting by status so MyActivity retains them
  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedListings, fetchedRequests] = await Promise.all([
        api.getListings(token, {
          category: selectedCategory,
          search: searchQuery,
          condition: conditionFilter,
          status: 'ALL', // Fetch all statuses so status changes never remove posts from My Activity
        }),
        api.getRequests(token, {
          category: selectedCategory,
          search: searchQuery,
        }),
      ]);
      setListings(fetchedListings || []);
      setRequests(fetchedRequests || []);
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, selectedCategory, searchQuery, conditionFilter]);

  // Filter listings for the Giveaways Feed tab based on statusFilter
  const feedListings = useMemo(() => {
    if (statusFilter === 'ALL') return listings;
    return listings.filter((item) => item.status === statusFilter);
  }, [listings, statusFilter]);

  // Compute category counts for badge indicators
  const categoryCounts = useMemo(() => {
    const counts = { ALL: feedListings.length };
    feedListings.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [feedListings]);

  // Compute my personal activity count
  const myActivityCount = useMemo(() => {
    if (!user) return 0;
    const myOffersCount = listings.filter(
      (item) =>
        item.donor_id === user.id ||
        (user.email && item.donor_email && user.email.toLowerCase() === item.donor_email.toLowerCase())
    ).length;
    const myRequestsCount = requests.filter(
      (req) =>
        req.seeker_id === user.id ||
        (user.email && req.seeker_email && user.email.toLowerCase() === req.seeker_email.toLowerCase())
    ).length;
    return myOffersCount + myRequestsCount;
  }, [listings, requests, user]);

  // Handlers
  const handleCreateListing = async (listingData) => {
    if (!user) {
      handleRequireAuth('Please sign in to offer an item.');
      return;
    }
    const created = await api.createListing(token, listingData, user);
    showToast(`"${created.title}" successfully added!`);
    fetchData();
  };

  const handleCreateRequest = async (requestData) => {
    if (!user) {
      handleRequireAuth('Please sign in to post a wishlist request.');
      return;
    }
    const created = await api.createRequest(token, requestData, user);
    showToast(`Request for "${created.title}" published!`);
    fetchData();
  };

  const handleUpdateStatus = async (id, status) => {
    // Optimistically update state so status change is instant in both Feed and My Activity
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      await api.updateListingStatus(token, id, status);
      showToast(`Availability status updated to ${status}.`);
    } catch (err) {
      console.warn('Backend sync warning on updateListingStatus:', err);
      showToast(`Status updated to ${status}.`);
    }
  };

  const handleDeleteListing = async (id) => {
    await api.deleteListing(token, id);
    showToast('Your offer has been taken down.');
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteRequest = async (id) => {
    await api.deleteRequest(token, id);
    showToast('Your wishlist request has been taken down.');
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setConditionFilter('');
    setStatusFilter('AVAILABLE');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navbar with 3 tabs and Profile Edit button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateListing={() => (user ? setIsCreateListingOpen(true) : handleRequireAuth('Please sign in to offer an item.'))}
        onOpenCreateRequest={() => (user ? setIsCreateRequestOpen(true) : handleRequireAuth('Please sign in to post a request.'))}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        myActivityCount={myActivityCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Hero Section (only on listings/giveaway tab) */}
        {activeTab === 'listings' && (
          <HeroBanner
            onOpenCreateListing={() => (user ? setIsCreateListingOpen(true) : handleRequireAuth('Please sign in to offer an item.'))}
            onOpenCreateRequest={() => (user ? setIsCreateRequestOpen(true) : handleRequireAuth('Please sign in to post a request.'))}
          />
        )}

        {/* Tab 1: Giveaways Feed */}
        {activeTab === 'listings' && (
          <div>
            {/* Category Pill Filters */}
            <CategoryFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />

            {/* Search, Status & Condition Bar */}
            <SearchAndFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              conditionFilter={conditionFilter}
              setConditionFilter={setConditionFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              totalCount={feedListings.length}
              onReset={handleResetFilters}
            />

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : feedListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
                <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Giveaway Items Found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  No items matched your current filter or search criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    currentUser={user}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteListing={handleDeleteListing}
                    onRequireAuth={handleRequireAuth}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Seeker Wishlist Feed */}
        {activeTab === 'requests' && (
          <SeekerFeed
            requests={requests}
            currentUser={user}
            onOpenCreateRequest={() => (user ? setIsCreateRequestOpen(true) : handleRequireAuth('Please sign in to post a request.'))}
            onRequireAuth={handleRequireAuth}
            onDeleteRequest={handleDeleteRequest}
          />
        )}

        {/* Tab 3: My Campus Activity (Requirement 1 & 7) */}
        {activeTab === 'my-activity' && (
          <MyActivity
            currentUser={user}
            listings={listings} // Receives all listings so changing status never removes the post
            requests={requests}
            onUpdateStatus={handleUpdateStatus}
            onDeleteListing={handleDeleteListing}
            onDeleteRequest={handleDeleteRequest}
            onOpenCreateListing={() => (user ? setIsCreateListingOpen(true) : handleRequireAuth())}
            onOpenCreateRequest={() => (user ? setIsCreateRequestOpen(true) : handleRequireAuth())}
            onRequireAuth={handleRequireAuth}
          />
        )}
      </main>

      {/* Footer (Requirement 8) */}
      <Footer />

      {/* Modals */}
      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onSubmit={handleCreateListing}
      />

      <CreateRequestModal
        isOpen={isCreateRequestOpen}
        onClose={() => setIsCreateRequestOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-slideUp">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
