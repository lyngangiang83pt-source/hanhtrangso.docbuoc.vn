import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, Home, Newspaper, Gamepad2, BookOpenCheck, 
  FileText, FileSpreadsheet, FolderGit2, MessageSquareCode, 
  Crown, Bell, LogIn, User, Sparkles, Shield, ChevronDown, LogOut
} from 'lucide-react';

export const navItems = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'news', label: 'Bảng tin', icon: Newspaper },
  { id: 'games', label: 'Game', icon: Gamepad2 },
  { id: 'resources', label: 'Học liệu số', icon: BookOpenCheck },
  { id: 'lectures', label: 'Bài giảng', icon: FileText },
  { id: 'assignments', label: 'Bài tập', icon: FileSpreadsheet },
  { id: 'student-products', label: 'Sản phẩm HS', icon: FolderGit2 },
  { id: 'ai-qa', label: 'Hỏi - đáp', icon: MessageSquareCode },
  { id: 'vip-vault', label: 'Kho VIP', icon: Crown, isVip: true },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
];

export function Navbar({ activeTab, setActiveTab, onOpenAuthModal }) {
  const { user, profile, signOut, switchRole } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 1. LOGO TRANG WEB */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-gradient">
                EDUTEACHER
              </span>
              <span className="block text-[10px] sm:text-xs text-indigo-300/70 tracking-widest font-medium uppercase">
                Học Liệu Số & AI 24/7
              </span>
            </div>
          </div>

          {/* 2. MENU ĐIỀU HƯỚNG CHÍNH (NAVIGATION BAR) */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? item.isVip
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                      : item.isVip
                        ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.isVip ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.isVip && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-full animate-pulse">
                      VIP
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. KHU VỰC THÔNG TIN NGƯỜI DÙNG & ĐĂNG NHẬP */}
          <div className="flex items-center space-x-3">
            
            {/* Phân quyền RBAC Selector (Demo đổi nhanh quyền để trải nghiệm) */}
            <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
              <Shield className="w-3.5 h-3.5 text-indigo-400 ml-1 mr-1" />
              <select
                value={profile.role}
                onChange={(e) => switchRole(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs font-medium pr-1"
                title="Đổi vai trò để thử nghiệm giao diện"
              >
                <option value="student" className="bg-slate-900 text-white">🎓 Học Sinh</option>
                <option value="teacher" className="bg-slate-900 text-white">👩‍🏫 Giáo Viên</option>
                <option value="admin" className="bg-slate-900 text-white">⚙️ Admin Quan Trị</option>
              </select>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/40">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      profile.full_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {profile.full_name}
                    </div>
                    <div className="text-[10px] text-indigo-400 capitalize">
                      {profile.role === 'admin' ? 'Quản Trị Viên' : profile.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-400">Đã đăng nhập email</p>
                      <p className="text-xs font-medium text-indigo-300 truncate">{user.email}</p>
                    </div>
                    
                    {profile.role === 'teacher' || profile.role === 'admin' ? (
                      <button
                        onClick={() => { setActiveTab('classroom'); setShowProfileMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-indigo-300 hover:bg-slate-800 rounded-lg flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Quản lý Lớp & Học sinh</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => { signOut(); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center space-x-2 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}

          </div>

        </div>

        {/* MOBILE NAVIGATION BAR (MENU DI ĐỘNG KHI MÀN HÌNH NHỎ) */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
