import React, { useState, useEffect } from 'react';
import { getNewsFeed } from '../../config/supabase';
import { Newspaper, FileText, Bell, Compass, Pin, Calendar, User, Search, RefreshCw } from 'lucide-react';

export function NewsView() {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, [activeSubTab]);

  const fetchNews = async () => {
    setLoading(true);
    const data = await getNewsFeed(activeSubTab);
    setNews(data);
    setLoading(false);
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER BẢNG TIN */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" />
            <span>Mục 2.1 - Bảng Tin Trường & Định Hướng</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Bảng Tin & Thông Tin Giáo Dục
          </h2>
        </div>

        {/* Thanh Tìm kiếm */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bản tin, văn bản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 4 SUB-TABS PHÂN LOẠI (TIN TRƯỜNG, VĂN BẢN, THÔNG BÁO, HƯỚNG NGHIỆP) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'all', label: 'Tất Cả Tin Tức', icon: Newspaper },
          { id: 'school_news', label: 'Tin Trường', icon: Newspaper },
          { id: 'documents', label: 'Văn Bản Chỉ Đạo', icon: FileText },
          { id: 'announcements', label: 'Thông Báo Mới', icon: Bell },
          { id: 'career_guidance', label: 'Hướng Nghiệp NLS & AI', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'glass-card text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DANH SÁCH BẢN TIN */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-indigo-400 space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Đang tải bản tin từ Supabase Database...</span>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">Không tìm thấy tin tức phù hợp trong danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <div 
              key={item.id}
              className={`glass-card p-6 rounded-2xl border ${
                item.is_pinned ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800'
              } flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    item.category === 'school_news' ? 'bg-indigo-500/20 text-indigo-300' :
                    item.category === 'documents' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.category === 'announcements' ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {item.category === 'school_news' ? 'Tin Trường' :
                     item.category === 'documents' ? 'Văn Bản' :
                     item.category === 'announcements' ? 'Thông Báo' : 'Hướng Nghiệp'}
                  </span>

                  {item.is_pinned && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Pin className="w-3 h-3 fill-amber-400" />
                      <span>Ghim Nổi Bật</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{item.author_name}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
