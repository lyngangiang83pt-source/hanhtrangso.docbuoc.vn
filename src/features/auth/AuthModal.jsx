import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, LogIn, UserPlus, Lock, User, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { signInWithUsername, signUpWithUsername, signInWithGoogle, switchRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // State Form Đăng Nhập bằng Username
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State Form Đăng Ký bằng Username
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState('student');

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Xử lý Đăng Nhập bằng Username + Mật Khẩu
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { data, error } = await signInWithUsername(loginUsername, loginPassword);
    setLoading(false);

    if (error) {
      setErrorMsg('Đăng nhập thất bại: ' + (error.message?.includes('Invalid login credentials') ? 'Tên đăng nhập hoặc mật khẩu không chính xác!' : error.message));
    } else {
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    }
  };

  // Xử lý Đăng Ký Tài Khoản Mới bằng Username + Mật Khẩu
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPassword.trim() || !regFullName.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { data, error } = await signUpWithUsername({
      username: regUsername,
      password: regPassword,
      full_name: regFullName,
      role: regRole,
    });
    setLoading(false);

    if (error) {
      setErrorMsg('Đăng ký không thành công: ' + (error.message?.includes('already registered') ? 'Tên đăng nhập này đã tồn tại!' : error.message));
    } else {
      setSuccessMsg('🎉 Đăng ký tài khoản mới thành công! Bạn có thể Đăng Nhập ngay bây giờ.');
      setTimeout(() => {
        setActiveTab('login');
        setLoginUsername(regUsername);
        setLoginPassword(regPassword);
        setSuccessMsg(null);
      }, 1500);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setErrorMsg('Google Auth: ' + error.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
        
        {/* Nút đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SWAP TABS: ĐĂNG NHẬP VS ĐĂNG KÝ */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'register'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo Tài Khoản</span>
          </button>
        </div>

        {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
        {errorMsg && (
          <div className="p-3.5 mb-4 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 mb-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM 1: ĐĂNG NHẬP BẰNG USERNAME + MẬT KHẨU */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên Đăng Nhập (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="VD: giaovien_an hoặc hocsinh_binh"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật Khẩu (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu của bạn..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập Hệ Thống'}</span>
            </button>
          </form>
        ) : (
          
          /* FORM 2: ĐĂNG KÝ TÀI KHOẢN MỚI BẰNG USERNAME */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên Đăng Nhập (Username - Viết liền không dấu)
              </label>
              <input
                type="text"
                required
                placeholder="VD: giaovien_mai hoặc hocsinh_nam"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu Khởi Tạo
              </label>
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự..."
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Họ và Tên Hiển Thị
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn Nam"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phân Quyền Vai Trò (Role)
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="student">🎓 Học Sinh</option>
                <option value="teacher">👩‍🏫 Giáo Viên</option>
                <option value="admin">⚙️ Admin Quản Trị</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Đang Tạo Tài Khoản...' : 'Tạo Tài Khoản Mới Lưu Supabase'}</span>
            </button>
          </form>
        )}

        {/* NÚT ĐĂNG NHẬP GOOGLE HOẶC THỬ NGHIỆM */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl font-semibold text-xs bg-white text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

      </div>
    </div>
  );
}
