import { createClient } from '@supabase/supabase-js';

// Đọc thông số biến môi trường (Vite ENV) với Fallback Supabase URL thực tế của Thầy/Cô
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://qmwprqrupefjlxdlitoh.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtd3BycXJ1cGVmamx4ZGxpdG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTM0NjAsImV4cCI6MjEwMTY2OTQ2MH0.EwCpg3QfIKbTnMFZWKOKS1phWLyy6o37S0s2OEP3xpc';

// Khởi tạo Supabase Client
export const supabase = (typeof window !== 'undefined' && window.supabase?.createClient)
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// SUPABASE DATABASE API HELPERS (THAO TÁC CƠ SỞ DỮ LIỆU THỰC TẾ)
// ====================================================================

// 1. Quản lý Profiles & User Roles
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Lỗi lấy thông tin profile từ Supabase:', err.message);
    return null;
  }
}

export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select();
  return { data, error };
}

// 2. Bảng tin (News Feed)
export async function getNewsFeed(category = 'all') {
  try {
    let query = supabase.from('news_feed').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Supabase tin tức thất bại:', err.message);
    return [];
  }
}

export async function createNewsArticle(articleData) {
  const { data, error } = await supabase
    .from('news_feed')
    .insert([articleData])
    .select();
  return { data, error };
}

// 3. Bài Giảng (Lectures)
export async function getLectures(grade = 'all', subject = 'all') {
  try {
    let query = supabase.from('lectures').select('*').order('created_at', { ascending: false });
    if (grade !== 'all') query = query.eq('grade', parseInt(grade));
    if (subject !== 'all') query = query.eq('subject', subject);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Bài giảng thất bại:', err.message);
    return [];
  }
}

export async function createLecture(lectureData) {
  const { data, error } = await supabase.from('lectures').insert([lectureData]).select();
  return { data, error };
}

// 4. Bài Tập (Assignments)
export async function getAssignments(grade = 'all', type = 'all') {
  try {
    let query = supabase.from('assignments').select('*').order('created_at', { ascending: false });
    if (grade !== 'all') query = query.eq('grade', parseInt(grade));
    if (type !== 'all') query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Bài tập thất bại:', err.message);
    return [];
  }
}

export async function createAssignment(assignmentData) {
  const { data, error } = await supabase.from('assignments').insert([assignmentData]).select();
  return { data, error };
}

// 5. Học Liệu Số (Digital Resources)
export async function getDigitalResources(resourceType = 'all') {
  try {
    let query = supabase.from('digital_resources').select('*').order('created_at', { ascending: false });
    if (resourceType !== 'all') query = query.eq('resource_type', resourceType);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Học liệu số thất bại:', err.message);
    return [];
  }
}

// 6. Game Học Tập (Games)
export async function getGames() {
  try {
    const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Game thất bại:', err.message);
    return [];
  }
}

// 7. Sản Phẩm Học Sinh & Nộp Bài (Student Submissions)
export async function submitStudentProduct(submissionData) {
  const { data, error } = await supabase
    .from('student_submissions')
    .insert([submissionData])
    .select();
  return { data, error };
}

export async function getStudentSubmissions() {
  try {
    const { data, error } = await supabase
      .from('student_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn sản phẩm HS thất bại:', err.message);
    return [];
  }
}

// 8. Kho VIP & Kích Hoạt Mã VIP (VIP Keys)
export async function activateVipCode(code, userEmail) {
  try {
    // Kiểm tra mã VIP
    const { data: keyRecord, error: checkErr } = await supabase
      .from('vip_keys')
      .select('*')
      .eq('key_code', code.trim())
      .eq('is_used', false)
      .single();

    if (checkErr || !keyRecord) {
      return { success: false, message: 'Mã VIP không hợp lệ hoặc đã được sử dụng!' };
    }

    // Đánh dấu mã đã dùng
    await supabase
      .from('vip_keys')
      .update({ is_used: true, used_by_email: userEmail })
      .eq('id', keyRecord.id);

    return { success: true, message: 'Kích hoạt Mã VIP thành công! Bạn đã mở khóa Kho VIP và AI Cao Cấp.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 9. Quản Lý Lớp Học & Học Sinh (Classroom Management)
export async function getClassesWithStudents() {
  try {
    const { data: classes, error: classErr } = await supabase.from('classes').select('*');
    if (classErr) throw classErr;

    const { data: students, error: studentErr } = await supabase.from('students').select('*');
    if (studentErr) throw studentErr;

    return { classes: classes || [], students: students || [] };
  } catch (err) {
    console.warn('Truy vấn Lớp học thất bại:', err.message);
    return { classes: [], students: [] };
  }
}

export async function addStudent(studentData) {
  const { data, error } = await supabase.from('students').insert([studentData]).select();
  return { data, error };
}

export async function deleteStudent(studentId) {
  const { error } = await supabase.from('students').delete().eq('id', studentId);
  return { error };
}

// 10. Thông báo hệ thống (Notifications)
export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Truy vấn Thông báo thất bại:', err.message);
    return [];
  }
}
