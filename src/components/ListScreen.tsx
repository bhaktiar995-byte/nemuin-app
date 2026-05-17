import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, UtensilsCrossed, RefreshCw } from 'lucide-react';
import { Restaurant } from '../data/mock';

interface ListScreenProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  onOpenSpinWheel?: () => void;
  isDarkMode?: boolean;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  filters?: {
    priceRange: string[];
    minRating: number;
  };
}

export function ListScreen({ 
  restaurants, 
  onSelect, 
  onOpenSpinWheel, 
  isDarkMode, 
  searchQuery = '', 
  onSearchChange,
  filters = { priceRange: [], minRating: 0 }
}: ListScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.foodCategories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = activeCategory ? r.foodCategories.includes(activeCategory) || r.type === activeCategory : true;
    
    // Additional filters
    const matchPrice = filters.priceRange.length > 0 ? filters.priceRange.includes(r.priceRange) : true;
    const matchRating = r.rating >= filters.minRating;

    return matchSearch && matchCategory && matchPrice && matchRating;
  });

  return (
    <div className="flex-1 w-full flex flex-col h-full relative">
      
      {/* Categories Bar - Sticky inside the scrollable container if possible, or just stay as top element if container is flex-col */}
      <div className={`shrink-0 px-6 py-4 border-b transition-colors duration-300 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-[#262626]/80 border-[#404040]' : 'bg-[#F6F1EA]/80 border-[#E7E5E4]'}`}>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none pointer-events-auto max-w-7xl mx-auto">
          {['Lalapan', 'Ayam', 'Bakso', 'Nasi Goreng', 'Mie', 'Sate', 'Minuman'].map(category => (
            <button 
              key={category} 
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={`px-8 h-12 shadow-sm rounded-2xl text-sm font-black italic tracking-tighter whitespace-nowrap border transition-all active:scale-95 ${
                activeCategory === category 
                  ? 'bg-[#FF611D] text-white border-[#FF611D] shadow-[0_8px_20px_rgba(255,97,29,0.3)]' 
                  : (isDarkMode ? 'bg-[#333333] text-[#A8A29E] border-[#404040] hover:border-[#FF611D]' : 'bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#FF611D]')
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((r, i) => (
            <div 
              key={r.id} 
              className={`rounded-[2.5rem] p-5 border cursor-pointer translate-y-0 hover:-translate-y-2 transition-all duration-500 group relative ${
                isDarkMode 
                  ? 'bg-[#262626] border-[#404040] shadow-[0_0_30px_rgba(255,97,29,0.25)] hover:shadow-[0_0_60px_rgba(255,97,29,0.5)] hover:border-[#FF611D]' 
                  : 'bg-white border-[#E7E5E4] shadow-[0_15px_40px_rgba(255,97,29,0.15)] hover:shadow-[0_25px_60px_rgba(255,97,29,0.35)] hover:border-[#FF611D]'
              }`}
              onClick={() => onSelect(r)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative overflow-hidden rounded-[1.75rem] mb-5">
                <img 
                  src={r.image} 
                  alt={r.name} 
                  className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex items-center bg-[#FF611D] text-white px-3 py-1.5 rounded-xl text-xs font-black italic shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  {r.rating}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className={`text-xl font-black italic tracking-tighter line-clamp-1 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'} group-hover:text-[#FF611D]`}>
                    {r.name}
                  </h2>
                  <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
                    {r.foodCategories.slice(0, 2).join(' • ')}
                  </p>
                </div>
                
                <div className={`pt-4 border-t border-dashed flex items-center justify-between transition-colors ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
                  <span className={`flex items-center text-xs font-bold transition-colors ${isDarkMode ? 'text-[#78716C]' : 'text-[#A8A29E]'}`}>
                    <MapPin className="w-3 h-3 mr-1 text-[#FF611D]" />
                    {r.distance}
                  </span>
                  <span className="text-sm font-black italic tracking-tighter text-[#FF611D]">
                    {r.priceRange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-[#A8A29E] py-10">
            <Search className="w-12 h-12 mb-2 opacity-50" />
            <p className="font-bold">Makanannya tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

