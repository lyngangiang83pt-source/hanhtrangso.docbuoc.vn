import React, { useState, useEffect } from 'react';
import { submitStudentProduct, getStudentSubmissions } from '../../config/supabase';
import { FolderGit2, QrCode, ExternalLink, Send, CheckCircle2, Upload, FileText, User } from 'lucide-react';
import { QRModal } from '../../components/common/QRModal';

export function StudentProductsView() {
  const [submissions, setSubmissions] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, method: '', url: '', title: '' });
  
  // State Form nộp bài trực tiếp
  const [formData, setFormData] = useState({
    student_name: '',
    class_name: '6A1',
    assignment_title: '',
    submission_method: 'direct_upload',
    submission_url: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const data = await getStudentSubmissions();
    setSubmissions(data);
  };

  const handleOpenQRModal = (method, url, title) => {
    setModalState({ isOpen: true, method, url, title });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name || !formData.assignment_title) return;

    const { data, error } = await submitStudentProduct(formData);
    if (!error) {
      setSubmitSuccess(true);
      fetchSubmissions();
      setFormData({
        student_name: '',
        class_name: '6A1',
        assignment_title: '',
        submission_method: 'direct_upload',
        submission_url: '',
      });
      setTimeout(() => setSubmitSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* HEADER SẢN PHẨM HỌC SINH */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Mục 2.6 - Sản Phẩm Học Sinh & Nộp Bài</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Cổng Nộp Bài Học Sinh & Triển Lãm Dự Án
          </h2>
        </div>
      </div>

      {/* 3 PHƯƠNG THỨC NỘP BÀI NHANH (PADLET QR, GOOGLE DRIVE LINK, ZALO QR) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Nộp trên Padlet */}
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">
              1. Nộp Trên Padlet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nộp bài tập sáng tạo, tranh ảnh, video bằng cách quét mã QR hoặc bấm vào link Padlet lớp.
            </p>
          </div>

          <button
            onClick={() => handleOpenQRModal('padlet', 'https://padlet.com/demo_eduteacher/nop_bai_hoc_sinh', 'Mã QR Padlet Nộp Bài Sáng Tạo')}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Quét QR / Mở Link Padlet</span>
          </button>
        </div>

        {/* 2. Nộp qua Google Drive */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">
              2. Nộp Qua Google Drive
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tải file báo cáo docx/pptx/pdf trực tiếp lên thư mục Google Drive nộp bài của giáo viên.
            </p>
          </div>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Click Mở Thư Mục Drive</span>
          </a>
        </div>

        {/* 3. Nộp qua Zalo */}
        <div className="glass-card p-6 rounded-3xl border border-blue-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">
              3. Nộp Qua Zalo
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gửi sản phẩm nhanh cho Giáo viên bộ môn qua Zalo nhóm lớp hoặc tài khoản Zalo cá nhân.
            </p>
          </div>

          <button
            onClick={() => handleOpenQRModal('zalo', 'https://zalo.me', 'Mã QR Zalo Nộp Bài Cho Giáo Viên')}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Quét QR / Mở Link Zalo</span>
          </button>
        </div>

      </div>

      {/* FORM NỘP BÀI TRỰC TIẾP LƯU DATABASE SUPABASE */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-white">
            Nộp Bài Trực Tiếp Lưu Hệ Thống Supabase
          </h3>
          <p className="text-xs text-slate-400">
            Học sinh điền thông tin và liên kết bài làm (Drive/Canva/Youtube) để Giáo viên ghi nhận điểm số
          </p>
        </div>

        {submitSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Nộp bài thành công! Bài làm của bạn đã được ghi nhận trên CSDL Supabase.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Họ và Tên Học Sinh</label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn An"
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lớp Học</label>
            <select
              value={formData.class_name}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="6A1">Lớp 6A1</option>
              <option value="7A2">Lớp 7A2</option>
              <option value="8A1">Lớp 8A1</option>
              <option value="9A3">Lớp 9A3</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên Bài Tập / Dự Án</label>
            <input
              type="text"
              required
              placeholder="VD: Bài tập Ngữ Văn Khối 9 - Nghị luận"
              value={formData.assignment_title}
              onChange={(e) => setFormData({ ...formData, assignment_title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Đường Link Bài Làm (Drive/Padlet/Youtube)</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/..."
              value={formData.submission_url}
              onChange={(e) => setFormData({ ...formData, submission_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Bài Nộp Lên CSDL Supabase</span>
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH SẢN PHẨM HỌC SINH ĐÃ NỘP */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xl text-white">Danh Sách Bài Đã Nộp Gần Đây</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white mb-0.5">{sub.student_name} ({sub.class_name})</div>
                <div className="text-slate-400">{sub.assignment_title}</div>
                <span className="text-[10px] text-indigo-400">{new Date(sub.submitted_at).toLocaleDateString('vi-VN')}</span>
              </div>
              <a
                href={sub.submission_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Xem Bài Làm
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL MÃ QR NỘP BÀI */}
      <QRModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        method={modalState.method}
        url={modalState.url}
      />

    </div>
  );
}
