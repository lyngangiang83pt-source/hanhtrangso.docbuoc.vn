import React, { useState, useEffect } from 'react';
import { getSubjects, addSubject, updateSubject, deleteSubject } from '../../config/supabase';
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, Layers } from 'lucide-react';

export function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null); // null -> Thêm mới, object -> Sửa

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchSubjectsList();
  }, []);

  const fetchSubjectsList = async () => {
    setLoading(true);
    const data = await getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setFormData({ code: '', name: '', description: '' });
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      code: sub.code,
      name: sub.name,
      description: sub.description || '',
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (editingSubject) {
      // Sửa môn học
      const { data, error } = await updateSubject(editingSubject.id, {
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      if (error) {
        setErrorMsg('Lỗi cập nhật môn học: ' + error.message);
      } else {
        setSuccessMsg('Cập nhật môn học thành công!');
        fetchSubjectsList();
        setTimeout(() => setIsModalOpen(false), 1000);
      }
    } else {
      // Thêm môn học mới
      const { data, error } = await addSubject({
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      if (error) {
        setErrorMsg('Lỗi thêm môn học: ' + (error.message.includes('unique') ? 'Mã môn học này đã tồn tại!' : error.message));
      } else {
        setSuccessMsg('Thêm môn học mới thành công!');
        fetchSubjectsList();
        setTimeout(() => setIsModalOpen(false), 1000);
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${name}" khỏi Cơ sở dữ liệu Supabase?`)) {
      const { error } = await deleteSubject(id);
      if (error) {
        alert('Không thể xóa môn học: ' + error.message);
      } else {
        fetchSubjectsList();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER TÍNH NĂNG QUẢN LÝ MÔN HỌC */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-white">
              Thẻ Quản Lý Môn Học (Giáo Viên & Admin)
            </h2>
            <p className="text-xs text-slate-400">Thao tác Thêm - Sửa - Xóa môn học và đồng bộ CSDL Supabase real-time</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Môn Học Mới</span>
        </button>
      </div>

      {/* DANH SÁCH MÔN HỌC */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-purple-400 space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Đang tải danh sách môn học từ Supabase DB...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div 
              key={sub.id} 
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between space-y-4 group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    MÃ: {sub.code}
                  </span>

                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(sub.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {sub.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sub.description || 'Chưa có mô tả chi tiết cho môn học này.'}
                </p>
              </div>

              {/* NÚT THAO TÁC SỬA - XÓA MÔN HỌC */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(sub)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => handleDelete(sub.id, sub.name)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM / SỬA MÔN HỌC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-white">
              {editingSubject ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học Mới'}
            </h3>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mã Môn Học (Ví dụ: VAN, TOAN, KHTN, TIN)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: VAN"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên Môn Học Full
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ngữ Văn Khối 6-9"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mô Tả Chi Tiết Môn Học
                </label>
                <textarea
                  rows="3"
                  placeholder="Nhập nội dung mô tả môn học..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
                >
                  {editingSubject ? 'Lưu Thay Đổi' : 'Tạo Môn Học Mới'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
