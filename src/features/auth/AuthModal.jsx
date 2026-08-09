import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, LogIn, Lock, Mail, Sparkles, UserCheck } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithEmail, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      if (error.message?.includes('provider is not enabled') || error.status === 400) {
        setErrorMsg('⚠️ Google Provider chưa được Bật (Enable) trên Supabase Dashboard! Thầy/Cô vui lòng bật Google Provider trong Authentication > Providers > Google, hoặc dùng nút Đăng Nhập Nhanh Demo bên dưới.');
      } else {
        setErrorMsg('Lỗi kết nối Google Auth: ' + error.message);
      }
    } else {
      onClose();
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) {
      setErrorMsg('Đăng nhập thất bại: ' + error.message);
    } else {
      onClose();
    }
  };

  // Đăng Nhập Nhanh Demo dành cho Giáo Viên / Học Sinh khi chưa bật Google Provider
  const handleQuickDemoLogin = (role) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-800 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
            <LogIn className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-2xl text-white">
            Đăng Nhập Hệ Thống
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Đăng nhập để trải nghiệm đầy đủ các tính năng giáo dục và phân quyền
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-4 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs text-left leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* NÚT ĐĂNG NHẬP GOOGLE ("CONTINUE WITH GOOGLE") */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all flex items-center justify-center space-x-3 group"
          >
            {/* Google SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="font-semibold text-sm">Continue with Google</span>
          </button>

          {/* KHU VỰC ĐĂNG NHẬP NHANH TEST DEMO */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <span className="text-[10px] uppercase font-extrabold text-indigo-400 tracking-wider block text-center">
              ⚡ Đăng Nhập Nhanh Test Giao Diện (Không Cần Mật Khẩu)
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleQuickDemoLogin('student')}
                className="py-2 px-1 rounded-xl text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/20"
              >
                🎓 Học Sinh
              </button>
              <button
                onClick={() => handleQuickDemoLogin('teacher')}
                className="py-2 px-1 rounded-xl text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20"
              >
                👩‍🏫 Giáo Viên
              </button>
              <button
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-1 rounded-xl text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/20"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">Hoặc Đăng Nhập Email</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Nhập Mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Đăng Nhập Bằng Email
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
