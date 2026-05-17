/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, List as MenuIcon, MapPin, Compass, PlusCircle, User, UtensilsCrossed, RefreshCw, Search, Settings, Rss, X, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { MapScreen } from './components/MapScreen';
import { ListScreen } from './components/ListScreen';
import { DetailScreen } from './components/DetailScreen';
import { ChatScreen } from './components/ChatScreen';
import { OrderScreen } from './components/OrderScreen';
import { FeedScreen } from './components/FeedScreen';
import { CreateMenuScreen } from './components/CreateMenuScreen';
import { AddFormsScreen } from './components/AddFormsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SpinWheelScreen } from './components/SpinWheelScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Restaurant, FoodPost, MenuItem, Review } from './data/mock';
import { supabase } from './lib/supabase';

type ViewMode = 'map' | 'list' | 'detail' | 'chat' | 'order' | 'feed' | 'create_menu' | 'create_resto' | 'create_post' | 'profile' | 'spin' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewMode>('list');
  const [prevView, setPrevView] = useState<ViewMode>('list');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodPosts, setFoodPosts] = useState<FoodPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [] as string[],
    minRating: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        { data: rData, error: rErr },
        { data: pData, error: pErr },
        { data: mData, error: mErr },
        { data: revData, error: revErr }
      ] = await Promise.all([
        supabase.from('restaurants').select('*'),
        supabase.from('food_posts').select('*'),
        supabase.from('menu_items').select('*'),
        supabase.from('reviews').select('*')
      ]);

      if (rErr) throw rErr;
      if (pErr) throw pErr;
      if (mErr) throw mErr;
      if (revErr) throw revErr;

      const mappedRestaurants: Restaurant[] = (rData || []).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        foodCategories: r.food_categories || [],
        rating: r.rating || 0,
        reviewCount: r.review_count || 0,
        distance: r.distance || "0 m",
        priceRange: r.price_range || "",
        address: r.address || "",
        phone: r.phone || "",
        hours: r.hours || "",
        image: r.image || "",
        coords: [r.lat || 0, r.lng || 0],
        isAvailableOnline: r.is_available_online || false,
        menu: (mData || [])
          .filter(m => m.restaurant_id === r.id)
          .map(m => ({
            id: m.id,
            name: m.name,
            description: m.description,
            price: m.price,
            image: m.image,
            category: m.category,
          })),
        reviews: (revData || [])
          .filter(rev => rev.restaurant_id === r.id)
          .map(rev => ({
            id: rev.id,
            user: rev.user_name || rev.user,
            rating: rev.rating,
            comment: rev.comment,
          })),
      }));

      const mappedPosts: FoodPost[] = (pData || []).map(p => ({
        id: p.id,
        user: p.user_name,
        userAvatar: p.user_avatar,
        content: p.content,
        image: p.image,
        likes: p.likes || 0,
        comments: p.comments || 0,
        timeAgo: "Baru saja",
        location: p.location,
      }));

      setRestaurants(mappedRestaurants);
      setFoodPosts(mappedPosts);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data from Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant, from: 'map' | 'list') => {
    setSelectedRestaurant(restaurant);
    setPrevView(view);
    if (view === 'list') {
      setIsDetailModalOpen(true);
    } else {
      setView('detail');
    }
  };

  const handleUpdateCart = (itemId: string, delta: number) => {
    setCart(prev => {
      const newQ = Math.max(0, (prev[itemId] || 0) + delta);
      const newCart = { ...prev };
      if (newQ === 0) delete newCart[itemId];
      else newCart[itemId] = newQ;
      return newCart;
    });
  };

  return (
    <div className={`h-[100dvh] flex flex-col font-sans overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] text-[#FAF9F6]' : 'bg-white text-[#4B2E2A]'}`}>
      {/* Top Global Header (Dynamic based on View) */}
      {(view === 'list' || view === 'feed' || view === 'map') && !['settings', 'profile'].includes(view) && (
        <div className={`shrink-0 z-[110] sticky top-0 transition-colors duration-300 border-b shadow-sm ${isDarkMode ? 'bg-[#1C1917]/80 border-[#404040]' : 'bg-[#FAF9F6]/80 border-[#E7E5E4]/50'} backdrop-blur-xl`}>
          <div className="p-4 md:p-6 lg:p-8 lg:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 max-w-[1440px] mx-auto overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 md:space-y-1 cursor-pointer group shrink-0" onClick={() => setView('list')}>
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter transition-all duration-500 group-hover:text-[#FF611D] ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>
                  Nemuin<span className="text-[#FF611D]">.</span>
                </h1>
                <p className={`text-[10px] md:text-sm font-bold italic tracking-tight transition-colors ${isDarkMode ? 'text-[#FAF9F6]/60' : 'text-[#78716C]'}`}>
                  Semuanya pasti ketemu di nemuin
                </p>
              </div>

              {/* Mobile Profile & Spin Shortcut */}
              <div className="flex md:hidden items-center gap-2">
                <button 
                  onClick={() => setView('spin')}
                  className="w-10 h-10 bg-[#FF611D] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('profile')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-white border-[#E7E5E4] text-[#78716C]'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
              {/* Only show Search on Home (list) page */}
              {view === 'list' && (
                <div className={`h-12 md:h-14 flex-1 max-w-xl rounded-[1rem] md:rounded-[1.25rem] border flex items-center px-4 md:px-5 gap-2 md:gap-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#FF611D] focus-within:border-transparent ${
                  isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'
                }`}>
                  <Search className="w-5 h-5 text-[#FF611D]" />
                  <input 
                    type="text" 
                    placeholder="Lagi pengen makan apa?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent border-none focus:outline-none text-sm md:text-base font-bold w-full transition-colors ${isDarkMode ? 'text-white placeholder:text-[#525252]' : 'text-[#4B2E2A]'}`}
                  />
                  <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`p-1.5 md:p-2 rounded-lg transition-colors hover:bg-orange-50 ${isDarkMode ? 'hover:bg-zinc-800' : ''}`}
                  >
                    <SlidersHorizontal className={`w-4 h-4 md:w-5 md:h-5 ${activeFilters.priceRange.length > 0 || activeFilters.minRating > 0 ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`} />
                  </button>
                </div>
              )}

              <div className="hidden md:flex items-center gap-3">
                {/* Lucky Spin Button - Only on Home */}
                {view === 'list' && (
                  <button 
                    onClick={() => setView('spin')}
                    className="h-14 px-6 bg-[#FF611D] text-white rounded-[1.25rem] font-black italic tracking-tighter flex items-center gap-3 shadow-[0_8px_25px_rgba(255,97,29,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    LUCKY SPIN
                  </button>
                )}

                {/* Profile Button - Hidden on map view */}
                {view !== 'map' && (
                  <button
                    onClick={() => setView('profile')}
                    className={`h-14 w-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 shadow-sm border ${
                      view === 'profile' 
                        ? 'bg-[#FF611D] text-white border-[#FF611D] shadow-[0_8px_25px_rgba(255,97,29,0.3)]' 
                        : isDarkMode 
                          ? 'bg-[#262626] border-[#404040] text-[#A8A29E] hover:text-white hover:border-[#FF611D]'
                          : 'bg-white border-[#E7E5E4] text-[#78716C] hover:text-[#FF611D] hover:border-[#FF611D]'
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation - Full Height */}
        <div 
          className={`hidden lg:flex flex-col min-h-screen sticky top-0 transition-all duration-500 z-[102] border-r w-20 hover:w-64 group/sidebar ${
            isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'
          }`}
        >
          <div className="flex flex-col h-full py-8 px-3">
            <nav className="flex flex-col gap-4">
              {[
                { id: 'list', label: 'Home', icon: Home },
                { id: 'map', label: 'Explore Map', icon: MapPin },
                { id: 'feed', label: 'Feeds', icon: Rss },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <div key={item.id} className="relative group flex items-center">
                  <button
                    onClick={() => { setView(item.id as any); setPrevView('list'); }}
                    className={`flex items-center rounded-2xl transition-all duration-300 font-bold h-12 w-full overflow-hidden ${
                      view === item.id 
                        ? 'bg-[#FF611D] text-white shadow-[0_0_15px_rgba(255,97,29,0.4)]' 
                        : isDarkMode 
                          ? 'text-[#A8A29E] hover:text-[#FF611D] hover:bg-[#404040]'
                          : 'text-[#78716C] hover:text-[#FF611D] hover:bg-white border border-transparent hover:border-[#E7E5E4]'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    
                    {/* Sliding Label on Hover */}
                    <span className="truncate whitespace-nowrap opacity-0 -translate-x-4 invisible group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:visible group-hover/sidebar:w-32 ml-2 transition-all duration-300">
                      {item.label}
                    </span>
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Main Content Area */}
          <div className={`w-full h-full overflow-hidden flex flex-col relative z-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
            <div className="flex-1 overflow-hidden relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-[#FF611D] animate-spin" />
                <p className="text-lg font-black italic tracking-tighter animate-pulse">MEMUAT RASA...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h3 className="text-2xl font-black italic tracking-tighter text-red-500">WADUH, ADA MASALAH!</h3>
                <p className="max-w-md font-bold opacity-60">{error}</p>
                <button 
                  onClick={fetchData}
                  className="mt-4 px-8 h-14 bg-[#FF611D] text-white rounded-2xl font-black italic tracking-tighter shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  COBA LAGI
                </button>
              </div>
            ) : (
              <>
                {view === 'map' && (
                  <MapScreen 
                    restaurants={restaurants} 
                    onSelect={(r) => handleSelectRestaurant(r, 'map')} 
                  />
                )}
                {view === 'list' && (
                  <ListScreen 
                    restaurants={restaurants} 
                    onSelect={(r) => handleSelectRestaurant(r, 'list')} 
                    onOpenSpinWheel={() => setView('spin')}
                    isDarkMode={isDarkMode}
                    searchQuery={searchQuery}
                    filters={activeFilters}
                  />
                )}
                {view === 'spin' && (
                  <SpinWheelScreen
                    restaurants={restaurants}
                    onSelect={(r) => handleSelectRestaurant(r, 'list')}
                    onBack={() => setView('list')}
                    isDarkMode={isDarkMode}
                  />
                )}
                {view === 'detail' && selectedRestaurant && (
                  <DetailScreen 
                    restaurant={selectedRestaurant} 
                    onBack={() => setView(prevView)} 
                    onChat={() => setView('chat')}
                    isDarkMode={isDarkMode}
                  />
                )}
                {view === 'chat' && selectedRestaurant && (
                  <ChatScreen 
                    restaurant={selectedRestaurant} 
                    onBack={() => setView('detail')} 
                    isDarkMode={isDarkMode}
                  />
                )}
                {view === 'order' && selectedRestaurant && (
                  <OrderScreen 
                    restaurant={selectedRestaurant} 
                    cart={cart}
                    onBack={() => setView('detail')} 
                    onSuccess={() => {
                      setCart({});
                      setView('list');
                    }}
                    isDarkMode={isDarkMode}
                  />
                )}
                {view === 'feed' && (
                  <FeedScreen posts={foodPosts} isDarkMode={isDarkMode} />
                )}
              </>
            )}
            {view === 'create_menu' && (
              <CreateMenuScreen 
                onSelect={(action) => setView(action === 'add_resto' ? 'create_resto' : 'create_post')} 
                onBack={() => setView(prevView)} 
                isDarkMode={isDarkMode}
              />
            )}
            {view === 'create_resto' && (
              <AddFormsScreen type="resto" onBack={() => setView('create_menu')} onSuccess={() => setView('list')} isDarkMode={isDarkMode} />
            )}
            {view === 'create_post' && (
              <AddFormsScreen type="post" onBack={() => setView('create_menu')} onSuccess={() => setView('feed')} isDarkMode={isDarkMode} />
            )}
            {view === 'profile' && (
              <ProfileScreen 
                isDarkMode={isDarkMode} 
                onBack={() => setView(prevView)}
              />
            )}
            {view === 'settings' && (
              <SettingsScreen 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                onBack={() => setView(prevView)}
                onNavigateProfile={() => setView('profile')}
              />
            )}
          </div>
        </div>

          {/* Floating Action Button (FAB) for Creating Content */}
          {(view === 'list' || view === 'feed') && (
            <div className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[105] flex flex-col gap-4 items-end animate-in slide-in-from-right duration-500">
               {/* Quick Add Label */}
               <div className={`px-4 py-2 rounded-2xl border text-sm font-black italic tracking-tighter shadow-lg transform transition-all hover:scale-110 cursor-pointer hidden md:block ${
                 isDarkMode ? 'bg-[#FF611D] border-[#FF611D] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'
               }`} onClick={() => { setPrevView(view); setView('create_menu'); }}>
                 TAMBAH POST / TEMPAT?
               </div>
               <button 
                onClick={() => { setPrevView(view); setView('create_menu'); }}
                className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FF611D] text-white rounded-[1.75rem] lg:rounded-[2.25rem] flex items-center justify-center shadow-[0_15px_40px_rgba(255,97,29,0.5)] hover:scale-110 active:scale-90 transition-all group"
               >
                 <PlusCircle className="w-8 h-8 lg:w-10 lg:h-10 group-hover:rotate-90 transition-transform duration-300" />
               </button>
            </div>
          )}

          {/* Filter Modal */}
          {isFilterModalOpen && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsFilterModalOpen(false)}
              />
              <div className={`relative w-full max-w-sm rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${
                isDarkMode ? 'bg-[#1C1917] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black italic tracking-tighter">Filter Makan</h3>
                  <button 
                    onClick={() => setIsFilterModalOpen(false)}
                    className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Range Harga</h4>
                    <div className="grid grid-cols-3 gap-2">
                       {[
                        { id: '$', label: 'Murmer' },
                        { id: '$$', label: 'Sedang' },
                        { id: '$$$', label: 'Sultan' }
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => {
                            const newRanges = activeFilters.priceRange.includes(range.id)
                              ? activeFilters.priceRange.filter(r => r !== range.id)
                              : [...activeFilters.priceRange, range.id];
                            setActiveFilters({ ...activeFilters, priceRange: newRanges });
                          }}
                          className={`h-12 rounded-xl text-[10px] font-black italic tracking-tighter border transition-all ${
                            activeFilters.priceRange.includes(range.id)
                              ? 'bg-[#FF611D] border-[#FF611D] text-white'
                              : isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-[#F6F1EA] border-transparent text-[#78716C]'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-4">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Rating Minimal</h4>
                    <div className="flex gap-2">
                      {[3, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setActiveFilters({ ...activeFilters, minRating: activeFilters.minRating === rating ? 0 : rating })}
                          className={`flex-1 h-12 rounded-xl text-sm font-black italic tracking-tighter border transition-all ${
                            activeFilters.minRating === rating
                              ? 'bg-[#FF611D] border-[#FF611D] text-white'
                              : isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-[#F6F1EA] border-transparent text-[#78716C]'
                          }`}
                        >
                          ★ {rating}+
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setActiveFilters({ priceRange: [], minRating: 0 });
                        setIsFilterModalOpen(false);
                      }}
                      className={`flex-1 h-14 rounded-[1.25rem] font-black italic tracking-tighter transition-all ${
                        isDarkMode ? 'bg-[#404040] text-white hover:bg-[#525252]' : 'bg-[#E7E5E4] text-[#4B2E2A] hover:bg-[#D1D5DB]'
                      }`}
                    >
                      RESET
                    </button>
                    <button 
                      onClick={() => setIsFilterModalOpen(false)}
                      className="flex-1 h-14 bg-[#FF611D] text-white rounded-[1.25rem] font-black italic tracking-tighter shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popup Modal for Detail Screen (Home Page Only) */}
          {isDetailModalOpen && selectedRestaurant && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-20 animate-in fade-in duration-300">
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={() => setIsDetailModalOpen(false)}
              />
              <div className={`relative w-full max-w-5xl h-[85vh] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border animate-in zoom-in-95 duration-500 scale-100 ${
                isDarkMode ? 'bg-[#1C1917] border-[#404040]' : 'bg-white border-[#E7E5E4]'
              }`}>
                {/* Close Button UI override for modal - Positioned Above Heart Icon Area */}
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="absolute top-8 right-8 z-[210] w-14 h-14 rounded-[1.5rem] bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#FF611D] transition-all hover:scale-110 active:scale-90 shadow-xl border border-white/10"
                >
                  <X className="w-8 h-8" />
                </button>
                <DetailScreen 
                  restaurant={selectedRestaurant} 
                  onBack={() => setIsDetailModalOpen(false)} 
                  onChat={() => { setIsDetailModalOpen(false); setView('chat'); }}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* Mobile Bottom Navigation (Fixed) */}
          {view !== 'detail' && view !== 'chat' && view !== 'order' && view !== 'create_resto' && view !== 'create_post' && view !== 'create_menu' && view !== 'spin' && (
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[9999] flex justify-around items-center h-20 px-2 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t backdrop-blur-xl transition-all duration-300 ${
              isDarkMode ? 'bg-[#262626]/90 border-[#404040]' : 'bg-white/90 border-[#E7E5E4]'
            }`}>
              <button 
                onClick={() => { setView('list'); setPrevView('list'); }}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${view === 'list' ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`}
              >
                <Home className={`w-6 h-6 mb-1 ${view === 'list' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold text-center">Home</span>
              </button>

              <button 
                onClick={() => { setView('map'); setPrevView('map'); }}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${view === 'map' ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`}
              >
                <MapPin className={`w-6 h-6 mb-1 ${view === 'map' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold text-center">Map</span>
              </button>
              
              <button 
                onClick={() => { setPrevView(view); setView('create_menu'); }}
                className="flex items-center justify-center w-14 h-14 bg-[#4B2E2A] text-white rounded-full -translate-y-5 shadow-xl hover:bg-[#FF611D] transition-all duration-300 border-[6px] border-white active:scale-95"
              >
                <PlusCircle className="w-7 h-7" />
              </button>

              <button 
                onClick={() => { setView('feed'); setPrevView('list'); }}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${view === 'feed' ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`}
              >
                <Compass className={`w-6 h-6 mb-1 ${view === 'feed' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold text-center">Feed</span>
              </button>

              <button 
                onClick={() => { setView('settings'); setPrevView('list'); }}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${view === 'settings' ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`}
              >
                <Settings className={`w-6 h-6 mb-1 ${view === 'settings' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold text-center">Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

