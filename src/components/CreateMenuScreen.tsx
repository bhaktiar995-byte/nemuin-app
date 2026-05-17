import { Store, Camera, ChevronLeft } from 'lucide-react';

interface CreateMenuScreenProps {
  onSelect: (action: 'add_resto' | 'add_post') => void;
  onBack: () => void;
  isDarkMode?: boolean;
}

export function CreateMenuScreen({ onSelect, onBack, isDarkMode }: CreateMenuScreenProps) {
  return (
    <div className={`flex-1 w-full h-full flex flex-col p-4 pt-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack} 
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-colors mr-3 ${
            isDarkMode 
              ? 'bg-[#262626] text-white border-[#404040] hover:bg-[#333333]' 
              : 'bg-white text-[#4B2E2A] border-[#E7E5E4] hover:bg-[#E7E5E4]'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Tambah Sesuatu</h1>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => onSelect('add_post')}
          className={`p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4 ${
            isDarkMode 
              ? 'bg-[#262626] border-[#404040] hover:border-[#FF611D]/50' 
              : 'bg-white border-[#E7E5E4] hover:border-[#FF611D]/50'
          }`}
        >
          <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shrink-0 ${isDarkMode ? 'bg-[#FF611D]/20' : 'bg-[#FF611D]/10'}`}>
            <Camera className="w-7 h-7 text-[#FF611D]" />
          </div>
          <div>
            <h2 className={`text-lg font-bold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Tulis Postingan Makanan</h2>
            <p className={`text-sm leading-snug transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Berbagi pengalaman makan enak dan temukan hidden gem makanan di sekitarmu.</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('add_resto')}
          className={`p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4 ${
            isDarkMode 
              ? 'bg-[#262626] border-[#404040] hover:border-[#FF611D]/50' 
              : 'bg-white border-[#E7E5E4] hover:border-[#FF611D]/50'
          }`}
        >
          <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shrink-0 border transition-colors ${isDarkMode ? 'bg-[#404040] border-[#525252]' : 'bg-[#4B2E2A]/5 border-[#E7E5E4]'}`}>
            <Store className={`w-7 h-7 transition-colors ${isDarkMode ? 'text-[#FF611D]' : 'text-[#4B2E2A]'}`} />
          </div>
          <div>
            <h2 className={`text-lg font-bold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Tambah Resto/Toko Makanan</h2>
            <p className={`text-sm leading-snug transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Daftarkan tempat makan baru agar orang lain dapat menemukannya di peta.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
