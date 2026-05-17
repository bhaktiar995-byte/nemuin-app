import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, SlidersHorizontal, Navigation } from 'lucide-react';
import { Restaurant } from '../data/mock';

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

export function MapScreen({ restaurants, onSelect }: MapScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnline, setFilterOnline] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const defaultCenter: [number, number] = [-7.9666, 112.6326]; // Malang Center

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
          setLocError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === 1) {
            setLocError("Izin lokasi ditolak");
          } else {
            setLocError("Gagal mendapatkan lokasi");
          }
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocError("Geolocation tidak didukung");
    }
  }, []);

  function MapController({ coords }: { coords: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
      if (coords) {
        map.flyTo(coords, 15, { animate: true });
      }
    }, [coords, map]);
    return null;
  }

  // Basic filtering for demo
  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.foodCategories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchOnline = filterOnline ? r.isAvailableOnline : true;
    const matchCategory = activeCategory ? r.foodCategories.includes(activeCategory) || r.type === activeCategory : true;
    return matchSearch && matchOnline && matchCategory;
  });

  const handleRecenter = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserPos(newPos);
          setLocError(null);
        },
        (error) => {
          if (error.code === 1) setLocError("Izin lokasi ditolak");
          else setLocError("Gagal mendapatkan lokasi");
        }
      );
    }
  };

  return (
    <div className="absolute inset-0 z-0 text-[#4B2E2A]">
      {/* Search Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-10 pointer-events-none">
        <div className="flex gap-2 w-full pointer-events-auto">
          <div className="flex-1 bg-white/90 backdrop-blur shadow-sm rounded-2xl p-3 flex items-center h-12 border border-[#E7E5E4]">
            <Search className="w-5 h-5 text-[#A8A29E]" />
            <input 
              type="text"
              placeholder="Search in Malang..."
              className="flex-1 h-full bg-transparent border-none focus:outline-none px-3 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 bg-white/90 backdrop-blur shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-[#78716C] border border-[#E7E5E4]">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
          <button 
            onClick={() => setFilterOnline(!filterOnline)}
            className={`px-4 py-1.5 shadow-sm rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${filterOnline ? 'bg-[#FF611D] text-white border-[#FF611D]' : 'bg-[#F6F1EA] text-[#4B2E2A] border-[#E7E5E4]'}`}
          >
            Pesan Online
          </button>
          {['Lalapan', 'Ayam', 'Bakso', 'Nasi Goreng', 'Mie'].map(category => (
            <button 
              key={category} 
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={`px-4 py-1.5 shadow-sm rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${activeCategory === category ? 'bg-[#4B2E2A] text-white border-[#4B2E2A]' : 'bg-[#F6F1EA] text-[#4B2E2A] border-[#E7E5E4]'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Location Status Message */}
        {locError && (
          <div className="mt-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit shadow-md animate-bounce">
            {locError}
          </div>
        )}
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        zoomControl={false}
        className="w-full h-full relative z-0"
      >
        <MapResizer />
        <MapController coords={userPos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {userPos && (
          <Marker position={userPos} icon={userLocationIcon}>
            <Popup className="font-bold text-sm text-[#4B2E2A] pb-1">
              Lokasi Saya
            </Popup>
          </Marker>
        )}

        {filtered.map(r => (
          <Marker key={r.id} position={r.coords} icon={createFoodMarkerIcon(r)}>
            <Popup className="food-popup">
              <div className="w-48 p-1">
                <img src={r.image} alt={r.name} className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                <h3 className="font-bold text-[#4B2E2A] leading-tight mb-1">{r.name}</h3>
                <div className="flex items-center text-xs text-[#78716C] mb-2">
                  <span className="text-[#FF611D] font-bold mr-1">★ {r.rating}</span>
                  <span>({r.reviewCount}) • {r.distance}</span>
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
      <button 
        onClick={handleRecenter}
        className="absolute bottom-20 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4B2E2A] border border-[#E7E5E4] hover:bg-[#F6F1EA] transition-colors"
      >
        <Navigation className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
}
