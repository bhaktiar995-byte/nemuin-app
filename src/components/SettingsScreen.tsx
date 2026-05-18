import { Moon, Sun, ChevronLeft, Bell, Shield, User } from 'lucide-react';

interface SettingsScreenProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  onNavigateProfile: () => void;
}

export function SettingsScreen({ isDarkMode, onToggleDarkMode, onBack, onNavigateProfile }: SettingsScreenProps) {
  return (
    <div className={`flex-1 w-full flex flex-col h-full overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] text-[#FAF9F6]' : 'bg-white text-[#4B2E2A]'}`}>
      <div className="flex-1 p-6 space-y-6 pt-10 relative pb-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040] text-white hover:bg-[#333333]' : 'bg-[#F6F1EA] border-[#E7E5E4] text-[#4B2E2A] hover:bg-white'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-1">
              <h2 className="text-2xl font-black italic tracking-tighter">Pengaturan</h2>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Kustomisasi Pengalaman Anda</p>
            </div>
          </div>
        </div>

        {/* Tampilan */}
        <div className="space-y-4">
          <h3 className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Tampilan & Tema</h3>
          <div className={`p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#404040] text-[#FFB80E]' : 'bg-white text-[#FF611D]'}`}>
                  {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">Mode Gelap</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Ubah tampilan aplikasi menjadi gelap</p>
                </div>
              </div>
              
              <button 
                onClick={onToggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none border-2 ${isDarkMode ? 'bg-[#FF611D] border-[#FF611D]' : 'bg-[#D1D5DB] border-transparent'}`}
              >
                <div className={`absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Akun & Keamanan */}
        <div className="space-y-4">
          <h3 className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Akun</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={onNavigateProfile}
              className={`p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-4 ${isDarkMode ? 'bg-[#262626] border-[#404040] hover:bg-[#333333]' : 'bg-[#F6F1EA] border-[#E7E5E4] hover:bg-white'}`}
            >
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#404040] text-orange-400' : 'bg-white text-orange-500'}`}>
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold">Profile Saya</span>
            </button>
            <button className={`p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-4 ${isDarkMode ? 'bg-[#262626] border-[#404040] hover:bg-[#333333]' : 'bg-[#F6F1EA] border-[#E7E5E4] hover:bg-white'}`}>
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#404040] text-blue-400' : 'bg-white text-blue-500'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold">Notifikasi</span>
            </button>
          </div>
        </div>

        {/* Keamanan */}
        <div className="space-y-4">
          <h3 className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Privasi</h3>
          <button className={`w-full p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-4 ${isDarkMode ? 'bg-[#262626] border-[#404040] hover:bg-[#333333]' : 'bg-[#F6F1EA] border-[#E7E5E4] hover:bg-white'}`}>
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#404040] text-emerald-400' : 'bg-white text-emerald-500'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold">Keamanan & Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
