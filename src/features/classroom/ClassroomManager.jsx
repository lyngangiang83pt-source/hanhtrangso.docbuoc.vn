import React, { useState, useEffect } from 'react';
import { getClassesWithStudents, addStudent, deleteStudent } from '../../config/supabase';
import { Users, UserPlus, Trash2, Shield, Plus, School, Search } from 'lucide-react';

export function ClassroomManager() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    student_code: '',
    full_name: '',
    gender: 'Nam',
    class_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { classes: cList, students: sList } = await getClassesWithStudents();
    setClasses(cList);
    setStudents(sList);
    if (cList.length > 0 && !newStudent.class_id) {
      setNewStudent(prev => ({ ...prev, class_id: cList[0].id }));
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.student_code || !newStudent.full_name) return;

    const { error } = await addStudent(newStudent);
    if (!error) {
      fetchData();
      setShowAddModal(false);
      setNewStudent({ student_code: '', full_name: '', gender: 'Nam', class_id: classes[0]?.id || '' });
    } else {
      alert('Thêm học sinh không thành công: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi CSDL Supabase?')) {
      await deleteStudent(id);
      fetchData();
    }
  };

  const filteredStudents = students.filter(s => 
    selectedClassId === 'all' ? true : s.class_id === selectedClassId
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER QUẢN LÝ LỚP HỌC */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-white">
              Quản Lý Lớp Học & Học Sinh (Dành Cho Giáo Viên & Admin)
            </h2>
            <p className="text-xs text-slate-400">Danh sách các lớp 6, 7, 8, 9 và thông tin hồ sơ học sinh</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Học Sinh Mới</span>
        </button>
      </div>

      {/* TABS LỌC LỚP HỌC */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setSelectedClassId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedClassId === 'all' ? 'bg-indigo-600 text-white' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          Tất Cả Lớp ({students.length} HS)
        </button>

        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedClassId === cls.id ? 'bg-indigo-600 text-white' : 'glass-card text-slate-400 hover:text-white'
            }`}
          >
            {cls.name} (Khối {cls.grade})
          </button>
        ))}
      </div>

      {/* BẢNG DANH SÁCH HỌC SINH */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Mã Học Sinh</th>
                <th className="px-6 py-4">Họ và Tên Học Sinh</th>
                <th className="px-6 py-4">Giới Tính</th>
                <th className="px-6 py-4">Lớp Học</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.map((st) => {
                const cls = classes.find(c => c.id === st.class_id);
                return (
                  <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-400">{st.student_code}</td>
                    <td className="px-6 py-4 font-bold text-white">{st.full_name}</td>
                    <td className="px-6 py-4">{st.gender}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold">
                        {cls?.name || 'Chưa phân lớp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(st.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Xóa học sinh khỏi CSDL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM HỌC SINH MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Thêm Hồ Sơ Học Sinh Mới</h3>
            
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Mã Học Sinh (VD: HS6005)</label>
                <input
                  type="text"
                  required
                  value={newStudent.student_code}
                  onChange={(e) => setNewStudent({ ...newStudent, student_code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Giới Tính</label>
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Phân Lớp</label>
                <select
                  value={newStudent.class_id}
                  onChange={(e) => setNewStudent({ ...newStudent, class_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                >
                  Lưu Học Sinh
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
