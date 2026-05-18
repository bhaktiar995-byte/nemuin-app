import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, SlidersHorizontal, Navigation } from 'lucide-react';
import { Restaurant, calculateDistance } from '../data/mock';

// Fix generic icon issue with react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createFoodMarkerIcon = (restaurant: Restaurant) => L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex flex-col items-center justify-center">
      <div style="width: 48px; height: 48px;" class="bg-white rounded-full shadow-lg border-2 border-white p-0.5 relative z-10">
        <img src="${restaurant.menu[0]?.image || restaurant.image}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />
      </div>
      <div class="absolute -bottom-2 z-20 bg-[#FF611D] rounded-full border shadow-sm px-1.5 flex items-center justify-center shadow-lg" style="border-color: white; border-width: 2px;">
        <span class="text-[10px] font-bold text-white leading-none pb-0.5 pt-0.5">★ ${restaurant.rating}</span>
      </div>
    </div>
  `,
  iconSize: [48, 56],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

const userLocationIcon = L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface MapScreenProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onOpenFilters?: () => void;
  userLocation?: [number, number] | null;
  isDarkMode?: boolean;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export function MapScreen({ restaurants, onSelect, searchQuery = '', onSearchChange, onOpenFilters, userLocation: realUserLocation, isDarkMode = false }: MapScreenProps) {
  const [filterOnline, setFilterOnline] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Real location or fallback to UMM Kampus 3 center
  const userLocation: [number, number] = realUserLocation || [-7.922500, 112.599000];

  // Basic filtering for demo
  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.foodCategories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchOnline = filterOnline ? r.isAvailableOnline : true;
    const matchCategory = activeCategory ? r.foodCategories.includes(activeCategory) || r.type === activeCategory : true;
    return matchSearch && matchOnline && matchCategory;
  });

  return (
    <div className="absolute inset-0 z-0">
      {/* Category Chips Overlay - Positioned below global header */}
      <div className="absolute top-0 left-0 right-0 z-[100] p-4 flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-full max-w-4xl flex flex-col gap-3 pointer-events-auto">
          {/* Centered Category Chips */}
          <div className="w-full relative">
            <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none justify-start md:justify-center w-full">
              <button 
                onClick={() => setFilterOnline(!filterOnline)}
                className={`px-5 py-2 shadow-md rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-all active:scale-95 ${
                  filterOnline 
                    ? 'bg-[#FF611D] text-white border-[#FF611D] shadow-[0_5px_15px_rgba(255,97,29,0.3)]' 
                    : isDarkMode 
                      ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' 
                      : 'bg-white text-[#4B2E2A] border-[#E7E5E4]'
                }`}
              >
                Pesan Online
              </button>
              {['Lalapan', 'Ayam', 'Bakso', 'Nasi Goreng', 'Mie', 'Sate', 'Minuman'].map(category => (
                <button 
                  key={category} 
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={`px-5 py-2 shadow-md rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-all active:scale-95 ${
                    activeCategory === category 
                      ? 'bg-[#4B2E2A] text-white border-[#4B2E2A]' 
                      : isDarkMode 
                        ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' 
                        : 'bg-white text-[#4B2E2A] border-[#E7E5E4]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MapContainer 
        // Centered roughly on Malang - UMM Kampus 3 Area
        center={[-7.921323, 112.599587]} 
        zoom={15} 
        scrollWheelZoom={true} 
        zoomControl={false}
        className="w-full h-full relative z-0"
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup className="font-bold text-sm text-[#4B2E2A] pb-1">
            Lokasi Anda Saat Ini
          </Popup>
        </Marker>
        {filtered.map(r => (
          <Marker key={r.id} position={r.coords} icon={createFoodMarkerIcon(r)}>
            <Popup className="food-popup">
              <div className="w-48 p-1">
                <img src={r.image} alt={r.name} className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                <h3 className="font-bold text-[#4B2E2A] leading-tight mb-1">{r.name}</h3>
                <div className="flex items-center text-xs text-[#78716C] mb-2">
                  <span className="text-[#FF611D] font-bold mr-1">★ {r.rating}</span>
                  <span>({r.reviewCount}) • {realUserLocation 
                        ? calculateDistance(realUserLocation[0], realUserLocation[1], r.coords[0], r.coords[1])
                        : r.distance
                      }</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(r);
                  }}
                  className="w-full py-2 bg-[#FF611D] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Recenter Button */}
      <button className="absolute bottom-20 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4B2E2A] border border-[#E7E5E4]">
        <Navigation className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
}
