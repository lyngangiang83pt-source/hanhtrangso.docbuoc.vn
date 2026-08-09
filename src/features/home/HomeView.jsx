import React from 'react';
import { 
  Sparkles, BookOpen, Gamepad2, FileText, QrCode, Crown, 
  Bot, ArrowRight, CheckCircle2, ShieldCheck, Users, Layers, Award
} from 'lucide-react';

export function HomeView({ setActiveTab, onOpenAuthModal }) {
  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      
      {/* 1. HERO BANNER SANG TRỌNG */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-8 sm:p-14 text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

        <div className="max-w-2xl space-y-6 z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Nền Tảng Giáo Dục Số THCS Tích Hợp AI 24/7</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Nơi Trải Nghiệm <span className="text-gradient">Học Liệu Số</span> & Sáng Tạo Không Giới Hạn
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Nền tảng tích hợp kho bài giảng docx/pptx khối 6-9, game học tập tương tác, nộp bài qua Padlet/Drive/Zalo QR, quản lý lớp học và trợ lý Gemini AI tư vấn bài tập 24/24.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <button
              onClick={() => setActiveTab('lectures')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Khám Phá Bài Giảng 6-9</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('ai-qa')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-semibold text-sm glass-card text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Hỏi - Đáp AI 24/24</span>
            </button>
          </div>
        </div>

        {/* Khung minh họa tính năng */}
        <div className="w-full lg:w-96 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-2xl relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chỉ Số Nổi Bật</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">Trực Tuyến</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-bold text-indigo-400">100%</span>
              <span className="text-[11px] text-slate-400">Tích hợp NLS & AI</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-bold text-purple-400">Khối 6-9</span>
              <span className="text-[11px] text-slate-400">Chương trình GDPT</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-bold text-amber-400">Kho VIP</span>
              <span className="text-[11px] text-slate-400">Giáo án & Đề thi mẫu</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-2xl font-bold text-emerald-400">3 Cách</span>
              <span className="text-[11px] text-slate-400">Nộp Padlet/Drive/Zalo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LỐI TẮT NHANH CÁC DỊCH VỤ NỔI BẬT */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Danh Mục Tính Năng Trọng Tâm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Truy cập nhanh các module học tập và hỗ trợ giảng dạy số
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => setActiveTab('lectures')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-indigo-500/40"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2 group-hover:text-indigo-300 transition-colors">
              Bài Giảng Docx & PPTX
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tải giáo án, bài giảng điện tử PowerPoint theo Khối 6, 7, 8, 9 tích hợp NLS và AI.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('assignments')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-purple-500/40"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2 group-hover:text-purple-300 transition-colors">
              Bài Tập & Phiếu Học Tập
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phiếu học tập định hướng năng lực và bài tập về nhà phân loại chi tiết.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('student-products')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-emerald-500/40"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Sản Phẩm HS (Padlet/QR)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nộp sản phẩm học tập qua quét mã QR Padlet, Drive hoặc Zalo tiện lợi.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('vip-vault')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-amber-500/40 border-amber-500/20"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-amber-300 mb-2">
              Kho VIP & AI Cao Cấp
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mở khóa tài liệu VIP bằng Mã PIN và trải nghiệm Trợ lý AI Soạn giáo án, Ra đề thi.
            </p>
          </div>

        </div>
      </section>

      {/* 3. KHỐI LỚP HỌC 6 - 7 - 8 - 9 */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-white">Chương Trình Học Theo Khối Lớp</h3>
            <p className="text-xs text-slate-400">Lựa chọn khối lớp để lọc ngay bài giảng và bài tập tương ứng</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[6, 7, 8, 9].map((grade) => (
            <button
              key={grade}
              onClick={() => setActiveTab('lectures')}
              className="p-5 rounded-2xl glass-card text-center border border-slate-800 hover:border-indigo-500/50 group transition-all"
            >
              <span className="block text-3xl font-extrabold text-gradient mb-1">
                KHỐI {grade}
              </span>
              <span className="text-[11px] text-slate-400 group-hover:text-indigo-300 transition-colors">
                Xem bài giảng & bài tập
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
