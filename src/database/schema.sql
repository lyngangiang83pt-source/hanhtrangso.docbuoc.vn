-- ====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU EDUTEACHER WEBSITE GIÁO DỤC (SUPABASE POSTGRESQL)
-- Phiên bản Safe SQL (Có DROP POLICY IF EXISTS) - Chạy an toàn 100% trên Supabase SQL Editor
-- ====================================================================

-- 1. Bật Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BẢNG PROFILES (Thông tin Người dùng & Phân quyền RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Thành viên EdTech',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    vip_code_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG SUBJECTS (Quản lý Môn học)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- Mã môn (VD: VAN, TOAN, KHTN)
    name TEXT NOT NULL, -- Tên môn (VD: Ngữ Văn, Toán Học)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG CLASSES (Quản lý Lớp học)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    school_year TEXT DEFAULT '2025-2026',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG STUDENTS (Danh sách Học sinh)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    date_of_birth DATE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    parent_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG NEWS_FEED (Bảng tin)
CREATE TABLE IF NOT EXISTS public.news_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('school_news', 'documents', 'announcements', 'career_guidance')),
    summary TEXT,
    content TEXT NOT NULL,
    author_name TEXT DEFAULT 'Ban Giám Hiệu',
    is_pinned BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG GAMES (Kho Game Học Tập)
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT DEFAULT 'Tổng hợp',
    game_type TEXT NOT NULL CHECK (game_type IN ('quiz', 'flashcard', 'word_matching', 'crossword')),
    game_data JSONB NOT NULL,
    play_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BẢNG DIGITAL_RESOURCES (Học Liệu Số)
CREATE TABLE IF NOT EXISTS public.digital_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('educational_films', 'knowledge_handbook', 'podcasts')),
    description TEXT,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    author TEXT DEFAULT 'Tổ Chuyên Môn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG LECTURES (Bài Giảng Theo Khối 6, 7, 8, 9)
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    subject TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('docx', 'pptx', 'elearning')),
    file_url TEXT NOT NULL,
    has_nls BOOLEAN DEFAULT TRUE,
    has_ai_support BOOLEAN DEFAULT TRUE,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BẢNG ASSIGNMENTS (Bài Tập Theo Khối 6, 7, 8, 9)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    type TEXT NOT NULL CHECK (type IN ('worksheet', 'homework')),
    file_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BẢNG STUDENT_SUBMISSIONS (Sản Phẩm Học Sinh & Bài Nộp)
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    assignment_title TEXT NOT NULL,
    submission_method TEXT NOT NULL CHECK (submission_method IN ('padlet', 'drive', 'zalo', 'direct_upload')),
    submission_url TEXT,
    file_path TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    score NUMERIC(4, 2),
    teacher_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. BẢNG NOTIFICATIONS (Thông Báo Hệ Thống)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_role TEXT DEFAULT 'all',
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. BẢNG VIP_KEYS (Mã Kích Hoạt Kho VIP)
CREATE TABLE IF NOT EXISTS public.vip_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_used BOOLEAN DEFAULT FALSE,
    used_by_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Subjects" ON public.subjects;
DROP POLICY IF EXISTS "All Access Subjects" ON public.subjects;
CREATE POLICY "Public Read Subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "All Access Subjects" ON public.subjects FOR ALL USING (true);

-- DỮ LIỆU THỰC TẾ KHỞI TẠO MÔN HỌC
INSERT INTO public.subjects (code, name, description) VALUES
('VAN', 'Ngữ Văn', 'Môn Ngữ Văn THCS - Đọc hiểu văn bản và Làm văn nghị luận'),
('TOAN', 'Toán Học', 'Môn Toán THCS - Đại số, Hình học trực quan và Thống kê'),
('KHTN', 'Khoa Học Tự Nhiên', 'Môn KHTN - Tích hợp Vật Lý, Hóa Học và Sinh Học'),
('LS_GD', 'Lịch Sử & Địa Lý', 'Môn Lịch Sử & Địa Lý THCS - Tri thức lịch sử dân tộc và địa lý Việt Nam'),
('TIN', 'Tin Học', 'Môn Tin Học - Năng lực số (NLS) và lập trình tư duy'),
('ENG', 'Tiếng Anh', 'Môn Tiếng Anh - Kỹ năng giao tiếp và ngữ pháp')
ON CONFLICT (code) DO NOTHING;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_keys ENABLE ROW LEVEL SECURITY;

-- Xóa Policy cũ nếu đã tồn tại trước khi tạo mới để tránh lỗi 42710
DROP POLICY IF EXISTS "Public Read News" ON public.news_feed;
DROP POLICY IF EXISTS "Public Read Games" ON public.games;
DROP POLICY IF EXISTS "Public Read Resources" ON public.digital_resources;
DROP POLICY IF EXISTS "Public Read Lectures" ON public.lectures;
DROP POLICY IF EXISTS "Public Read Assignments" ON public.assignments;
DROP POLICY IF EXISTS "Public Read Notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public Insert Submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Public Read Submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Public Read Classes" ON public.classes;
DROP POLICY IF EXISTS "Public Read Students" ON public.students;
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "All Access Profiles" ON public.profiles;
DROP POLICY IF EXISTS "All Access News" ON public.news_feed;
DROP POLICY IF EXISTS "All Access Lectures" ON public.lectures;
DROP POLICY IF EXISTS "All Access Assignments" ON public.assignments;
DROP POLICY IF EXISTS "All Access Students" ON public.students;
DROP POLICY IF EXISTS "All Access Classes" ON public.classes;
DROP POLICY IF EXISTS "All Access Vip" ON public.vip_keys;

-- Tạo mới các Policies
CREATE POLICY "Public Read News" ON public.news_feed FOR SELECT USING (true);
CREATE POLICY "Public Read Games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public Read Resources" ON public.digital_resources FOR SELECT USING (true);
CREATE POLICY "Public Read Lectures" ON public.lectures FOR SELECT USING (true);
CREATE POLICY "Public Read Assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Insert Submissions" ON public.student_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Submissions" ON public.student_submissions FOR SELECT USING (true);
CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

CREATE POLICY "All Access News" ON public.news_feed FOR ALL USING (true);
CREATE POLICY "All Access Lectures" ON public.lectures FOR ALL USING (true);
CREATE POLICY "All Access Assignments" ON public.assignments FOR ALL USING (true);
CREATE POLICY "All Access Students" ON public.students FOR ALL USING (true);
CREATE POLICY "All Access Classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "All Access Vip" ON public.vip_keys FOR ALL USING (true);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name_val TEXT;
BEGIN
    user_name_val := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));

    INSERT INTO public.profiles (id, username, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        user_name_val,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', user_name_val),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- DỮ LIỆU THỰC TẾ KHỞI TẠO (MÔN HỌC KHỐI 6-9, BẢNG TIN, MÃ VIP)
-- ====================================================================
INSERT INTO public.vip_keys (key_code, description) VALUES
('VIP2026', 'Mã VIP Đặc Quyền - Mở khóa toàn bộ Kho VIP & Trợ lý AI'),
('EDUTEACHER2026', 'Mã Kích Hoạt Dành Cho Giáo Viên Ưu Tú'),
('LIGHT2026', 'Mã VIP Học Sinh Giỏi')
ON CONFLICT (key_code) DO NOTHING;

INSERT INTO public.news_feed (title, category, summary, content, author_name, is_pinned) VALUES
('Thông báo Lịch nghỉ Tết Nguyên Đán & Kế hoạch ôn tập trực tuyến', 'announcements', 'Thông báo thời gian nghỉ Tết và hướng dẫn học sinh ôn tập tại nhà.', 'Kính gửi toàn thể Giáo viên, Học sinh và Phụ huynh!\nNhà trường xin thông báo lịch nghỉ Tết Nguyên Đán năm 2026 bắt đầu từ ngày 15/02 đến hết ngày 25/02.', 'Ban Giám Hiệu', true),
('Hướng nghiệp 2026: Định hướng phát triển năng lực số và Trí tuệ nhân tạo (AI)', 'career_guidance', 'Tổng quan xu hướng nghề nghiệp công nghệ và AI dành cho học sinh THCS.', 'Trong kỷ nguyên số, việc trang bị kiến thức Tin học, Năng lực số (NLS) và khả năng ứng dụng AI là chìa khóa mở ra tương lai sáng cho học sinh THCS.', 'Tổ Chuyên Môn Tin Học', false)
ON CONFLICT DO NOTHING;

INSERT INTO public.lectures (title, grade, subject, file_type, file_url, has_nls, has_ai_support) VALUES
('Bài giảng Ngữ Văn 6: Thánh Gióng & Tích hợp Năng lực số (NLS)', 6, 'Ngữ Văn', 'pptx', 'https://docs.google.com/presentation/d/1sample_van6/export/pptx', true, true),
('Giáo án Toán 7: Hình học Trực quan - Hình Lăng Trụ Đứng', 7, 'Toán Học', 'docx', 'https://docs.google.com/document/d/1sample_toan7/export/docx', true, true),
('Bài giảng KHTN 8: Phản ứng Hóa học & Năng lượng Hóa học', 8, 'Khoa Học Tự Nhiên', 'pptx', 'https://docs.google.com/presentation/d/1sample_khtn8/export/pptx', true, true),
('Elearning Lịch Sử 9: Việt Nam Trong Những Năm 1939 - 1945', 9, 'Lịch Sử', 'elearning', 'https://elearning.edu.vn/courses/history9_lesson1', true, true)
ON CONFLICT DO NOTHING;
