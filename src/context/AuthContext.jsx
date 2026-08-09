import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getUserProfile, registerWithUsername as apiRegister, loginWithUsername as apiLogin } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    username: 'guest',
    full_name: 'Khách Ghé Thăm',
    role: 'student', // 'admin', 'teacher', 'student'
    is_vip: false,
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại từ Supabase
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn('Khởi tạo session Auth:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Lắng nghe thay đổi auth state (Login / Logout / SignUp)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile({
          username: 'guest',
          full_name: 'Khách Ghé Thăm',
          role: 'student',
          is_vip: false,
          avatar_url: null,
        });
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Lấy Profile người dùng từ Supabase DB
  const fetchProfile = async (userId) => {
    const data = await getUserProfile(userId);
    if (data) {
      setProfile(data);
    }
  };

  // Đăng Ký bằng Username + Mật khẩu
  const signUpWithUsername = async ({ username, password, full_name, role }) => {
    const res = await apiRegister({ username, password, full_name, role });
    return res;
  };

  // Đăng Nhập bằng Username + Mật khẩu
  const signInWithUsername = async (username, password) => {
    const res = await apiLogin(username, password);
    return res;
  };

  // Đăng nhập bằng Google ("Continue with Google")
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.warn('Đăng nhập Google Auth:', error.message);
      return { data: null, error };
    }
  };

  // Đăng xuất
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({
      username: 'guest',
      full_name: 'Khách Ghé Thăm',
      role: 'student',
      is_vip: false,
      avatar_url: null,
    });
  };

  // Giả lập Đổi Vai Trò Nhanh
  const switchRole = (newRole) => {
    setProfile(prev => ({ ...prev, role: newRole }));
  };

  // Kích hoạt VIP thành công
  const enableVip = () => {
    setProfile(prev => ({ ...prev, is_vip: true }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUpWithUsername,
      signInWithUsername,
      signInWithGoogle,
      signOut,
      switchRole,
      enableVip,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
