import { useState } from 'react';
import { ChevronLeft, MapPin, CheckCircle, Package } from 'lucide-react';
import { Restaurant } from '../data/mock';

interface OrderScreenProps {
  restaurant: Restaurant;
  cart: Record<string, number>;
  onBack: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export function OrderScreen({ restaurant, cart, onBack, onSuccess, isDarkMode }: OrderScreenProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cartItems = restaurant.menu.filter(item => cart[item.id] > 0);
  const total = cartItems.reduce((sum, item) => sum + (item.price * cart[item.id]), 0);

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={`flex-1 w-full flex flex-col h-full justify-center items-center p-6 text-center z-50 absolute inset-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-[#F6F1EA]'}`}>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-6 transition-colors ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}>
          <CheckCircle className="w-16 h-16 text-[#FF611D]" />
        </div>
        <h2 className={`text-2xl font-bold mb-3 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Pesanan Berhasil!</h2>
        <p className={`font-medium leading-relaxed max-w-[280px] transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
          Pesananmu sedang disiapkan. Silakan ambil pesanan secara mandiri di <span className="text-[#FF611D]">{restaurant.name}</span> dalam waktu 15 menit.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex-1 w-full flex flex-col h-full relative overflow-y-auto pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-10 px-4 pb-4 sticky top-0 z-10 border-b flex items-center gap-3 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
        <button 
          onClick={onBack}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors border ${
            isDarkMode 
              ? 'bg-[#333333] text-white border-[#525252] hover:bg-[#404040]' 
              : 'bg-[#F6F1EA] text-[#4B2E2A] border-[#E7E5E4] hover:bg-[#E7E5E4]'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className={`text-lg font-bold leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Checkout Pick-up</h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Pickup Info Alert */}
        <div className={`rounded-2xl p-4 flex gap-3 transition-colors border ${isDarkMode ? 'bg-[#FF611D]/10 border-[#FF611D]/30 text-white' : 'bg-[#FF611D]/10 border-[#FF611D]/20 text-[#4B2E2A]'}`}>
          <Package className="w-6 h-6 text-[#FF611D] shrink-0" />
          <div>
            <h3 className="text-sm font-bold mb-1">Metode Pengambilan</h3>
            <p className={`text-xs font-medium transition-colors ${isDarkMode ? 'text-[#FAF9F6]/80' : 'text-[#78716C]'}`}>Beli online dan ambil sendiri pesanan Anda langsung ke restoran tanpa antre.</p>
          </div>
        </div>

        {/* Pickup Location */}
        <div className={`rounded-3xl p-5 border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
          <div className={`flex items-center gap-3 mb-3 border-b pb-3 transition-colors ${isDarkMode ? 'border-[#333333]' : 'border-[#E7E5E4]'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isDarkMode ? 'bg-[#404040] border-[#525252]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
              <MapPin className={`w-5 h-5 transition-colors ${isDarkMode ? 'text-[#FF611D]' : 'text-[#4B2E2A]'}`} />
            </div>
            <div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>Lokasi Pengambilan</h3>
              <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{restaurant.name}</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
            {restaurant.address}
          </p>
        </div>

        {/* Order Items */}
        <div className={`rounded-3xl p-5 border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors border ${isDarkMode ? 'bg-[#333333] border-[#525252] text-[#FF611D]' : 'bg-[#F6F1EA] border-[#E7E5E4] text-[#44403C]'}`}>
                  {cart[item.id]}x
                </div>
                <div className="flex-1 mt-0.5">
                  <p className={`text-sm font-bold leading-tight mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{item.name}</p>
                  <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-[#78716C]' : 'text-[#78716C]'}`}>Rp{(item.price * cart[item.id]).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-5 border-t border-dashed border-[#A8A29E] flex flex-col gap-3">
            <div className={`flex justify-between text-sm font-bold transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
              <span>Subtotal</span>
              <span>Rp{total.toLocaleString('id-ID')}</span>
            </div>
            <div className={`flex justify-between text-sm font-bold transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
              <span>Biaya Aplikasi</span>
              <span className="text-[#FF611D]">Gratis / Bebas Antre</span>
            </div>
            <div className={`flex justify-between text-lg font-bold mt-3 pt-4 border-t transition-colors ${isDarkMode ? 'text-white border-[#333333]' : 'text-[#4B2E2A] border-[#E7E5E4]'}`}>
              <span>Total Bayar</span>
              <span className={`${isDarkMode ? 'text-[#FF611D]' : 'text-[#4B2E2A]'}`}>Rp{total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t pb-safe z-50 transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
        <button 
          onClick={handlePlaceOrder}
          disabled={isOrdering}
          className={`w-full rounded-2xl h-14 flex items-center justify-center font-bold shadow-xl hover:opacity-90 transition-all disabled:opacity-75 disabled:scale-95 ${isDarkMode ? 'bg-[#FF611D] text-white' : 'bg-[#4B2E2A] text-white'}`}
        >
          {isOrdering ? 'Memproses Pesanan...' : 'Bayar & Proses Pesanan'}
        </button>
      </div>
    </div>
  );
}
