import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { ChevronLeft, RefreshCw, Star, MapPin, Trophy, Settings, Search, Check, Info, UtensilsCrossed, X } from 'lucide-react';
import { Restaurant } from '../data/mock';

interface SpinWheelScreenProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  onBack: () => void;
  isDarkMode?: boolean;
}

export function SpinWheelScreen({ restaurants, onSelect, onBack, isDarkMode }: SpinWheelScreenProps) {
  const [wheelCount, setWheelCount] = useState(6);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [wheelRestaurants, setWheelRestaurants] = useState<Restaurant[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const controls = useAnimation();
  const rotationRef = useRef(0);

  // Initialize selected Ids with top rated ones
  useEffect(() => {
    if (selectedIds.length === 0) {
      const initial = [...restaurants]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
        .map(r => r.id);
      setSelectedIds(initial);
    }
  }, [restaurants]);

  // Update wheel items based on selection and count
  useEffect(() => {
    let baseItems = restaurants.filter(r => selectedIds.includes(r.id));
    
    // If we have more selected than wheelCount, slice. If less, we might need to fill or just show what we have.
    // For the wheel to work properly with segments, we should probably stick to the wheelCount constraint
    // or adjust the segments dynamically. Let's make the wheelCount dynamic based on selection or capped.
    const items = baseItems.slice(0, wheelCount);
    
    // Fallback if none selected
    if (items.length === 0) {
      const fallback = [...restaurants]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, wheelCount);
      setWheelRestaurants(fallback);
    } else {
      setWheelRestaurants(items);
    }
    
    setWinner(null);
    setShowResult(false);
  }, [wheelCount, restaurants, selectedIds]);

  const spinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);

    const actualCount = wheelRestaurants.length;
    const extraSpins = 5 + Math.random() * 5;
    const finalRotation = rotationRef.current + extraSpins * 360 + Math.random() * 360;
    
    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4, ease: [0.15, 0, 0.15, 1] }
    });

    rotationRef.current = finalRotation;
    setIsSpinning(false);

    // Calculate winner
    const normalizedRotation = finalRotation % 360;
    const sectionSize = 360 / actualCount;
    const winningIndex = Math.floor((360 - (normalizedRotation % 360)) / sectionSize) % actualCount;
    setWinner(wheelRestaurants[winningIndex]);
    setShowResult(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id].slice(0, 12) // Cap at 12 for UI sanity
    );
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = [
    '#FF611D', '#4B2E2A', '#FFB80E', '#4B2E2A', 
    '#78716C', '#A8A29E', '#E7E5E4', '#F6F1EA'
  ];

  return (
    <div className={`flex-1 w-full flex flex-col h-full relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-12 px-6 pb-6 sticky top-0 z-10 border-b shadow-sm shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
        <div className="relative flex items-center justify-between">
          <button 
            onClick={onBack} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${
              isDarkMode 
                ? 'bg-[#333333] text-white border-[#525252] hover:bg-[#404040]' 
                : 'bg-white text-[#4B2E2A] border-[#E7E5E4] hover:bg-[#E7E5E4]'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className={`text-2xl font-black italic tracking-tighter transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Lucky Spin</h2>
          </div>

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 border ${
              showConfig 
                ? 'bg-[#FF611D] text-white border-[#FF611D] shadow-lg shadow-orange-500/20' 
                : isDarkMode 
                  ? 'bg-[#333333] text-white border-[#525252] hover:bg-[#404040]' 
                  : 'bg-white text-[#4B2E2A] border-[#E7E5E4] hover:bg-[#E7E5E4]'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!showConfig ? (
            <motion.div 
              key="wheel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center"
            >
              <p className="text-sm font-medium text-[#78716C] mb-8 text-center px-4">
                Bingung mau makan apa? Serahkan pada keberuntungan! Fitur ini memilih makanan terbaik di sekitarmu.
              </p>

              {/* Count Selector */}
              <div className={`flex p-1 rounded-2xl border mb-12 shadow-sm transition-colors ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
                {[4, 6, 8, 12].map((count) => (
                  <button
                    key={count}
                    onClick={() => !isSpinning && setWheelCount(count)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      wheelCount === count ? 'bg-[#FF611D] text-white shadow-md' : 'text-[#A8A29E]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>

              {/* Spin Wheel Container with Marquee Lights */}
              <div className="relative group">
                {/* Outer Decorative Ring (Marquee) */}
                <div className={`absolute -inset-6 rounded-full shadow-[0_0_50px_rgba(255,97,29,0.2)] flex items-center justify-center transition-colors ${isDarkMode ? 'bg-black' : 'bg-[#4B2E2A]'}`}>
                  {/* Pulsing Lights around the wheel */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: isSpinning ? [0.4, 1, 0.4] : 1,
                        scale: isSpinning ? [1, 1.2, 1] : 1
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity, 
                        delay: i * 0.1 
                      }}
                      className="absolute w-2 h-2 rounded-full bg-[#FF611D] shadow-[0_0_8px_#FF611D]"
                      style={{ 
                        transform: `rotate(${i * 30}deg) translateY(-148px)` 
                      }}
                    />
                  ))}
                </div>

                <div className="relative w-72 h-72 z-10">
                  {/* Pointer */}
                  <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 z-30">
                    <motion.div 
                      animate={isSpinning ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 0.1 }}
                      className="w-10 h-12 flex flex-col items-center"
                    >
                      <div className="w-8 h-8 bg-white rounded-full shadow-xl border-4 border-[#4B2E2A] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#FF611D] to-[#FFB80E]" />
                      </div>
                      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-[#4B2E2A] -mt-1 shadow-lg"></div>
                    </motion.div>
                  </div>

                  {/* The Wheel */}
                  <motion.div
                    animate={controls}
                    className="w-full h-full rounded-full border-[10px] border-[#4B2E2A] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden bg-white"
                    style={{ rotate: 0 }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                      <defs>
                        <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                        </radialGradient>
                      </defs>
                      {wheelRestaurants.map((_, i) => {
                        const actualCount = wheelRestaurants.length;
                        const angle = 360 / actualCount;
                        const startAngle = i * angle;
                        const endAngle = (i + 1) * angle;
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                        const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                        const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                        const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                        const sectionColors = [
                          '#FF611D', '#4B2E2A', '#FFB80E', '#4B2E2A', 
                          '#F97316', '#262626', '#FDBA74', '#525252'
                        ];

                        return (
                          <g key={i}>
                            <path
                              d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={sectionColors[i % sectionColors.length]}
                              className="stroke-[0.5] stroke-white/10"
                            />
                            <path
                              d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill="url(#wheelGradient)"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Labels */}
                    {wheelRestaurants.map((r, i) => {
                      const actualCount = wheelRestaurants.length;
                      const angle = 360 / actualCount;
                      const rotation = i * angle + angle / 2;
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-1/2 h-8 -translate-y-1/2 origin-left flex items-center justify-end px-6"
                          style={{ transform: `rotate(${rotation}deg) translateY(-50%)` }}
                        >
                          <span className="text-[9px] font-black uppercase tracking-tighter text-white drop-shadow-md whitespace-nowrap overflow-hidden text-right leading-none max-w-[70px]">
                            {r.name}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>

                  {/* Inner Gloss Overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none z-20" />

                  {/* Center Point */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-4 border-[#4B2E2A] flex items-center justify-center z-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF611D] to-[#FFB80E] opacity-10" />
                    <UtensilsCrossed className={`w-6 h-6 text-[#FF611D] ${isSpinning ? 'animate-spin' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Spin Button - Pulsing effect */}
              <div className="relative w-full max-w-xs mt-12 mb-8">
                <AnimatePresence>
                  {!isSpinning && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.2, scale: 1.1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
                      className="absolute inset-0 bg-[#FF611D] rounded-2xl blur-xl"
                    />
                  )}
                </AnimatePresence>
                
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl relative z-10 transition-all active:scale-95 ${
                    isSpinning 
                      ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed' 
                      : 'bg-[#4B2E2A] text-white hover:bg-[#FF611D] hover:shadow-[0_20px_40px_rgba(255,97,29,0.3)]'
                  }`}
                >
                  {isSpinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Mencari Rasa...
                    </span>
                  ) : 'Kejar Keberuntungan'}
                </button>
              </div>

              {/* Result Modal */}
              <AnimatePresence>
                {showResult && winner && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowResult(false)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 50, rotate: 5 }}
                      className="relative w-full max-w-sm bg-[#4B2E2A] p-1 rounded-[2.5rem] shadow-[0_30px_100px_rgba(255,97,29,0.3)] border-2 border-[#FF611D]"
                    >
                      {/* Close button for Result Modal */}
                      <button 
                        onClick={() => setShowResult(false)}
                        className="absolute -top-4 -right-4 w-10 h-10 bg-[#FF611D] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all z-20 border-2 border-white dark:border-[#1C1917]"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className={`p-6 rounded-[2.3rem] border transition-colors ${isDarkMode ? 'bg-[#1C1917] border-[#404040]' : 'bg-white border-white/10'}`}>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#FF611D]/10 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-[#FF611D]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF611D]">Pilihan Takdir</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'}`}>
                            <Star className="w-3 h-3 fill-[#FFB80E] text-[#FFB80E]" />
                            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{winner.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-6">
                            <motion.img 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 10 }}
                              src={winner.image} 
                              alt={winner.name} 
                              className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-[#FF611D]/20" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="absolute -top-4 -right-4 bg-[#FF611D] text-white p-4 rounded-full shadow-lg transform rotate-12">
                              <Trophy className="w-6 h-6" />
                            </div>
                          </div>
                          
                          <h3 className={`text-2xl font-black leading-tight mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{winner.name}</h3>
                          
                          <div className="flex items-center text-[#78716C] mb-8">
                            <MapPin className="w-4 h-4 mr-2 text-[#FF611D]" />
                            <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#78716C]'}`}>{winner.distance} dari lokasimu</span>
                          </div>

                          <div className="flex flex-col w-full gap-3">
                            <button
                              onClick={() => {
                                setShowResult(false);
                                onSelect(winner);
                              }}
                              className="w-full py-5 bg-[#FF611D] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#4B2E2A] transition-all shadow-[0_10px_30px_rgba(255,97,29,0.3)] active:scale-95"
                            >
                              Lihat Detail Resto
                            </button>
                            <button
                              onClick={() => setShowResult(false)}
                              className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                                isDarkMode ? 'bg-[#262626] border-[#404040] text-white hover:bg-[#333333]' : 'bg-white border-[#E7E5E4] text-[#4B2E2A] hover:bg-gray-50'
                              }`}
                            >
                              Spin Lagi
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full flex flex-col"
            >
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Kelola Pilihan</h3>
                <p className={`text-xs transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Pilih hingga 12 makanan untuk dimasukkan ke roda.</p>
              </div>

              <div className={`rounded-2xl border p-3 flex items-center gap-3 mb-6 transition-colors ${isDarkMode ? 'bg-[#333333] border-[#525252]' : 'bg-white border-[#E7E5E4]'}`}>
                <Search className="w-5 h-5 text-[#A8A29E]" />
                <input 
                  type="text" 
                  placeholder="Cari makanan..." 
                  className={`bg-transparent border-none focus:outline-none text-sm w-full transition-colors ${isDarkMode ? 'text-white placeholder:text-[#78716C]' : 'text-[#4B2E2A] placeholder:text-[#A8A29E]'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 space-y-3 mb-24 lg:mb-0">
                {filteredRestaurants.map(r => (
                  <button
                    key={r.id}
                    onClick={() => toggleSelect(r.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${
                      selectedIds.includes(r.id) 
                        ? (isDarkMode ? 'border-[#FF611D] bg-[#FF611D]/10' : 'border-[#FF611D] bg-[#FF611D]/5')
                        : (isDarkMode ? 'border-[#404040] bg-[#262626] hover:border-[#525252]' : 'border-[#E7E5E4] bg-white hover:border-[#A8A29E]')
                    }`}
                  >
                    <img src={r.image} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{r.name}</p>
                      <p className="text-[10px] text-[#A8A29E] font-medium">{r.distance} • {r.rating} <Star className="inline w-2 h-2 fill-current" /></p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      selectedIds.includes(r.id) ? 'bg-[#FF611D] border-[#FF611D] text-white' : (isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]')
                    }`}>
                      {selectedIds.includes(r.id) && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="fixed lg:relative bottom-10 left-6 right-6 lg:bottom-0 lg:left-0 lg:right-0 lg:mt-8">
                <button
                  onClick={() => setShowConfig(false)}
                  className="w-full bg-[#4B2E2A] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95"
                >
                  Selesai ({selectedIds.length})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
