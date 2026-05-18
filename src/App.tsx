/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, List as MenuIcon, MapPin, Compass, PlusCircle, User, UtensilsCrossed, RefreshCw, Search, Settings, Rss, X, SlidersHorizontal } from 'lucide-react';
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
import { RESTAURANTS, Restaurant, FOOD_POSTS } from './data/mock';

type ViewMode = 'map' | 'list' | 'detail' | 'chat' | 'order' | 'feed' | 'create_menu' | 'create_resto' | 'create_post' | 'create_service' | 'profile' | 'spin' | 'settings';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [view, setView] = useState<ViewMode>('list');
  const [prevView, setPrevView] = useState<ViewMode>('list');
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
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error watching position:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/restaurants');
      const data = await res.json();
      if (data.source === 'supabase') {
        setIsSupabaseConnected(true);
        if (data.data && data.data.length > 0) {
          const mapped = data.data.map((r: any) => ({
            ...r,
            reviewCount: r.review_count || 0,
            isAvailableOnline: r.is_available_online || false,
            priceRange: r.price_range || '',
            coords: [Number(r.lat), Number(r.lng)],
            menu: r.menu_items || [],
            reviews: r.reviews || [],
          }));
          setRestaurants(mapped);
        } else {
          // If connected but empty, we can show sample data or remain empty
          // Let's stay empty if using Supabase to avoid confusion, 
          // or show sample if it's the very first time.
          setRestaurants([]); 
        }
      } else {
        setIsSupabaseConnected(false);
        setRestaurants(RESTAURANTS);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setRestaurants(RESTAURANTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);


  const handleUpdateRestaurant = async (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRestaurant(updated);

    try {
      await fetch(`/api/restaurants/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: updated.rating,
          review_count: updated.reviewCount
        })
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant, from: 'map' | 'list') => {
    setSelectedRestaurant(restaurant);
    setPrevView(view);
    if (view === 'list' || view === 'spin') {
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
    <div className={`h-screen flex flex-col font-sans overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] text-[#FAF9F6]' : 'bg-white text-[#4B2E2A]'}`}>
      {/* Top Global Header (Dynamic based on View) */}
      {(view === 'list' || view === 'feed' || view === 'map') && !['settings', 'profile', 'spin'].includes(view) && (
        <header className={`shrink-0 z-[120] sticky top-0 transition-colors duration-300 border-b shadow-sm ${isDarkMode ? 'bg-[#1D1B19] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'} backdrop-blur-xl`}>
          <div className="p-4 md:p-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8 w-full">
            {/* Row 1: Branding and Mobile Actions */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="space-y-0 cursor-pointer group shrink-0" onClick={() => setView('list')}>
                <h1 className={`text-xl md:text-3xl font-black italic tracking-tighter transition-all duration-500 group-hover:text-[#FF611D] ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>
                  Nemuin<span className="text-[#FF611D]">.</span>
                </h1>
                <p className={`text-[8px] md:text-[10px] font-bold italic tracking-tight transition-colors leading-none ${isDarkMode ? 'text-[#FAF9F6]/60' : 'text-[#78716C]'}`}>
                  Semuanya pasti ketemu di nemuin
                </p>
              </div>

              {/* Mobile Actions: Lucky Spin & Profile */}
              <div className="flex items-center gap-2 md:hidden">
                {view === 'list' && (
                  <button 
                    onClick={() => setView('spin')}
                    className="h-10 w-10 bg-[#FF611D] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-5 h-5 animate-spin-slow" />
                  </button>
                )}
                {view !== 'map' && (
                  <button
                    onClick={() => setView('profile')}
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center border transition-all ${
                      view === 'profile' 
                        ? 'bg-[#FF611D] text-white border-[#FF611D]' 
                        : isDarkMode 
                          ? 'bg-[#262626] border-[#404040] text-[#A8A29E]'
                          : 'bg-white border-[#E7E5E4] text-[#78716C]'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Row 2 (Mobile) / Middle (Desktop): Search & Desktop Spin */}
            <div className="flex-1 flex items-center gap-2 md:gap-4 w-full md:max-w-3xl">
              {/* Search Bar */}
              {(view === 'list' || view === 'map') && (
                <div className={`h-11 md:h-12 flex-1 rounded-2xl border flex items-center px-4 gap-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all focus-within:ring-2 focus-within:ring-[#FF611D] focus-within:border-transparent focus-within:shadow-xl focus-within:scale-[1.01] ${
                  isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'
                }`}>
                  <Search className="w-4 h-4 text-[#FF611D] shrink-0" />
                  <input 
                    type="text" 
                    placeholder={view === 'map' ? "Cari di peta..." : "Lagi pengen apa?"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent border-none focus:outline-none text-xs md:text-sm font-bold w-full transition-colors ${isDarkMode ? 'text-white placeholder:text-[#525252]' : 'text-[#4B2E2A]'}`}
                  />
                  <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-orange-50'}`}
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#FF611D]" />
                  </button>
                </div>
              )}

              {/* Desktop Only Lucky Spin Button */}
              {view === 'list' && (
                <button 
                  onClick={() => setView('spin')}
                  className="hidden md:flex h-12 px-6 bg-[#FF611D] text-white rounded-2xl font-black italic tracking-tighter items-center gap-3 shadow-[0_8px_20px_rgba(255,97,29,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow shrink-0" />
                  <span>LUCKY SPIN</span>
                </button>
              )}
            </div>

            {/* Desktop Only Profile Button */}
            <div className="hidden md:flex items-center gap-3">
              {view !== 'map' && (
                <button
                  onClick={() => setView('profile')}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                    view === 'profile' 
                      ? 'bg-[#FF611D] text-white border-[#FF611D]' 
                      : isDarkMode 
                        ? 'bg-[#262626] border-[#404040] text-[#A8A29E] hover:text-[#FF611D]'
                        : 'bg-white border-[#E7E5E4] text-[#78716C] hover:text-[#FF611D]'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Sidebar Navigation - Full Height (Desktop) */}
        {!['spin', 'create_resto', 'create_post', 'create_menu', 'profile', 'settings', 'detail', 'chat', 'order'].includes(view) && (
          <div 
            className={`hidden md:flex flex-col h-full transition-all duration-500 z-[115] border-r w-20 hover:w-64 group/sidebar ${
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

               {/* Mobile/Floating Spin shortcut removed if redundant, but user asked it specifically next to search */}
            </div>
          </div>
        )}

        <main className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Main Content Area */}
            <div className={`w-full h-full overflow-hidden flex flex-col relative z-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
              <div className="flex-1 overflow-hidden relative">
            {view === 'map' && (
              <MapScreen 
                restaurants={restaurants} 
                onSelect={(r) => handleSelectRestaurant(r, 'map')} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenFilters={() => setIsFilterModalOpen(true)}
                userLocation={userLocation}
                isDarkMode={isDarkMode}
              />
            )}
            {view === 'list' && (
              <ListScreen 
                restaurants={restaurants} 
                onSelect={(r) => handleSelectRestaurant(r, 'list')} 
                onOpenSpinWheel={() => setView('spin')}
                userLocation={userLocation}
                isDarkMode={isDarkMode}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
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
                onUpdateRestaurant={handleUpdateRestaurant}
                userLocation={userLocation}
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
              <FeedScreen posts={FOOD_POSTS} isDarkMode={isDarkMode} />
            )}
            {view === 'create_menu' && (
              <CreateMenuScreen 
                onSelect={(action) => {
                  if (action === 'add_resto') setView('create_resto');
                  else if (action === 'add_service') setView('create_service');
                  else setView('create_post');
                }} 
                onBack={() => setView(prevView)} 
                isDarkMode={isDarkMode}
              />
            )}
            {view === 'create_resto' && (
              <AddFormsScreen 
                type="resto" 
                onBack={() => setView('create_menu')} 
                onSuccess={() => {
                  setView('list');
                  fetchRestaurants();
                }} 
                isDarkMode={isDarkMode} 
              />
            )}
            {view === 'create_service' && (
              <AddFormsScreen 
                type="service" 
                onBack={() => setView('create_menu')} 
                onSuccess={() => {
                  alert("Pendaftaran Driver Berhasil! Data Anda sudah tersimpan di database.");
                  setView('list');
                }} 
                isDarkMode={isDarkMode} 
              />
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
      </div>

          {/* Floating Action Button (FAB) for Creating Content */}
          {(view === 'list' || view === 'feed') && (
            <div className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[105] hidden md:flex flex-col gap-4 items-end animate-in slide-in-from-right duration-500">
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
                <DetailScreen 
                  restaurant={selectedRestaurant} 
                  onBack={() => setIsDetailModalOpen(false)} 
                  onChat={() => { setIsDetailModalOpen(false); setView('chat'); }}
                  onUpdateRestaurant={handleUpdateRestaurant}
                  userLocation={userLocation}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* Mobile Bottom Navigation (Fixed) */}
          {view !== 'detail' && view !== 'chat' && view !== 'order' && view !== 'create_resto' && view !== 'create_post' && view !== 'create_menu' && view !== 'spin' && (
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[9999] flex justify-around items-center h-20 px-2 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t backdrop-blur-xl transition-all duration-300 ${
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
                <Rss className={`w-6 h-6 mb-1 ${view === 'feed' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
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
        </main>
      </div>
    </div>
  );
}

