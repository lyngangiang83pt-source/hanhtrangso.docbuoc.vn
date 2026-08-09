import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../config/supabase';
import { Bell, AlertCircle, Calendar, Sparkles, CheckCircle } from 'lucide-react';

export function NotificationsView() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      
      {/* HEADER THÔNG BÁO */}
      <div className="flex items-center space-x-3 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            Thông Báo Hệ Thống & Cập Nhật Mới
          </h2>
          <p className="text-xs text-slate-400">Các tin tức, thông báo quan trọng mới nhất trên website</p>
        </div>
      </div>

      {/* DANH SÁCH THÔNG BÁO */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <div 
            key={item.id}
            className={`glass-card p-6 rounded-3xl border ${
              item.is_urgent ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
            } space-y-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {item.is_urgent && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>Khẩn Cấp / Quan Trọng</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  {new Date(item.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            <h3 className="font-display font-bold text-lg text-white">
              {item.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
