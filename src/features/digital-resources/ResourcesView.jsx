import React, { useState, useEffect } from 'react';
import { getDigitalResources } from '../../config/supabase';
import { BookOpenCheck, Film, BookMarked, Radio, Play, Pause, ExternalLink, Clock, User, Download } from 'lucide-react';

export function ResourcesView() {
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    const data = await getDigitalResources(activeTab);
    setResources(data);
  };

  const handlePlayAudio = (url) => {
    if (currentAudio && currentAudio.src === url) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(url);
      newAudio.play();
      setCurrentAudio(newAudio);
      setIsPlaying(true);
      newAudio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER HỌC LIỆU SỐ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" />
            <span>Mục 2.3 - Học Liệu Số Giáo Dục</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Kho Học Liệu Số & Podcast Ngắn
          </h2>
        </div>
      </div>

      {/* SUB-TABS: PHIM GIÁO DỤC, SỔ TAY TRI THỨC, PODCAST NGẮN */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'Tất Cả Học Liệu', icon: BookOpenCheck },
          { id: 'educational_films', label: 'Phim Giáo Dục', icon: Film },
          { id: 'knowledge_handbook', label: 'Sổ Tay Tri Thức', icon: BookMarked },
          { id: 'podcasts', label: 'Podcast Ngắn Audio', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* DANH SÁCH HỌC LIỆU SỐ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((item) => (
          <div 
            key={item.id}
            className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 transition-all"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img 
                  src={item.thumbnail_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  item.resource_type === 'educational_films' ? 'bg-rose-500/80 text-white' :
                  item.resource_type === 'knowledge_handbook' ? 'bg-amber-500/80 text-slate-950' : 'bg-indigo-500/80 text-white'
                }`}>
                  {item.resource_type === 'educational_films' ? 'Phim Giáo Dục' :
                   item.resource_type === 'knowledge_handbook' ? 'Sổ Tay Tri Thức' : 'Podcast Audio'}
                </span>

                {item.duration && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{item.duration}</span>
                  </span>
                )}
              </div>

              {/* Nội dung tin học liệu */}
              <div className="p-6 space-y-3">
                <h3 className="font-display font-bold text-base text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Nút bấm tương tác */}
            <div className="p-6 pt-0">
              {item.resource_type === 'podcasts' ? (
                <button
                  onClick={() => handlePlayAudio(item.media_url)}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  {isPlaying && currentAudio?.src === item.media_url ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying && currentAudio?.src === item.media_url ? 'Đang Phát Podcast' : 'Nghe Podcast Ngắn'}</span>
                </button>
              ) : (
                <a
                  href={item.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-all border border-slate-700"
                >
                  <span>Mở Học Liệu</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
