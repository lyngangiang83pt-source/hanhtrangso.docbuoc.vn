import React, { useState, useRef, useEffect } from 'react';
import { askGeminiAi } from '../../config/gemini';
import { MessageSquareCode, Send, Bot, User, Sparkles, RefreshCw, CornerDownLeft } from 'lucide-react';

export function AiQaView() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào! Em là **Trợ Lý AI Giáo Dục 24/24** đây ạ! Thầy/Cô và các em học sinh có thể đặt bất kỳ câu hỏi nào về các môn học (Ngữ Văn, Toán, KHTN, Lịch Sử, Tiếng Anh...), em sẵn sàng tư vấn và hướng dẫn giải bài chi tiết 24/7.'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const aiResponse = await askGeminiAi(userText);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    setLoading(false);
  };

  const sampleQuestions = [
    'Giải thích ý nghĩa câu chuyện Thánh Gióng môn Ngữ Văn 6?',
    'Tính thể tích và diện tích xung quanh hình lăng trụ đứng Toán 7?',
    'Nêu định luật bảo toàn khối lượng và ví dụ môn KHTN 8?',
    'Tóm tắt diễn biến Cách mạng tháng Tám 1945 môn Lịch Sử 9?'
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      
      {/* HEADER HỎI ĐÁP AI */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                Hỏi - Đáp AI Trực Tuyến 24/24
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini 2.5 AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Trợ lý trí tuệ nhân tạo giải đáp kiến thức THCS 24/7</p>
          </div>
        </div>
      </div>

      {/* KHU VỰC KHUNG CHAT (CHAT INTERFACE) */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 h-[500px] flex flex-col justify-between shadow-2xl">
        
        {/* Tin nhắn danh sách */}
        <div className="overflow-y-auto space-y-4 pr-2 no-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600/90 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-indigo-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Trợ lý Gemini AI đang suy nghĩ và soạn câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* GỢI Ý CÂU HỎI MẪU */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Gợi ý:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputPrompt(q)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* NHẬP TIN NHẮN */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi bài học môn Ngữ Văn, Toán, KHTN..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
