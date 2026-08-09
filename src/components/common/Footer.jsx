import React from 'react';
import { GraduationCap, Heart, Shield, Sparkles, BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center border border-indigo-500/40 text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl text-gradient">
                EDUTEACHER PLATFORM
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Hệ thống Giáo dục số toàn diện tích hợp Trợ lý Trí tuệ nhân tạo (AI), quản lý học liệu số, phân quyền Giáo viên - Học sinh và kết nối Cơ sở dữ liệu Supabase thực tế.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Tài Nguyên Số</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-400 cursor-pointer">Bài giảng Khối 6, 7, 8, 9 (docx, pptx)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Phiếu học tập & Bài tập về nhà</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Phim giáo dục & Sổ tay tri thức</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Game đố vui tri thức tương tác</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Tương Tác & Nộp Bài</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-400 cursor-pointer">Padlet Nộp Bài Sáng Tạo (QR/Link)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Google Drive & Zalo QR Nộp Bài</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Hỏi - Đáp AI Trực Tuyến 24/24</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Kho VIP & Trợ Lý AI Cao Cấp</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EdTech Platform. Bản quyền thuộc về Tổ Chuyên Môn Giáo Dục.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Thiết kế bằng tâm huyết dành cho Thầy/Cô & Học sinh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
