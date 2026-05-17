import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { ChevronLeft, Camera, Send, Store, Loader2, AlertCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MockFormProps {
  type: 'resto' | 'post';
  onBack: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export function AddFormsScreen({ type, onBack, onSuccess, isDarkMode }: MockFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Resto
  const [restoName, setRestoName] = useState('');
  const [restoCategory, setRestoCategory] = useState('Lalapan');
  const [restoAddress, setRestoAddress] = useState('');

  // Form states for Post
  const [postContent, setPostContent] = useState('');
  const [postLocation, setPostLocation] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (type === 'resto') {
        const { error: dbError } = await supabase.from('restaurants').insert({
          name: restoName,
          type: 'Restaurant',
          food_categories: [restoCategory],
          address: restoAddress,
          image: imageUrl,
          rating: 0,
          review_count: 0,
          distance: "0 m",
          lat: -7.9666, // Placeholder Malabar area or similar
          lng: 112.6326,
        });
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('food_posts').insert({
          user_name: "User Baru", // Mock current user
          user_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          content: postContent,
          location: postLocation,
          image: imageUrl,
          likes: 0,
          comments: 0
        });
        if (dbError) throw dbError;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Gagal menyimpan data. Silakan coba lagi.');
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
        <h1 className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>
          {isResto ? 'Tambah Tempat Makan' : 'Post Makanan'}
        </h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6">
        {/* Real Image Picker */}
        <div className="flex flex-col gap-2">
          <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Foto</label>
          <div 
            onClick={triggerFileInput}
            className={`relative w-full h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              isDarkMode 
                ? 'bg-[#262626] border-[#404040] text-[#A8A29E] hover:bg-[#333333]' 
                : 'bg-[#F6F1EA] border-[#A8A29E] text-[#78716C] hover:bg-[#E7E5E4]'
            } ${imagePreview ? 'border-solid border-[#FF611D]' : ''}`}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">Tekan untuk ambil foto</span>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isResto ? (
            <>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nama Tempat</label>
                <input 
                  required 
                  type="text" 
                  value={restoName}
                  onChange={(e) => setRestoName(e.target.value)}
                  placeholder="Cth: Ayam Bakar Pak Kumis" 
                  className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Kategori (Pilih salah satu)</label>
                <select 
                  value={restoCategory}
                  onChange={(e) => setRestoCategory(e.target.value)}
                  className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`}
                >
                  <option>Lalapan</option>
                  <option>Ayam</option>
                  <option>Bakso</option>
                  <option>Nasi Goreng</option>
                  <option>Mie</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Alamat Lengkap</label>
                <input 
                  required 
                  type="text" 
                  value={restoAddress}
                  onChange={(e) => setRestoAddress(e.target.value)}
                  placeholder="Detail lokasi / patokan" 
                  className={`w-full h-12 rounded-xl px-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tulis Postingan Sesuatu</label>
                <textarea 
                  required 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Wah gila bener ini ayamnya..." 
                  className={`w-full h-32 rounded-xl p-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] resize-none transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tandai Lokasi (Opsional)</label>
                <div className="relative">
                  <Store className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input 
                    type="text" 
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    placeholder="Cari nama resto..." 
                    className={`w-full h-12 rounded-xl pl-10 pr-4 text-sm font-medium border focus:outline-none focus:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333] border-[#404040] text-white' : 'bg-white border-[#E7E5E4] text-[#4B2E2A]'}`} 
                  />
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
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              {isResto ? 'Kirim Pendaftaran' : 'Posting Sekarang'}
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

