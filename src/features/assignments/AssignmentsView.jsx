import React, { useState, useEffect } from 'react';
import { getAssignments } from '../../config/supabase';
import { FileSpreadsheet, Download, Filter, Calendar, BookOpen, Clock } from 'lucide-react';

export function AssignmentsView() {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, [selectedGrade, selectedType]);

  const fetchAssignments = async () => {
    const data = await getAssignments(selectedGrade, selectedType);
    setAssignments(data);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER BÀI TẬP */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Mục 2.5 - Phiếu Học Tập & Bài Tập Về Nhà Khối 6, 7, 8, 9</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Kho Bài Tập & Phiếu Học Tập Định Hướng Năng Lực
          </h2>
        </div>

        {/* Bộ Lọc Theo Khối & Phân Loại */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {['all', '6', '7', '8', '9'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGrade === g ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'all' ? 'Tất Cả Khối' : `K${g}`}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedType === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setSelectedType('worksheet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedType === 'worksheet' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Phiếu Học Tập
            </button>
            <button
              onClick={() => setSelectedType('homework')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedType === 'homework' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Bài Tập Về Nhà
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI TẬP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((item) => (
          <div 
            key={item.id}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between space-y-4 group transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  KHỐI {item.grade}
                </span>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  item.type === 'worksheet' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.type === 'worksheet' ? 'Phiếu Học Tập' : 'Bài Tập Về Nhà'}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            {/* Nút Tải Bài Tập */}
            <a
              href={item.file_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition-all group-hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Tải Phôi Bài Tập Về Làm</span>
            </a>

          </div>
        ))}
      </div>

    </div>
  );
}
