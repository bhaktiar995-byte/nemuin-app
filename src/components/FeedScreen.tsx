import { useState } from 'react';
import { Heart, MessageCircle, MapPin, Share2, UtensilsCrossed, X, Send } from 'lucide-react';
import { FoodPost } from '../data/mock';

interface FeedScreenProps {
  posts: FoodPost[];
  isDarkMode?: boolean;
}

export function FeedScreen({ posts, isDarkMode }: FeedScreenProps) {
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const selectedPost = posts.find(p => p.id === showComments);

  return (
    <div className={`flex-1 w-full flex flex-col h-full relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917]' : 'bg-white'}`}>
      
      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map(post => (
            <div key={post.id} className={`rounded-[2.5rem] overflow-hidden border transition-all duration-500 flex flex-col h-full group ${
              isDarkMode 
                ? 'bg-[#262626] border-[#404040] shadow-[0_0_30px_rgba(255,97,29,0.25)] hover:shadow-[0_0_60px_rgba(255,97,29,0.5)] hover:border-[#FF611D]/50' 
                : 'bg-white border-[#E7E5E4] shadow-[0_15px_40px_rgba(255,97,29,0.15)] hover:shadow-[0_25px_60px_rgba(255,97,29,0.35)] hover:border-[#FF611D]/50'
            }`}>
              {/* Post Header */}
              <div className={`p-5 flex items-center justify-between border-b ${isDarkMode ? 'border-[#333333]' : 'border-[#F6F1EA]'}`}>
                <div className="flex items-center gap-3">
                  <img 
                    src={post.userAvatar} 
                    alt={post.user} 
                    className={`w-10 h-10 rounded-full object-cover border group-hover:scale-110 group-hover:border-[#FF611D] transition-all duration-300 ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`} 
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${post.user}&background=random` }}
                  />
                  <div>
                    <h3 className={`text-sm font-bold hover:underline cursor-pointer transition-all duration-300 group-hover:text-[#FF611D] group-hover:drop-shadow-[0_0_8px_rgba(255,97,29,0.3)] ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>{post.user}</h3>
                    <p className="text-[10px] text-[#A8A29E] font-bold uppercase tracking-wider">{post.timeAgo}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'}`}>
                  <Share2 className="w-4 h-4 text-[#A8A29E]" />
                </div>
              </div>

              {/* Post Image */}
              <div className="w-full bg-[#E7E5E4] relative aspect-[4/3] overflow-hidden group">
                <img 
                  src={post.image} 
                  alt="Food discovery" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' }}
                />
                {post.location && (
                  <div className="absolute bottom-4 left-4 bg-[#4B2E2A]/80 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-[#FF611D]" />
                    {post.location}
                  </div>
                )}
              </div>

              {/* Post Text */}
              <div className="p-6 flex-1 flex flex-col">
                <p className={`text-sm leading-relaxed mb-6 line-clamp-3 italic transition-colors ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#4B2E2A]'}`}>"{post.content}"</p>
                
                {/* Actions */}
                <div className={`mt-auto flex items-center justify-between border-t pt-5 ${isDarkMode ? 'border-[#333333]' : 'border-[#F6F1EA]'}`}>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-[#78716C] hover:text-[#FF611D] transition-colors group">
                      <Heart className="w-5 h-5 group-hover:fill-current" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => setShowComments(post.id)}
                      className="flex items-center gap-2 text-[#78716C] hover:text-[#FF611D] transition-colors group"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#FF611D] bg-[#333333]' : 'text-[#FF611D] bg-[#F6F1EA]'}`}>
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Prototype View (Bottom Sheet overlay) */}
      {showComments && selectedPost && (
        <div className="absolute inset-0 z-[10000] bg-black/60 flex items-end">
          <div className={`w-full rounded-t-3xl h-[80%] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 transition-colors ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}>
            {/* Sheet Header */}
            <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-[#404040]' : 'border-[#E7E5E4]'}`}>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Komentar</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isDarkMode ? 'bg-[#333333] text-[#A8A29E]' : 'bg-[#F6F1EA] text-[#78716C]'}`}>{selectedPost.comments}</span>
              </div>
              <button 
                onClick={() => setShowComments(null)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'bg-[#333333] text-[#78716C] hover:bg-[#404040]' : 'bg-[#F6F1EA] text-[#78716C] hover:bg-[#E7E5E4]'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List (Prototype) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF611D]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#FF611D]">AF</span>
                </div>
                <div className={`flex-1 p-3 rounded-2xl rounded-tl-none transition-colors ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'}`}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Afandika_11</span>
                    <span className="text-[10px] text-[#A8A29E]">5 menit yang lalu</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#4B2E2A]'}`}>Wah beneran merjosari sebelah mana nih bang? Jadi pengen nyoba tar malem!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-600">KK</span>
                </div>
                <div className={`flex-1 p-3 rounded-2xl rounded-tl-none transition-colors ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'}`}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#4B2E2A]'}`}>Kak_Kulang</span>
                    <span className="text-[10px] text-[#A8A29E]">12 menit yang lalu</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-[#FAF9F6]' : 'text-[#4B2E2A]'}`}>Sumpah emang enak bgt, sambelnya juara sih disitu.</p>
                </div>
              </div>
            </div>

            {/* Input Fixed at Bottom */}
            <div className={`p-4 border-t pb-safe flex items-center gap-3 transition-colors ${isDarkMode ? 'bg-[#262626] border-[#404040]' : 'bg-white border-[#E7E5E4]'}`}>
              <div className="w-10 h-10 rounded-full bg-[#4B2E2A] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">SF</span>
              </div>
              <div className={`flex-1 rounded-2xl px-4 py-2 flex items-center border border-transparent focus-within:border-[#FF611D] transition-colors ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F6F1EA]'}`}>
                <input 
                  type="text" 
                  placeholder="Tambah komentar..." 
                  className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${isDarkMode ? 'text-white placeholder:text-[#78716C]' : 'text-[#4B2E2A] placeholder:text-[#A8A29E]'}`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button className={`ml-2 p-1.5 rounded-full transition-colors ${commentText.trim() ? 'bg-[#FF611D] text-white' : 'text-[#A8A29E]'}`}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
