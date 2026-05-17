import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { Restaurant } from '../data/mock';

interface ChatScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
  isDarkMode?: boolean;
}

export function ChatScreen({ restaurant, onBack, isDarkMode }: ChatScreenProps) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi! Welcome to ${restaurant.name}. How can we help you today?`, sender: 'resto' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsgId = Date.now();
    setMessages(prev => [...prev, { id: newMsgId, text: input, sender: 'user' }]);
    setInput('');
    
    // Simulate auto-reply from resto
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: "Thanks for reaching out! We have received your message and will be with you shortly.", 
          sender: 'resto' 
        }
      ]);
    }, 1000);
  };

  return (
    <div className={`flex-1 w-full flex flex-col h-full relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
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
        <div className="flex-1">
          <h2 className={`text-lg font-bold leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{restaurant.name}</h2>
          <p className={`text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wide mt-0.5 transition-colors ${isDarkMode ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(m => (
          <div 
            key={m.id} 
            className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm transition-colors ${
              m.sender === 'user' 
                ? 'bg-[#FF611D] text-white self-end rounded-br-sm' 
                : isDarkMode 
                  ? 'bg-[#262626] text-white border border-[#404040] self-start rounded-bl-sm' 
                  : 'bg-white text-[#4B2E2A] border border-[#E7E5E4] self-start rounded-bl-sm'
            }`}
          >
            <p className="text-sm font-medium leading-relaxed">{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t pb-safe z-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
        <div className="flex gap-2 w-full">
          <div className={`flex-1 rounded-2xl border flex items-center px-4 h-14 transition-colors ${isDarkMode ? 'bg-[#333333] border-[#525252]' : 'bg-[#F6F1EA] border-[#E7E5E4]'}`}>
            <input 
              type="text"
              placeholder="Type your message..."
              className={`flex-1 h-full bg-transparent border-none focus:outline-none text-sm font-medium transition-colors ${isDarkMode ? 'text-white placeholder:text-[#78716C]' : 'text-[#4B2E2A] placeholder:text-[#A8A29E]'}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <button 
            onClick={handleSend}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md hover:opacity-90 transition-all ${isDarkMode ? 'bg-[#FF611D]' : 'bg-[#4B2E2A]'}`}
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
