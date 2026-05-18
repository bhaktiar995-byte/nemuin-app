import { useState, FormEvent, useEffect } from 'react';
import { ChevronLeft, Camera, Send, Store, Plus, Trash2, ImagePlus, MapPin, Locate } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string | null;
}

interface MockFormProps {
  type: 'resto' | 'post' | 'service';
  onBack: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

const pickerIcon = L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex flex-col items-center justify-center">
      <div class="w-10 h-10 bg-[#FF611D] rounded-full shadow-lg border-4 border-white flex items-center justify-center animate-bounce">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div class="w-1 h-3 bg-[#FF611D] -mt-1 rounded-full"></div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 50],
});

function MapClickHandler({ onClick }: { onClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function LocateControl({ onLocationFound, isDarkMode }: { onLocationFound: (latlng: [number, number]) => void, isDarkMode?: boolean }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 16 });
  };

  useMapEvents({
    locationfound(e) {
      setLocating(false);
      onLocationFound([e.latlng.lat, e.latlng.lng]);
    },
    locationerror() {
      setLocating(false);
      alert("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
    }
  });

  return (
    <button
      type="button"
      onClick={handleLocate}
      className={`absolute bottom-5 right-5 z-[1000] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
        isDarkMode ? 'bg-[#1C1917] text-[#FF611D] border border-white/10' : 'bg-white text-[#FF611D] border border-black/5'
      }`}
    >
      <Locate className={`w-6 h-6 ${locating ? 'animate-spin' : ''}`} />
    </button>
  );
}

export function AddFormsScreen({ type, onBack, onSuccess, isDarkMode }: MockFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Lalapan');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([-7.921323, 112.599587]);
  const [restoImage, setRestoImage] = useState<string | null>(null);
  const [restoFile, setRestoFile] = useState<File | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: crypto.randomUUID(), name: '', price: '', image: null }
  ]);

  // Try to get initial location
  useEffect(() => {
    if (navigator.geolocation && type === 'resto') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedCoords([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Fallback handled by default state
        }
      );
    }
  }, [type]);

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: crypto.randomUUID(), name: '', price: '', image: null }]);
  };

  const removeMenuItem = (id: string) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: string | null) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;

    let endpoint = '/api/restaurants';
    let payload: any = {};

    if (type === 'resto') {
      const name = (form.elements.namedItem('nama_tempat') as HTMLInputElement).value;
      const address = (form.elements.namedItem('alamat') as HTMLInputElement).value;
      const priceRange = (form.elements.namedItem('rentang_harga') as HTMLInputElement).value;
      
      payload = {
        name,
        type: selectedCategory === 'Lainnya' ? customCategory : selectedCategory,
        address,
        price_range: priceRange,
        lat: selectedCoords[0],
        lng: selectedCoords[1],
        image: restoImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
        distance: "Local",
        rating: 0,
        review_count: 0,
        menu_items: menuItems.filter(item => item.name.trim() !== '').map(item => ({
          name: item.name,
          price: parseInt(item.price.replace(/[^0-9]/g, '')) || 0,
          image: item.image,
          category: 'Umum'
        }))
      };
    } else if (type === 'service') {
      const name = (form.elements.namedItem('nama_lengkap') as HTMLInputElement).value;
      const serviceType = (form.elements.namedItem('jenis_layanan') as HTMLSelectElement).value;
      const phone = (form.elements.namedItem('no_hp') as HTMLInputElement).value;
      
      endpoint = '/api/services';
      payload = {
        name,
        type: serviceType,
        phone,
        lat: selectedCoords[0],
        lng: selectedCoords[1],
        status: 'active',
        image: restoImage || "https://images.unsplash.com/photo-1622329993327-64136aee0578?auto=format&fit=crop&q=80&w=200"
      };
    } else {
      // POST
      const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
      endpoint = '/api/posts'; // We should probably add this to server too or just resto
      payload = {
        content,
        image: restoImage,
        author: 'User',
        date: new Date().toISOString()
      };
      // For now, let's just mock post if server doesn't have it, 
      // but the user mostly wants "Pendaftaran" (Registration) which is resto/service.
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const errorData = await res.json();
        console.error("Save failed:", errorData);
        alert(`Gagal menyimpan: ${errorData.error || 'Terjadi kesalahan pada server'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan atau server.");
    } finally {
      setLoading(false);
    }
  };

  const isResto = type === 'resto';

  return (
    <div className={`flex-1 w-full flex flex-col h-full overflow-y-auto pb-safe transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      <div className={`pt-10 px-4 pb-4 sticky top-0 z-10 border-b flex items-center justify-between shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
        <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-lg font-bold italic transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>
          {type === 'resto' ? 'Pendaftaran Mitra' : type === 'service' ? 'Pendaftaran Driver' : 'Post Tempat Makan'}
        </h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6">
        {/* Restaurant Image Picker */}
        <div className={`w-full h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${
          isDarkMode 
            ? 'bg-[#262626] border-[#404040] text-[#A8A29E] hover:bg-[#333333]' 
            : 'bg-[#F6F1EA] border-[#A8A29E] text-[#78716C] hover:bg-[#E7E5E4]'
        }`}>
          {restoImage ? (
            <img src={restoImage} alt="Restaurant Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">Tekan untuk ambil foto restauran</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const base64 = await fileToBase64(file);
                  setRestoFile(file);
                  setRestoImage(base64);
                } catch (err) {
                  console.error("Error converting image:", err);
                }
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          {type === 'resto' ? (
            <>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nama Tempat</label>
                <input name="nama_tempat" required type="text" placeholder="Cth: Ayam Bakar Pak Kumis" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Kategori (Pilih salah satu)</label>
                <select 
                  name="kategori"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`}
                >
                  <option>Lalapan</option>
                  <option>Ayam</option>
                  <option>Bakso</option>
                  <option>Nasi Goreng</option>
                  <option>Mie</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              {selectedCategory === 'Lainnya' && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Ketik Kategori Baru</label>
                  <input 
                    name="custom_kategori"
                    required 
                    type="text" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Cth: Seafood, Vegan, dll" 
                    className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Alamat Lengkap</label>
                <input name="alamat" required type="text" placeholder="Detail lokasi / patokan" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 flex items-center gap-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
                  <MapPin className="w-3 h-3" /> Pilih Lokasi di Maps
                </label>
                <div className={`w-full h-56 rounded-2xl overflow-hidden border relative group ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
                  <MapContainer 
                    center={selectedCoords} 
                    zoom={16} 
                    scrollWheelZoom={false}
                    dragging={true}
                    className="w-full h-full z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={selectedCoords} icon={pickerIcon} />
                    <MapClickHandler onClick={setSelectedCoords} />
                    <LocateControl onLocationFound={setSelectedCoords} isDarkMode={isDarkMode} />
                    <RecenterMap position={selectedCoords} />
                  </MapContainer>
                  <div className={`absolute top-2 left-2 z-[1000] rounded-lg px-3 py-1.5 border shadow-sm pointer-events-none backdrop-blur ${
                    isDarkMode ? 'bg-[#1C1917]/90 border-[#404040]' : 'bg-white/90 border-[#E7E5E4]'
                  }`}>
                    <p className={`text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>TAP PADA PETA UNTUK PIN LOKASI</p>
                  </div>
                </div>
                <p className="text-[10px] text-[#A8A29E] pl-1 font-bold">
                  KOORDINAT: {selectedCoords[0].toFixed(6)}, {selectedCoords[1].toFixed(6)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Rentang Harga (Cth: Rp. 20rb - 50rb)</label>
                <input name="rentang_harga" required type="text" placeholder="Cth: 15.000 - 30.000" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nomor Telepon (WhatsApp diutamakan)</label>
                <input type="tel" placeholder="Cth: 08123456789" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Jam Operasional</label>
                <input required type="text" placeholder="Cth: 08:00 - 21:00" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>

              {/* Dynamic Menu Items */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between px-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Daftar Menu & Foto</label>
                  <button 
                    type="button"
                    onClick={addMenuItem}
                    className="text-[#FF611D] text-xs font-black italic flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-3 h-3" /> TAMBAH MENU
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {menuItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-2xl border flex flex-col gap-3 relative animate-in slide-in-from-right-2 duration-300 ${
                        isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'
                      }`}
                    >
                      {menuItems.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeMenuItem(item.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      
                      <div className="flex gap-3">
                        {/* Menu Image Picker */}
                        <div className={`w-20 h-20 shrink-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${
                          isDarkMode 
                            ? 'bg-[#333333] border-[#404040] text-[#A8A29E]' 
                            : 'bg-white border-[#A8A29E] text-[#78716C]'
                        }`}>
                          <ImagePlus className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold">Foto</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const base64 = await fileToBase64(file);
                                  updateMenuItem(item.id, 'image', base64);
                                } catch (err) {
                                  console.error("Error converting image:", err);
                                }
                              }
                            }}
                          />
                          {item.image && (
                            <img src={item.image} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                          <input 
                            required 
                            type="text" 
                            placeholder="Nama Menu (Cth: Nasi Goreng Spesial)" 
                            value={item.name}
                            onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                            className={`w-full h-9 rounded-lg px-3 text-xs font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                          />
                          <input 
                            required 
                            type="text" 
                            placeholder="Harga (Cth: 15.000)" 
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                            className={`w-full h-9 rounded-lg px-3 text-xs font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : type === 'service' ? (
            <>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nama Lengkap</label>
                <input name="nama_lengkap" required type="text" placeholder="Cth: Budi Sudarsono" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Jenis Layanan</label>
                <select 
                  name="jenis_layanan"
                  className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`}
                >
                  <option>Ojek (Motor)</option>
                  <option>Taxi (Mobil)</option>
                  <option>Kurir (Kirim Barang)</option>
                  <option>Food Delivery</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nomor HP / WhatsApp</label>
                <input name="no_hp" required type="tel" placeholder="Cth: 08123456789" className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 flex items-center gap-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
                  <MapPin className="w-3 h-3" /> Area Operasional (Domisili)
                </label>
                <div className={`w-full h-56 rounded-2xl overflow-hidden border relative group ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
                  <MapContainer 
                    center={selectedCoords} 
                    zoom={14} 
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={selectedCoords} icon={pickerIcon} />
                    <MapClickHandler onClick={setSelectedCoords} />
                    <LocateControl onLocationFound={setSelectedCoords} isDarkMode={isDarkMode} />
                    <RecenterMap position={selectedCoords} />
                  </MapContainer>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tulis Postingan Tempat Makan</label>
                <textarea name="content" required placeholder="Wah gila bener ini ayamnya..." className={`w-full h-32 rounded-xl p-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] resize-none transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tandai Lokasi (Opsional)</label>
                <div className="relative">
                  <Store className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input type="text" placeholder="Cari nama resto..." className={`w-full h-12 rounded-xl pl-10 pr-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} />
                </div>
              </div>
            </>
          )}
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className={`mt-4 w-full h-14 bg-[#FF611D] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-all disabled:opacity-50 ${isDarkMode ? 'shadow-orange-900/40' : ''}`}
        >
          {loading ? 'Menyimpan...' : (
            <>
              {(type === 'resto' || type === 'service') ? 'Kirim Pendaftaran' : 'Posting Sekarang'}
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
