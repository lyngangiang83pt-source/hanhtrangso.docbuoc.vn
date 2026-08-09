import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { activateVipCode } from '../../config/supabase';
import { askGeminiVipAssistant } from '../../config/gemini';
import { Crown, Key, Download, Sparkles, FileText, CheckCircle2, Lock, ShieldAlert, Bot, ArrowRight, RefreshCw } from 'lucide-react';

export function VipVaultView() {
  const { profile, user, enableVip } = useAuth();
  const [vipCodeInput, setVipCodeInput] = useState('');
  const [activationMsg, setActivationMsg] = useState(null);

  // State Trợ lý AI VIP
  const [activeVipTool, setActiveVipTool] = useState('lesson_plan');
  const [topicInput, setTopicInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('Ngữ Văn');
  const [gradeInput, setGradeInput] = useState('8');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleActivateVip = async (e) => {
    e.preventDefault();
    if (!vipCodeInput.trim()) return;

    const res = await activateVipCode(vipCodeInput, user?.email || 'guest@eduteacher.edu.vn');
    setActivationMsg(res);
    if (res.success) {
      enableVip();
      setVipCodeInput('');
    }
  };

  const handleRunVipAi = async () => {
    if (!topicInput.trim() || isGenerating) return;
    setIsGenerating(true);
    const result = await askGeminiVipAssistant(activeVipTool, topicInput, {
      subject: subjectInput,
      grade: gradeInput,
    });
    setAiOutput(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* HEADER KHO VIP */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/40 bg-slate-950/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/30">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gradient-vip">
                Kho VIP & Trợ Lý AI Cao Cấp
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Đặc Quyền
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Cần nhập Mã PIN/Mã kích hoạt VIP để tải tài nguyên chuyên sâu và sử dụng AI trợ giảng nâng cao.
            </p>
          </div>
        </div>

        {/* Trạng Thái Kích Hoạt VIP */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <ShieldAlert className={`w-4 h-4 ${profile.is_vip ? 'text-amber-400' : 'text-slate-500'}`} />
          <span className="text-slate-300">Trạng thái:</span>
          <span className={`font-bold ${profile.is_vip ? 'text-amber-400' : 'text-slate-500'}`}>
            {profile.is_vip ? 'ĐÃ KÍCH HOẠT VIP' : 'THÀNH VIÊN THƯỜNG'}
          </span>
        </div>
      </div>

      {/* 1. KHUNG NHẬP MÃ VIP (CHƯA KÍCH HOẠT KHO VIP) */}
      {!profile.is_vip && (
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-4 max-w-2xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            Nhập Mã PIN / Mã Kích Hoạt VIP
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Thầy/Cô và học sinh điền mã kích hoạt VIP để mở khóa Kho VIP. <br />
            *(Thử dùng mã demo khởi tạo: <code className="text-amber-300 font-bold">VIP2026</code> hoặc <code className="text-amber-300 font-bold">EDUTEACHER2026</code>)*
          </p>

          <form onSubmit={handleActivateVip} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Nhập mã PIN VIP (VD: VIP2026)..."
              value={vipCodeInput}
              onChange={(e) => setVipCodeInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 transition-all"
            >
              Kích Hoạt Ngay
            </button>
          </form>

          {activationMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              activationMsg.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {activationMsg.message}
            </div>
          )}
        </div>
      )}

      {/* 2. BỘ TÀI NGUYÊN VIP (ĐƯỢC MỞ KHÓA HOẶC KHI ĐÃ LÀ VIP) */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl text-white flex items-center space-x-2">
          <Download className="w-5 h-5 text-amber-400" />
          <span>Thư Viện Tài Nguyên VIP Độc Quyền</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Bộ 50+ Giáo Án Mẫu Chuẩn 5512 Môn Ngữ Văn 6-9', type: 'DOCX / PPTX', code: 'VIP-PLAN-01' },
            { title: 'Ma Trận & Đề Thi Học Kỳ Tích Hợp NLS Toán 6-9', type: 'PDF / DOCX', code: 'VIP-EXAM-02' },
            { title: 'Chuyên Đề KHTN Khối 8, 9 Định Hướng Năng Lực', type: 'DOCX', code: 'VIP-KHTN-03' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.type}
                </span>
                <h4 className="font-bold text-base text-white mt-3 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400">Mã tài nguyên: {item.code}</p>
              </div>

              {profile.is_vip ? (
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`Đang tải gói tài nguyên VIP: ${item.title}`); }}
                  className="w-full py-3 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg text-center flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Tài Liệu VIP</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl font-bold text-xs bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Cần Mã PIN VIP Để Tải</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRỢ LÝ AI CAO CẤP DÀNH CHO GIÁO VIÊN VIP */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Trợ Lý AI Cao Cấp Soạn Giáo Án & Ra Đề Thi
            </h3>
            <p className="text-xs text-slate-400">Tạo nội dung giảng dạy tự động trong 3 giây bằng Gemini AI VIP</p>
          </div>
        </div>

        {/* Lựa chọn công cụ AI VIP */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          {[
            { id: 'lesson_plan', label: 'Soạn Giáo Án 5512' },
            { id: 'quiz_creator', label: 'Tự Động Ra Đề Thi' },
            { id: 'grading_assistant', label: 'Hỗ Trợ Chấm Bài & Nhận Xét' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveVipTool(tool.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeVipTool === tool.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên Bài Học / Chủ Đề</label>
            <input
              type="text"
              placeholder="VD: Truyện ngụ ngôn Ếch ngồi đáy giếng"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Môn Học</label>
            <select
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Ngữ Văn">Ngữ Văn</option>
              <option value="Toán Học">Toán Học</option>
              <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
              <option value="Lịch Sử & Địa Lý">Lịch Sử & Địa Lý</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Khối Lớp</label>
            <select
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunVipAi}
          disabled={isGenerating || !topicInput.trim()}
          className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 shadow-lg flex items-center justify-center space-x-2"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Bot className="w-4 h-4 text-slate-950" />}
          <span>{isGenerating ? 'Trợ Lý AI VIP Đang Xử Lý...' : 'Kích Hoạt Trợ Lý AI Sinh Nội Dung'}</span>
        </button>

        {/* Kết quả AI tạo */}
        {aiOutput && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs text-slate-200 space-y-3 animate-in fade-in">
            <h4 className="font-bold text-amber-300 border-b border-slate-800 pb-2">KẾT QUẢ TỰ ĐỘNG TẠO BỞI AI VIP:</h4>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">{aiOutput}</pre>
          </div>
        )}

      </div>

    </div>
  );
}
