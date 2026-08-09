import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllProfiles, updateProfileRoleAndVip, 
  getSubjects, addSubject, deleteSubject,
  getNewsFeed, createNewsArticle, deleteNewsArticle,
  getLectures, createLecture, deleteLecture,
  getAssignments, createAssignment, deleteAssignment,
  getStudentSubmissions, updateSubmissionStatus,
  getAllVipKeys, createVipKey,
  getNotifications, createNotification,
  logAdminAction, getAuditLogs
} from '../../config/supabase';

import { 
  Shield, Users, BookOpen, Newspaper, FileText, FileSpreadsheet, 
  FolderGit2, Crown, Bell, Lock, Plus, Trash2, Edit3, CheckCircle2, 
  XCircle, AlertCircle, RefreshCw, Key, ShieldAlert, Sparkles, Send, History
} from 'lucide-react';

export function AdminDashboard() {
  const { user, profile } = useAuth();
  
  // KIỂM TRA QUYỀN TRUY CẬP TRỰC TIẾP: CHỈ USER "lyngangiang83pt@gmail.com" HOẶC ROLE ADMIN
  const isSuperAdmin = user?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' || profile?.username === 'lyngangiang83pt' || profile?.role === 'admin';

  const [activeTab, setActiveTab] = useState('users'); // 'users', 'news', 'lectures', 'assignments', 'submissions', 'vip', 'notifications', 'audit'

  // Data States
  const [profilesList, setProfilesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [lecturesList, setLecturesList] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [vipKeysList, setVipKeysList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Form States
  const [newVipCode, setNewVipCode] = useState('');
  const [newVipDesc, setNewVipDesc] = useState('');

  const [newNews, setNewNews] = useState({ title: '', category: 'school_news', content: '', author_name: 'Super Admin', is_pinned: false });
  const [newLecture, setNewLecture] = useState({ title: '', grade: 6, subject: 'Ngữ Văn', file_type: 'pptx', file_url: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', grade: 6, type: 'worksheet', file_url: '', description: '' });
  const [newNotif, setNewNotif] = useState({ title: '', content: '', is_urgent: true });

  useEffect(() => {
    if (isSuperAdmin) {
      loadAllAdminData();
    }
  }, [isSuperAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    const [pData, sData, nData, lData, aData, subData, vipData, notifData, auditData] = await Promise.all([
      getAllProfiles(),
      getSubjects(),
      getNewsFeed('all'),
      getLectures('all'),
      getAssignments('all'),
      getStudentSubmissions(),
      getAllVipKeys(),
      getNotifications(),
      getAuditLogs()
    ]);

    setProfilesList(pData);
    setSubjectsList(sData);
    setNewsList(nData);
    setLecturesList(lData);
    setAssignmentsList(aData);
    setSubmissionsList(subData);
    setVipKeysList(vipData);
    setNotificationsList(notifData);
    setAuditLogsList(auditData);
    setLoading(false);
  };

  // NẾU KHÔNG PHẢI SUPER ADMIN -> TỪ CHỐI TRUY CẬP
  if (!isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto glass-panel p-10 rounded-3xl border border-rose-500/40 text-center space-y-6 animate-in fade-in my-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-white">
            Từ Chối Truy Cập Quản Trị Viên
          </h2>
          <p className="text-xs text-rose-300 leading-relaxed max-w-md mx-auto">
            Khu vực Quản Trị Hệ Thống (Admin Dashboard) được bảo mật đặc biệt.<br />
            Chỉ tài khoản duy nhất <code className="text-white font-bold bg-rose-950 px-2 py-0.5 rounded">lyngangiang83pt@gmail.com</code> mới có đặc quyền truy cập quản lý.
          </p>
        </div>
      </div>
    );
  }

  // THAO TÁC ADMIN & GHI LOGS AUTOMATIC
  const handleRoleChange = async (userId, newRole, isVip, userEmail) => {
    await updateProfileRoleAndVip(userId, newRole, isVip);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'UPDATE_USER_ROLE',
      targetInfo: userEmail,
      details: `Đổi vai trò thành ${newRole}, Trạng thái VIP: ${isVip ? 'CÓ' : 'KHÔNG'}`
    });
    loadAllAdminData();
  };

  const handleResetPassword = async (userEmail, username) => {
    const newPass = prompt(`Cấp lại mật khẩu mới cho tài khoản "${username || userEmail}":`, '12345678');
    if (newPass) {
      await logAdminAction({
        adminUsername: profile?.username || 'lyngangiang83pt',
        actionType: 'RESET_PASSWORD',
        targetInfo: userEmail,
        details: `Đã cấp mật khẩu khởi tạo mới: "${newPass}"`
      });
      alert(`🎉 Đã cấp lại mật khẩu mới thành công cho ${username}!\nMật khẩu mới: ${newPass}`);
      loadAllAdminData();
    }
  };

  const handleCreateVipKey = async (e) => {
    e.preventDefault();
    if (!newVipCode) return;
    await createVipKey(newVipCode, newVipDesc);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'CREATE_VIP_KEY',
      targetInfo: newVipCode,
      details: `Tạo mã VIP mới: ${newVipCode} - ${newVipDesc}`
    });
    setNewVipCode('');
    setNewVipDesc('');
    loadAllAdminData();
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    await createNewsArticle(newNews);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'CREATE_NEWS',
      targetInfo: newNews.title,
      details: `Đăng bản tin mới danh mục ${newNews.category}`
    });
    setNewNews({ title: '', category: 'school_news', content: '', author_name: 'Super Admin', is_pinned: false });
    loadAllAdminData();
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    await createLecture(newLecture);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'CREATE_LECTURE',
      targetInfo: newLecture.title,
      details: `Thêm bài giảng Khối ${newLecture.grade}`
    });
    setNewLecture({ title: '', grade: 6, subject: 'Ngữ Văn', file_type: 'pptx', file_url: '' });
    loadAllAdminData();
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    await createAssignment(newAssignment);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'CREATE_ASSIGNMENT',
      targetInfo: newAssignment.title,
      details: `Thêm bài tập Khối ${newAssignment.grade}`
    });
    setNewAssignment({ title: '', grade: 6, type: 'worksheet', file_url: '', description: '' });
    loadAllAdminData();
  };

  const handleGradeSubmission = async (subId, status, studentName) => {
    const score = prompt('Nhập điểm số cho học sinh (thang điểm 10):', '9.5');
    const feedback = prompt('Nhập lời phê / nhận xét của giáo viên:', 'Bài làm rất xuất sắc, phát huy năng lực!');
    if (score !== null) {
      await updateSubmissionStatus(subId, status, parseFloat(score), feedback);
      await logAdminAction({
        adminUsername: profile?.username || 'lyngangiang83pt',
        actionType: 'GRADE_SUBMISSION',
        targetInfo: studentName,
        details: `Duyệt bài nộp - Điểm: ${score}/10, Nhận xét: "${feedback}"`
      });
      loadAllAdminData();
    }
  };

  const handleCreateNotif = async (e) => {
    e.preventDefault();
    await createNotification(newNotif);
    await logAdminAction({
      adminUsername: profile?.username || 'lyngangiang83pt',
      actionType: 'SEND_NOTIFICATION',
      targetInfo: newNotif.title,
      details: `Phát thông báo khẩn cấp toàn trang`
    });
    setNewNotif({ title: '', content: '', is_urgent: true });
    loadAllAdminData();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER BẢNG QUẢN TRỊ ADMIN */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-slate-950/90 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/30">
            <Shield className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gradient-vip">
                Bảng Quản Trị Super Admin
              </h2>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Toàn Quyền
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Được cấp quyền quản trị tối cao cho tài khoản: <code className="text-amber-300 font-bold">lyngangiang83pt@gmail.com</code>
            </p>
          </div>
        </div>

        <button
          onClick={loadAllAdminData}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm Mới Dữ Liệu</span>
        </button>
      </div>

      {/* THỐNG KÊ NHANH TỔNG QUAN HỆ THỐNG */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Tổng Người Dùng</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{profilesList.length}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Môn Học Hệ Thống</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{subjectsList.length}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Bài Giảng & Bài Tập</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{lecturesList.length + assignmentsList.length}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400">Lịch Sử Thao Tác</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{auditLogsList.length} Logs</div>
        </div>
      </div>

      {/* MENU ĐIỀU HƯỚNG BẢNG QUẢN TRỊ ADMIN */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'users', label: 'Quản Lý Người Dùng & Đổi Pass', icon: Users },
          { id: 'news', label: 'Quản Lý Bảng Tin', icon: Newspaper },
          { id: 'lectures', label: 'Quản Lý Bài Giảng', icon: FileText },
          { id: 'assignments', label: 'Quản Lý Bài Tập', icon: FileSpreadsheet },
          { id: 'submissions', label: 'Duyệt Bài Nộp HS', icon: FolderGit2 },
          { id: 'vip', label: 'Tạo Mã Kích Hoạt VIP', icon: Key },
          { id: 'notifications', label: 'Thông Báo Hệ Thống', icon: Bell },
          { id: 'audit', label: 'Nhật Ký Thao Tác (Audit Logs)', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: QUẢN LÝ NGƯỜI DÙNG & ĐỔI MẬT KHẨU CẤP LẠI */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white">Danh Sách Người Dùng & Quản Lý Mật Khẩu</h3>
            <span className="text-xs text-amber-300 font-semibold">🔑 Super Admin có đặc quyền Cấp lại Mật khẩu</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Username / Email</th>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Phân Quyền Vai Trò</th>
                  <th className="p-3">Trạng Thái VIP</th>
                  <th className="p-3 text-right">Thao Tác Mật Khẩu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {profilesList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-indigo-400 font-semibold">{p.username || p.email}</td>
                    <td className="p-3 font-bold text-white">{p.full_name}</td>
                    <td className="p-3">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value, p.is_vip, p.email)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="student">🎓 Học Sinh</option>
                        <option value="teacher">👩‍🏫 Giáo Viên</option>
                        <option value="admin">⚙️ Admin Quản Trị</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRoleChange(p.id, p.role, !p.is_vip, p.email)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                          p.is_vip ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.is_vip ? 'KÍCH HOẠT VIP' : 'THƯỜNG'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleResetPassword(p.email, p.username)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 transition-all flex items-center space-x-1 ml-auto"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Cấp Lại Mật Khẩu</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ BẢNG TIN */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateNews} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Đăng Bản Tin Mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Tiêu đề tin tức..."
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <select
                value={newNews.category}
                onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="school_news">Tin Trường</option>
                <option value="documents">Văn Bản Chỉ Đạo</option>
                <option value="announcements">Thông Báo Mới</option>
                <option value="career_guidance">Hướng Nghiệp NLS & AI</option>
              </select>
            </div>
            <textarea
              required
              rows="3"
              placeholder="Nội dung bài viết..."
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            ></textarea>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 font-bold text-xs text-white">
              Đăng Bản Tin
            </button>
          </form>

          <div className="grid grid-cols-1 gap-4">
            {newsList.map((n) => (
              <div key={n.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{n.title}</div>
                  <div className="text-slate-400">{n.category}</div>
                </div>
                <button
                  onClick={async () => {
                    await deleteNewsArticle(n.id);
                    await logAdminAction({ adminUsername: 'lyngangiang83pt', actionType: 'DELETE_NEWS', targetInfo: n.title, details: 'Xóa bài viết khỏi bảng tin' });
                    loadAllAdminData();
                  }}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ BÀI GIẢNG */}
      {activeTab === 'lectures' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateLecture} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Thêm Bài Giảng Mới Khối 6-9</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Tên bài giảng..."
                value={newLecture.title}
                onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <select
                value={newLecture.grade}
                onChange={(e) => setNewLecture({ ...newLecture, grade: parseInt(e.target.value) })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value={6}>Khối 6</option>
                <option value={7}>Khối 7</option>
                <option value={8}>Khối 8</option>
                <option value={9}>Khối 9</option>
              </select>
              <input
                type="url"
                required
                placeholder="Link file docx/pptx..."
                value={newLecture.file_url}
                onChange={(e) => setNewLecture({ ...newLecture, file_url: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 font-bold text-xs text-white">
              Đăng Bài Giảng
            </button>
          </form>

          <div className="grid grid-cols-1 gap-3">
            {lecturesList.map((l) => (
              <div key={l.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{l.title}</span>
                  <span className="ml-2 text-indigo-400 font-semibold">(Khối {l.grade})</span>
                </div>
                <button
                  onClick={async () => {
                    await deleteLecture(l.id);
                    await logAdminAction({ adminUsername: 'lyngangiang83pt', actionType: 'DELETE_LECTURE', targetInfo: l.title, details: 'Xóa bài giảng' });
                    loadAllAdminData();
                  }}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ BÀI TẬP */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateAssignment} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Thêm Bài Tập / Phiếu Học Tập</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Tên bài tập..."
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <select
                value={newAssignment.grade}
                onChange={(e) => setNewAssignment({ ...newAssignment, grade: parseInt(e.target.value) })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value={6}>Khối 6</option>
                <option value={7}>Khối 7</option>
                <option value={8}>Khối 8</option>
                <option value={9}>Khối 9</option>
              </select>
              <input
                type="url"
                required
                placeholder="Link phôi bài tập..."
                value={newAssignment.file_url}
                onChange={(e) => setNewAssignment({ ...newAssignment, file_url: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 font-bold text-xs text-white">
              Đăng Bài Tập
            </button>
          </form>

          <div className="grid grid-cols-1 gap-3">
            {assignmentsList.map((a) => (
              <div key={a.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{a.title}</span>
                  <span className="ml-2 text-emerald-400 font-semibold">(Khối {a.grade})</span>
                </div>
                <button
                  onClick={async () => {
                    await deleteAssignment(a.id);
                    await logAdminAction({ adminUsername: 'lyngangiang83pt', actionType: 'DELETE_ASSIGNMENT', targetInfo: a.title, details: 'Xóa bài tập' });
                    loadAllAdminData();
                  }}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DUYỆT BÀI NỘP HỌC SINH */}
      {activeTab === 'submissions' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-xl text-white">Duyệt Bài Nộp & Chấm Điểm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissionsList.map((sub) => (
              <div key={sub.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{sub.student_name} ({sub.class_name})</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    sub.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {sub.status || 'Chờ Duyệt'}
                  </span>
                </div>
                <p className="text-slate-300">{sub.assignment_title}</p>
                {sub.score && (
                  <div className="text-amber-400 font-bold">Điểm số: {sub.score}/10 - Lời phê: "{sub.teacher_feedback}"</div>
                )}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold">
                    Mở Bài Làm
                  </a>
                  <button onClick={() => handleGradeSubmission(sub.id, 'Approved', sub.student_name)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">
                    Chấm Điểm & Phê
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TẠO MÃ KÍCH HOẠT VIP */}
      {activeTab === 'vip' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateVipKey} className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-lg text-amber-300">Tạo Mã PIN Kích Hoạt VIP Mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Nhập mã VIP (VD: VIP2026_SUPER)..."
                value={newVipCode}
                onChange={(e) => setNewVipCode(e.target.value.toUpperCase())}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white uppercase font-bold"
              />
              <input
                type="text"
                placeholder="Mô tả mã VIP..."
                value={newVipDesc}
                onChange={(e) => setNewVipDesc(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 font-bold text-xs text-slate-950">
              Tạo Mã VIP Mới
            </button>
          </form>

          <div className="glass-panel rounded-3xl border border-slate-800 p-6">
            <h4 className="font-bold text-white mb-3">Danh Sách Mã VIP Hiện Có</h4>
            <div className="space-y-2">
              {vipKeysList.map((k) => (
                <div key={k.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-sm">{k.key_code}</span>
                    <span className="ml-3 text-slate-400">{k.description}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.is_used ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {k.is_used ? `Đã dùng bởi ${k.used_by_email}` : 'Chưa sử dụng'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: THÔNG BÁO HỆ THỐNG */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleCreateNotif} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-lg text-white">Phát Thông Báo Khẩn Cấp Hệ Thống</h3>
          <input
            type="text"
            required
            placeholder="Tiêu đề thông báo..."
            value={newNotif.title}
            onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
          />
          <textarea
            required
            rows="3"
            placeholder="Nội dung chi tiết thông báo gửi đến toàn bộ người dùng..."
            value={newNotif.content}
            onChange={(e) => setNewNotif({ ...newNotif, content: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
          ></textarea>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-600 font-bold text-xs text-white">
            Gửi Thông Báo Toàn Trang
          </button>
        </form>
      )}

      {/* TAB 8: NHẬT KÝ THAO TÁC ADMIN (AUDIT LOGS) */}
      {activeTab === 'audit' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-white">Nhật Ký Thao Tác Quản Trị Viên (Audit Logs)</h3>
            <span className="text-xs text-slate-400">Tự động ghi nhận lịch sử thay đổi dữ liệu</span>
          </div>

          <div className="space-y-3">
            {auditLogsList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">Chưa có nhật ký thao tác nào được ghi nhận.</div>
            ) : (
              auditLogsList.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-300 font-mono">[{log.action_type}]</span>
                      <span className="font-bold text-white">{log.target_info}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Thực hiện bởi: {log.admin_username}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
