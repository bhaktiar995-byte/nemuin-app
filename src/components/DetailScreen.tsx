import { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, Clock, Phone, Star, Share, Heart, MessageCircle, X, ThumbsUp } from 'lucide-react';
import { Restaurant, MenuItem, calculateDistance } from '../data/mock';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix generic icon issue with react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const foodIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3180/3180182.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

interface DetailScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
  onChat: () => void;
  onUpdateRestaurant?: (updated: Restaurant) => void;
  userLocation?: [number, number] | null;
  isDarkMode?: boolean;
}

function DetailMapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export function DetailScreen({ restaurant, onBack, onChat, onUpdateRestaurant, userLocation, isDarkMode }: DetailScreenProps) {
  const [localMenu, setLocalMenu] = useState(restaurant.menu);
  
  // Calculate average rating from menu items
  const menuRatings = localMenu.filter(m => m.rating !== undefined).map(m => m.rating!);
  const avgMenuRating = menuRatings.length > 0 
    ? (menuRatings.reduce((a, b) => a + b, 0) / menuRatings.length).toFixed(1)
    : null;

  // Composite rating (average of original rating and menu rating)
  const compositeRating = avgMenuRating 
    ? ((restaurant.rating + parseFloat(avgMenuRating)) / 2).toFixed(1)
    : restaurant.rating.toFixed(1);

  const handleRateItem = (itemId: string, newRating: number) => {
    const updatedMenu = localMenu.map(item => {
      if (item.id === itemId) {
        const currentRating = item.rating || 0;
        const currentCount = item.reviewCount || 0;
        const updatedRating = parseFloat(((currentRating * currentCount + newRating) / (currentCount + 1)).toFixed(1));
        return { ...item, rating: updatedRating, reviewCount: currentCount + 1 };
      }
      return item;
    });

    setLocalMenu(updatedMenu);

    // Calculate new average and composite rating for the restaurant
    const validRatings = updatedMenu.filter(m => m.rating !== undefined).map(m => m.rating!);
    const newMenuAvg = validRatings.length > 0 
      ? parseFloat((validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1))
      : null;

    if (onUpdateRestaurant) {
      const updatedResto = {
        ...restaurant,
        menu: updatedMenu,
        // Update restaurant rating based on menu ratings
        rating: newMenuAvg ? parseFloat(((restaurant.rating + newMenuAvg) / 2).toFixed(1)) : restaurant.rating
      };
      onUpdateRestaurant(updatedResto);
    }
  };

  // Group menu by category
  const menuByCategory = localMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className={`flex-1 w-full flex flex-col h-full relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'} pb-8`}>
      
      {/* Header Image & Actions */}
      <div className="relative h-64 w-full shrink-0">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#4B2E2A]" />
        
        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-10 flex justify-between items-center z-[100] px-8">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#FF611D] transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/20"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#FF611D] transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/20"
            title="Tutup"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Improved Actions overlay */}
        <div className="absolute bottom-10 right-6 z-[30] flex flex-col gap-3">
          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center text-white hover:bg-[#FF611D] transition-all hover:scale-110 active:scale-90 shadow-xl border border-white/20">
            <Share className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center text-white hover:bg-[#FF611D] transition-all hover:scale-110 active:scale-90 shadow-xl border border-white/20">
            <Heart className="w-6 h-6" />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-10 left-6 right-6 text-white pb-2 text-left">
          {!restaurant.isAvailableOnline && (
            <div className="px-3 py-1 mb-2 bg-[#4B2E2A]/80 backdrop-blur border border-white/20 rounded-lg text-xs font-bold tracking-wider inline-block">
              ⚠️ Khusus Dine-in / Offline
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FF611D] rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
              {restaurant.type}
            </span>
            <div className="flex items-center text-sm font-black italic tracking-tighter bg-white/10 backdrop-blur px-2 py-1 rounded-lg border border-white/10">
              <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
              {compositeRating} <span className="mx-1 opacity-50">/</span> {restaurant.reviewCount + (avgMenuRating ? localMenu.length : 0)} REVIEWS
            </div>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
        </div>
      </div>

      {/* Info Section */}
      <div className={`mx-4 mt-[-2rem] relative z-20 rounded-3xl p-6 border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-3 shrink-0 text-[#A8A29E] mt-0.5" />
            <div className="flex-1">
              <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{restaurant.address}</p>
              <p className={`text-xs mt-0.5 font-medium transition-colors ${isDarkMode ? 'text-[#FAF9F6]/60' : 'text-[#78716C]'}`}>
                {userLocation 
                  ? calculateDistance(userLocation[0], userLocation[1], restaurant.coords[0], restaurant.coords[1])
                  : restaurant.distance
                } away
              </p>
            </div>
          </div>
          
          {/* Small Map Location */}
          <div className={`ml-8 mt-2 h-32 rounded-2xl overflow-hidden border shadow-sm z-0 relative transition-colors ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
            <MapContainer 
              center={restaurant.coords} 
              zoom={15} 
              scrollWheelZoom={false} 
              zoomControl={false}
              dragging={false}
              className="w-full h-full relative z-0"
            >
              <DetailMapResizer />
              <TileLayer
                url={isDarkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
              />
              <Marker position={restaurant.coords} icon={foodIcon} />
            </MapContainer>
          </div>

          <div className={`h-px mt-2 transition-colors ${isDarkMode ? 'bg-[#404040]' : 'bg-[#E7E5E4]'}`} />
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-3 shrink-0 text-[#A8A29E]" />
            <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{restaurant.hours}</p>
          </div>
          <div className={`h-px transition-colors ${isDarkMode ? 'bg-[#404040]' : 'bg-[#E7E5E4]'}`} />
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 shrink-0 text-[#A8A29E]" />
            <p className={`text-sm font-bold flex-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{restaurant.phone}</p>
            <button 
              onClick={onChat}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-80 transition-all ${isDarkMode ? 'bg-[#FF611D] text-white' : 'bg-[#4B2E2A] text-white'}`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className={`mx-4 mt-4 rounded-3xl p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] text-[#FAF9F6]' : 'bg-[#4B2E2A] text-[#F6F1EA]'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white text-left">Popular Menu</h2>
          {avgMenuRating && (
            <div className="flex items-center px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <Star className="w-3 h-3 fill-current text-yellow-400 mr-1.5" />
              <span className="text-[10px] font-black italic tracking-tighter text-white">MENU AVG: {avgMenuRating}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-8 text-left">
          {(Object.entries(menuByCategory) as [string, MenuItem[]][]).map(([category, items]) => (
            <div key={category}>
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 transition-colors ${isDarkMode ? 'text-[#FF611D]' : 'text-[#A8A29E]'}`}>{category}</h3>
              <div className="flex flex-col gap-4">
                {items.map((item, idx) => (
                  <div key={item.id} className={`flex gap-4 items-start transition-colors ${idx !== items.length - 1 ? (isDarkMode ? 'border-b border-white/5 pb-4' : 'border-b border-white/10 pb-4') : ''}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 py-1 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm leading-tight pr-2">{item.name}</h4>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button 
                                key={star} 
                                onClick={() => handleRateItem(item.id, star)}
                                className="transition-transform active:scale-125"
                              >
                                <Star 
                                  className={`w-3 h-3 ${
                                    star <= Math.round(item.rating || 0) 
                                      ? 'fill-current text-yellow-400' 
                                      : 'text-white/20'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                          {(item.reviewCount || 0) > 0 && (
                            <span className="text-[8px] font-bold text-white/40 mt-0.5">{item.reviewCount} reviews</span>
                          )}
                        </div>
                      </div>
                      <p className={`text-[11px] line-clamp-2 leading-relaxed mb-1 transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#A8A29E]'}`}>
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto pt-1">
                        <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#F6F1EA]'}`}>
                          Rp{item.price.toLocaleString('id-ID')}
                        </p>
                        <button className="text-[10px] font-black italic tracking-tighter text-[#FF611D] flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg hover:bg-[#FF611D] hover:text-white transition-all">
                          <ThumbsUp className="w-3 h-3" /> SUKA
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
