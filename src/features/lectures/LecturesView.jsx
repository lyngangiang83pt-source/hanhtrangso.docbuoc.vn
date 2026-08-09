import React, { useState, useEffect } from 'react';
import { getLectures } from '../../config/supabase';
import { FileText, Download, Sparkles, Cpu, Layers, Filter, CheckCircle2, Video } from 'lucide-react';

export function LecturesView() {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
  }, [selectedGrade]);

  const fetchLectures = async () => {
    setLoading(true);
    const data = await getLectures(selectedGrade);
    setLectures(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER BÀI GIẢNG */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Mục 2.4 - Bài Giảng Theo Khối 6, 7, 8, 9 (Docx, PPTX & Elearning)</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Thư Viện Bài Giảng Tích Hợp NLS & AI Trợ Giảng
          </h2>
        </div>

        {/* Lọc Khối Lớp 6, 7, 8, 9 */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <Filter className="w-4 h-4 text-indigo-400 ml-2" />
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Khối:</span>
          {['all', '6', '7', '8', '9'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g === 'all' ? 'Tất Cả' : `Khối ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BÀI GIẢNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lectures.map((item) => (
          <div 
            key={item.id}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 flex flex-col justify-between space-y-4 group transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  KHỐI {item.grade} - {item.subject}
                </span>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  item.file_type === 'pptx' ? 'bg-orange-500/20 text-orange-300' :
                  item.file_type === 'docx' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {item.file_type === 'pptx' ? 'PowerPoint (PPTX)' : item.file_type === 'docx' ? 'Giáo án (DOCX)' : 'Bài Giảng Elearning'}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">
                {item.title}
              </h3>

              {/* Huy hiệu tích hợp NLS và AI */}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.has_nls && (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    <span>Tích hợp Năng lực số (NLS)</span>
                  </span>
                )}
                {item.has_ai_support && (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Trợ lý AI Hỗ trợ Giảng dạy</span>
                  </span>
                )}
              </div>
            </div>

            {/* Nút Tải Bài Giảng */}
            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all group-hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bài Giảng Về Máy ({item.file_type.toUpperCase()})</span>
            </a>

          </div>
        ))}
      </div>

    </div>
  );
}
