import { User, Settings, LogOut, ChevronRight, Award, Heart, MessageSquare, Moon, Sun, ChevronLeft, CreditCard, Edit, Crown, Check, X, Camera, Trophy, MapPin, Settings2, Plus, Store, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileScreenProps {
  isDarkMode?: boolean;
  onBack?: () => void;
}

export function ProfileScreen({ isDarkMode, onBack }: ProfileScreenProps) {
  const [activeSubView, setActiveSubView] = useState<'profile' | 'edit' | 'subscription' | 'account' | 'ad_options' | 'ad_settings'>('profile');
  const [currentTier, setCurrentTier] = useState<'free' | 'lite' | 'pro' | 'business'>('free');
  
  // Edit Profile State
  const [profileData, setProfileData] = useState({
    name: 'Surya Firdaus',
    bio: 'Pecinta kuliner tersembunyi yang suka berbagi pengalaman rasa.',
    location: 'Malang',
    level: 'Local Guide Level 4',
    email: 'surya.firdaus@example.com',
    phone: '+62 812 3456 7890',
    joinDate: '12 Januari 2024'
  });

  const [adSettings, setAdSettings] = useState({
    personalized: true,
    locationBased: true,
    thirdParty: false
  });

  const handleSaveProfile = () => {
    setActiveSubView('profile');
  };

  const renderAdOptions = () => (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setActiveSubView('profile')}
    >
      <motion.div 
        className={`w-full max-w-md rounded-[2.5rem] p-6 pb-12 overflow-hidden shadow-2xl relative ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setActiveSubView('profile')}
          className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${isDarkMode ? 'bg-[#1C1917] text-[#A8A29E] hover:text-white' : 'bg-[#FAF9F6] text-[#78716C] hover:text-[#4B2E2A]'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-1.5 bg-[#E7E5E4] dark:bg-[#404040] rounded-full mx-auto mb-8" />
        
        <h2 className={`text-xl font-black italic tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>LANGGANAN IKLAN</h2>
        <p className={`text-xs font-bold mb-8 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Kelola bagaimana konten sponsor muncul di aplikasi Anda.</p>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => setActiveSubView('subscription')}
            className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all group ${
              isDarkMode ? 'bg-[#1C1917] border-[#404040] hover:border-[#FF611D]' : 'bg-[#FAF9F6] border-[#E7E5E4] hover:border-[#FF611D]'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FF611D]/10 flex items-center justify-center text-[#FF611D] mb-4 group-hover:scale-110 transition-transform">
              <Crown className="w-8 h-8" />
            </div>
            <span className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Pilih Paket</span>
            <span className={`text-[10px] font-bold mt-1 ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Bebas iklan & fitur premium</span>
          </button>

          <button 
            onClick={() => setActiveSubView('ad_settings')}
            className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all group ${
              isDarkMode ? 'bg-[#1C1917] border-[#404040] hover:border-amber-500' : 'bg-[#FAF9F6] border-[#E7E5E4] hover:border-amber-500'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
              <Settings2 className="w-8 h-8" />
            </div>
            <span className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Atur Iklan</span>
            <span className={`text-[10px] font-bold mt-1 ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Kustomisasi preferensi iklan</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAdSettings = () => {
    const isFree = currentTier === 'free';
    
    return (
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className={`fixed inset-0 z-[160] flex flex-col ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}
      >
        <div className={`p-4 flex items-center justify-between border-b mt-10 md:mt-0 ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
          <button onClick={() => setActiveSubView('ad_options')} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-white border-[#E7E5E4] text-[#78716C]'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className={`text-lg font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>KUSTOMISASI IKLAN</h2>
            <div className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
              currentTier === 'free' ? 'bg-zinc-100 text-zinc-400 border-zinc-200' : 
              currentTier === 'lite' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
              currentTier === 'pro' ? 'bg-[#FF611D]/10 text-[#FF611D] border-[#FF611D]/20' :
              'bg-[#4B2E2A]/10 text-[#4B2E2A] border-[#4B2E2A]/20'
            }`}>
              AKUN {currentTier}
            </div>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Promote Place Section */}
          <div className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF611D]">Promosi Tempat</h3>
              {isFree && (
                <div className="px-2 py-1 bg-rose-500/10 text-rose-500 text-[8px] font-black rounded-full flex items-center gap-1">
                  <X className="w-2.5 h-2.5" />
                  TERKUNCI
                </div>
              )}
            </div>
            
            {isFree ? (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                  <Store className="w-6 h-6 opacity-30" />
                </div>
                <p className={`text-[10px] font-bold leading-relaxed max-w-[200px] ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>
                  Berlangganan untuk mulai mempromosikan tempat makan Anda di map dan feed.
                </p>
                <button 
                  onClick={() => setActiveSubView('subscription')}
                  className="mt-4 text-[10px] font-black text-[#FF611D] uppercase tracking-widest border-b border-[#FF611D]"
                >
                  Lihat Paket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:bg-[#FF611D]/5 hover:border-[#FF611D] ${
                  isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-[#FF611D]/10 flex items-center justify-center text-[#FF611D]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Tambah Tempat Promosi</span>
                </button>
                
                <div className={`p-4 rounded-2xl flex items-center gap-4 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
                  <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=100" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black truncate ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Warung Ayam Bakar Madu</p>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                      <Clock className="w-3 h-3" />
                      Aktif • 12 Hari Lagi
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-[#FF611D]">EDIT</button>
                </div>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'}`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF611D] mb-6">Preferensi Privasi</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Iklan Personalisasi</p>
                    {isFree && <X className="w-3 h-3 text-rose-500" />}
                  </div>
                  <p className="text-[10px] font-medium text-[#78716C] mt-1">Tampilkan iklan berdasarkan minat dan riwayat pencarian Anda.</p>
                </div>
                <button 
                  disabled={isFree}
                  onClick={() => setAdSettings({...adSettings, personalized: !adSettings.personalized})}
                  className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${isFree ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${adSettings.personalized ? 'bg-[#FF611D]' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${adSettings.personalized ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Iklan Berbasis Lokasi</p>
                    {isFree && <X className="w-3 h-3 text-rose-500" />}
                  </div>
                  <p className="text-[10px] font-medium text-[#78716C] mt-1">Gunakan lokasi Anda untuk merekomendasikan promo terdekat.</p>
                </div>
                <button 
                  disabled={isFree}
                  onClick={() => setAdSettings({...adSettings, locationBased: !adSettings.locationBased})}
                  className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${isFree ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${adSettings.locationBased ? 'bg-[#FF611D]' : 'bg-zinc-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${adSettings.locationBased ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {currentTier === 'business' && (
                <div className="flex items-center justify-between pt-6 border-t border-dashed border-[#E7E5E4] dark:border-[#404040]">
                  <div className="flex-1 pr-4">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-[#FF611D]' : 'text-[#FF611D]'}`}>Nonaktifkan Iklan</p>
                    <p className="text-[10px] font-medium text-[#78716C] mt-1">Sembunyikan semua konten sponsor (Eksklusif Business).</p>
                  </div>
                  <button 
                    onClick={() => setAdSettings({...adSettings, thirdParty: !adSettings.thirdParty})}
                    className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${adSettings.thirdParty ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${adSettings.thirdParty ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              )}
            </div>

            {isFree && (
              <div className="mt-8 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3">
                <Crown className="w-5 h-5 text-rose-500" />
                <p className="text-[9px] font-bold text-rose-600 leading-tight">Gunakan Akun LITE atau lebih tinggi untuk membuka kontrol privasi penuh.</p>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Tentang Iklan</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Data Anda digunakan untuk memberikan pengalaman yang lebih relevan. Kami tidak pernah menjual informasi pribadi Anda kepada pihak ketiga tanpa izin.
            </p>
            <div className="mt-6 flex items-center justify-between pt-6 border-t border-dashed border-[#E7E5E4] dark:border-[#404040]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Your Ad ID</span>
              <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>MLG-992-0XC-ADV</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderEditProfile = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[120] flex flex-col ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}
    >
      <div className={`p-4 flex items-center justify-between border-b mt-10 md:mt-0 ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
        <button onClick={() => setActiveSubView('profile')} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-white border-[#E7E5E4] text-[#78716C]'}`}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-lg font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>EDIT PROFIL</h2>
        <button onClick={handleSaveProfile} className="text-[#FF611D] font-black italic text-sm tracking-tighter">SIMPAN</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-[#FF611D]/10 border-4 border-[#FF611D]/20 overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=256" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-3 bg-[#FF611D] text-white rounded-2xl shadow-lg border-4 border-white dark:border-[#1C1917] active:scale-90 transition-all">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-xs font-bold text-[#78716C]/60 uppercase tracking-widest">Sentuh untuk ganti foto</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Nama Lengkap</label>
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className={`w-full h-14 bg-transparent border-b-2 font-bold px-1 transition-all focus:border-[#FF611D] outline-none ${isDarkMode ? 'text-white border-[#404040]' : 'text-[#4B2E2A] border-[#E7E5E4]'}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Bio</label>
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              className={`w-full min-h-[100px] bg-transparent border-b-2 font-bold px-1 transition-all focus:border-[#FF611D] outline-none resize-none ${isDarkMode ? 'text-white border-[#404040]' : 'text-[#4B2E2A] border-[#E7E5E4]'}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Lokasi</label>
            <input 
              type="text" 
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              className={`w-full h-14 bg-transparent border-b-2 font-bold px-1 transition-all focus:border-[#FF611D] outline-none ${isDarkMode ? 'text-white border-[#404040]' : 'text-[#4B2E2A] border-[#E7E5E4]'}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSubscription = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[120] flex flex-col ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}
    >
      <div className={`p-4 flex items-center justify-between border-b mt-10 md:mt-0 ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
        <button onClick={() => setActiveSubView('profile')} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-white border-[#E7E5E4] text-[#78716C]'}`}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-lg font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>LANGGANAN IKLAN</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#FF611D]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#FF611D]" />
          </div>
          <h3 className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Promosikan Bisnismu</h3>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tingkatkan visibilitas restoranmu ke jutaan pecinta kuliner.</p>
        </div>

        <div className="flex flex-col gap-4 pb-10">
          {[
            { name: 'Lite', id: 'lite' as const, price: 'IDR 50k', period: '/bulan', color: 'bg-emerald-500', benefits: ['Muncul di atas Feed', 'Badge Verifikasi', 'Analitik Dasar'] },
            { name: 'Pro', id: 'pro' as const, price: 'IDR 150k', period: '/bulan', color: 'bg-[#FF611D]', benefits: ['Semua fitur Lite', 'Highlight di Map', 'Pop-up Rekomendasi', 'Analitik Lanjutan'], recommended: true },
            { name: 'Business', id: 'business' as const, price: 'IDR 400k', period: '/bulan', color: 'bg-[#4B2E2A]', benefits: ['Semua fitur Pro', 'Iklan Full-screen', 'Dukungan Prioritas', 'Kustom Promo'] },
          ].map((plan) => (
            <div key={plan.name} className={`relative p-6 rounded-[2.5rem] border-2 transition-all ${plan.recommended ? 'border-[#FF611D] scale-[1.02]' : isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF611D] text-white text-[10px] font-black uppercase tracking-widest rounded-full">TERPOPULER</div>
              )}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{plan.name}</h4>
                  <div className="flex items-baseline">
                    <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{plan.price}</span>
                    <span className="text-xs font-bold text-[#78716C] ml-1">{plan.period}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${plan.color} rounded-2xl flex items-center justify-center`}>
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#78716C]'}`}>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => {
                  setCurrentTier(plan.id);
                  setActiveSubView('profile');
                }}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                plan.id === currentTier ? 'bg-zinc-400 text-white border-none cursor-default' :
                plan.recommended ? 'bg-[#FF611D] text-white' : isDarkMode ? 'bg-[#333333] text-white border border-[#404040]' : 'bg-[#FAF9F6] text-[#4B2E2A] border border-[#E7E5E4]'
              }`}>
                {plan.id === currentTier ? 'PAKET AKTIF' : 'PILIH PAKET'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAccount = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[120] flex flex-col ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}
    >
      <div className={`p-4 flex items-center justify-between border-b mt-10 md:mt-0 ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
        <button onClick={() => setActiveSubView('profile')} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040] text-[#A8A29E]' : 'bg-white border-[#E7E5E4] text-[#78716C]'}`}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-lg font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>INFORMASI AKUN</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-6">
          <div className={`p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'}`}>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-[#FF611D]' : 'text-[#FF611D]'}`}>Data Login</h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-dashed border-[#E7E5E4] dark:border-[#404040]">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Email</p>
                  <p className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{profileData.email}</p>
                </div>
                <button className="text-[10px] font-black text-[#FF611D] uppercase">Ubah</button>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-dashed border-[#E7E5E4] dark:border-[#404040]">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Nomor HP</p>
                  <p className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{profileData.phone}</p>
                </div>
                <button className="text-[10px] font-black text-[#FF611D] uppercase">Ubah</button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Terdaftar Sejak</p>
                  <p className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{profileData.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#FAF9F6] border-[#E7E5E4]'}`}>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-[#FF611D]' : 'text-[#FF611D]'}`}>Keamanan</h3>
            
            <div className="space-y-4">
              <button className={`w-full p-4 rounded-xl flex items-center justify-between border ${isDarkMode ? 'bg-[#1C1917] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Ubah Kata Sandi</span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E]" />
              </button>
              <button className={`w-full p-4 rounded-xl flex items-center justify-between border ${isDarkMode ? 'bg-[#1C1917] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Otentikasi Dua Faktor</span>
                <div className="px-2 py-0.5 bg-[#FF611D]/10 text-[#FF611D] text-[8px] font-black rounded-full">AKTIF</div>
              </button>
            </div>
          </div>

          <button className="w-full py-4 text-rose-500 text-[10px] font-black uppercase tracking-widest border-2 border-rose-500/20 rounded-2xl hover:bg-rose-500/5 transition-all">
            HAPUS AKUN PERMANEN
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`flex-1 w-full flex flex-col h-full overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      <AnimatePresence>
        {activeSubView === 'edit' && renderEditProfile()}
        {activeSubView === 'subscription' && renderSubscription()}
        {activeSubView === 'account' && renderAccount()}
        {activeSubView === 'ad_options' && renderAdOptions()}
        {activeSubView === 'ad_settings' && renderAdSettings()}
      </AnimatePresence>

      {/* Header Profile */}
      <div className={`pt-16 pb-8 px-6 border-b flex flex-col items-center relative transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
        {onBack && (
          <button 
            onClick={onBack}
            className={`absolute top-10 left-6 p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#404040] border-[#525252] text-white hover:bg-[#333333]' : 'bg-white border-[#E7E5E4] text-[#4B2E2A] hover:bg-[#F6F1EA]'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#FF611D] p-1 bg-white shadow-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" 
              alt="User" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className={`absolute bottom-1 right-1 bg-[#FF611D] p-1.5 rounded-full border-2 shadow-sm ${isDarkMode ? 'border-[#262626]' : 'border-white'}`}>
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{profileData.name}</h2>
        <p className={`text-sm font-medium transition-colors mb-4 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>{profileData.level} • {profileData.location}</p>
        
        <button 
          onClick={() => setActiveSubView('edit')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
            isDarkMode 
              ? 'bg-[#333333] border-[#525252] text-white hover:bg-[#404040]' 
              : 'bg-white border-[#E7E5E4] text-[#4B2E2A] hover:bg-gray-50'
          }`}
        >
          <Edit className="w-3.5 h-3.5 text-[#FF611D]" />
          Edit Profil
        </button>
      </div>

      {/* Stats Area */}
      <div className={`flex justify-around py-4 border-b shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>12</span>
          <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider">Posts</span>
        </div>
        <div className={`w-px h-8 self-center ${isDarkMode ? 'bg-[#404040]' : 'bg-[#E7E5E4]'}`}></div>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>482</span>
          <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider">Likes</span>
        </div>
        <div className={`w-px h-8 self-center ${isDarkMode ? 'bg-[#404040]' : 'bg-[#E7E5E4]'}`}></div>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>45</span>
          <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider">Comments</span>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="p-4 flex flex-col gap-6 pb-24">
        {/* Menu Section */}
        <div className="space-y-3">
          <h3 className={`px-4 text-[10px] uppercase font-bold tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Menu Utama</h3>
          <div className="flex flex-col gap-2">
            {[
              { icon: User, label: 'Akun', color: 'text-amber-500', action: () => setActiveSubView('account') },
              { icon: Heart, label: 'Koleksi Tersimpan', color: 'text-rose-500', action: () => {} },
              { icon: MessageSquare, label: 'Ulasan Anda', color: 'text-blue-500', action: () => {} },
              { icon: Crown, label: 'Langganan Iklan', color: 'text-[#FF611D]', action: () => setActiveSubView('ad_options') },
              { icon: LogOut, label: 'Keluar', color: 'text-rose-600', action: () => {} },
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={item.action}
                className={`w-full p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all active:scale-95 duration-300 ${
                  isDarkMode 
                    ? 'bg-[#262626] border-[#404040] hover:bg-[#333333]' 
                    : 'bg-white border-[#E7E5E4] hover:bg-[#F6F1EA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'} ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A8A29E]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

