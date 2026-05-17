import { User, Settings, LogOut, ChevronRight, Award, Heart, MessageSquare, Moon, Sun, ChevronLeft } from 'lucide-react';

interface ProfileScreenProps {
  isDarkMode?: boolean;
  onBack?: () => void;
}

export function ProfileScreen({ isDarkMode, onBack }: ProfileScreenProps) {
  return (
    <div className={`flex-1 w-full flex flex-col h-full overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
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
        <h2 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Surya Firdaus</h2>
        <p className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Local Guide Level 4 • Malang</p>
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
          <h3 className={`px-4 text-[10px] uppercase font-bold tracking-[0.2em] ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Pengaturan Akun</h3>
          <div className="flex flex-col gap-2">
            {[
              { icon: Heart, label: 'Koleksi Tersimpan', color: 'text-rose-500' },
              { icon: MessageSquare, label: 'Ulasan Anda', color: 'text-blue-500' },
              { icon: Settings, label: 'Pengaturan Akun', color: 'text-[#78716C]' },
              { icon: LogOut, label: 'Keluar', color: 'text-rose-600' },
            ].map((item, idx) => (
              <button 
                key={idx} 
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
