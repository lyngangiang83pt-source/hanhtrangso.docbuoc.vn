-- ====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU EDUTEACHER WEBSITE GIÁO DỤC (SUPABASE POSTGRESQL)
-- Thầy/Cô hãy copy toàn bộ mã SQL này và dán vào Supabase SQL Editor -> Run!
-- ====================================================================

-- 1. Bật Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Xóa các bảng cũ nếu đã tồn tại (Clean State)
DROP TABLE IF EXISTS public.vip_keys CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.student_submissions CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.lectures CASCADE;
DROP TABLE IF EXISTS public.digital_resources CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.news_feed CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. BẢNG PROFILES (Thông tin Người dùng & Phân quyền RBAC)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Thành viên EdTech',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    vip_code_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG CLASSES (Quản lý Lớp học)
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ví dụ: 6A1, 7A2, 8A3, 9A1
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    school_year TEXT DEFAULT '2025-2026',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG STUDENTS (Danh sách Học sinh)
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code TEXT UNIQUE NOT NULL, -- Mã học sinh (VD: HS6001)
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    date_of_birth DATE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    parent_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG NEWS_FEED (Bảng tin)
CREATE TABLE public.news_feed (
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

-- 7. BẢNG GAMES (Kho Game Học Tập)
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT DEFAULT 'Ngữ Văn / Lịch Sử / Khoa Học',
    game_type TEXT NOT NULL CHECK (game_type IN ('quiz', 'flashcard', 'word_matching', 'crossword')),
    game_data JSONB NOT NULL, -- Chứa câu hỏi, đáp án hoặc danh sách từ vựng
    play_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG DIGITAL_RESOURCES (Học Liệu Số)
CREATE TABLE public.digital_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('educational_films', 'knowledge_handbook', 'podcasts')),
    description TEXT,
    media_url TEXT NOT NULL, -- Video Youtube/Drive hoặc Audio Link
    thumbnail_url TEXT,
    duration TEXT,
    author TEXT DEFAULT 'Tổ Chuyên Môn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BẢNG LECTURES (Bài Giảng Theo Khối 6, 7, 8, 9)
CREATE TABLE public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    subject TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('docx', 'pptx', 'elearning')),
    file_url TEXT NOT NULL,
    has_nls BOOLEAN DEFAULT TRUE, -- Tích hợp Năng lực số (NLS)
    has_ai_support BOOLEAN DEFAULT TRUE, -- Tích hợp Trợ lý AI
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BẢNG ASSIGNMENTS (Bài Tập Theo Khối 6, 7, 8, 9)
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade IN (6, 7, 8, 9)),
    type TEXT NOT NULL CHECK (type IN ('worksheet', 'homework')), -- Phiếu học tập / Bài tập về nhà
    file_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. BẢNG STUDENT_SUBMISSIONS (Sản Phẩm Học Sinh & Bài Nộp)
CREATE TABLE public.student_submissions (
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

-- 12. BẢNG NOTIFICATIONS (Thông Báo Hệ Thống)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_role TEXT DEFAULT 'all', -- 'all', 'teacher', 'student'
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. BẢNG VIP_KEYS (Mã Kích Hoạt Kho VIP)
CREATE TABLE public.vip_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_used BOOLEAN DEFAULT FALSE,
    used_by_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- RLS POLICIES (ROW LEVEL SECURITY - PHÂN QUYỀN BẢO MẬT DỮ LIỆU)
-- ====================================================================
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

-- Cho phép mọi người đọc thông tin công khai (Public Read)
CREATE POLICY "Cho phép đọc dữ liệu công khai trên tin tức" ON public.news_feed FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc dữ liệu game" ON public.games FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc học liệu số" ON public.digital_resources FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc bài giảng" ON public.lectures FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc bài tập" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc thông báo" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc sản phẩm HS công khai" ON public.student_submissions FOR SELECT USING (true);
CREATE POLICY "Cho phép mọi người đọc danh sách lớp" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc học sinh" ON public.students FOR SELECT USING (true);
CREATE POLICY "Cho phép xem profile cá nhân" ON public.profiles FOR SELECT USING (true);

-- Quyền ghi cho người dùng công khai / học sinh nộp bài
CREATE POLICY "Học sinh được tạo bài nộp" ON public.student_submissions FOR INSERT WITH CHECK (true);

-- Quyền ghi toàn bộ cho Admin/Giáo viên (Bypass policy cho Insert/Update/Delete)
CREATE POLICY "Quyền ghi cho profile" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Quyền sửa xóa tin tức cho Admin/GV" ON public.news_feed FOR ALL USING (true);
CREATE POLICY "Quyền sửa xóa bài giảng" ON public.lectures FOR ALL USING (true);
CREATE POLICY "Quyền sửa xóa bài tập" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Quyền quản lý học sinh" ON public.students FOR ALL USING (true);
CREATE POLICY "Quyền quản lý lớp" ON public.classes FOR ALL USING (true);
CREATE POLICY "Quyền kiểm tra mã VIP" ON public.vip_keys FOR ALL USING (true);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (TỰ ĐỘNG TẠO HỒ SƠ KHI ĐĂNG NHẬP)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Thành viên EdTech'),
        'student',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- DỮ LIỆU THỰC TẾ KHỞI TẠO (REAL INITIAL DATA)
-- ====================================================================

-- 1. Mã VIP Khởi tạo
INSERT INTO public.vip_keys (key_code, description) VALUES
('VIP2026', 'Mã VIP Đặc Quyền - Mở khóa toàn bộ Kho VIP & Trợ lý AI'),
('EDUTEACHER2026', 'Mã Kích Hoạt Dành Cho Giáo Viên Ưu Tú'),
('LIGHT2026', 'Mã VIP Học Sinh Giỏi');

-- 2. Bảng Tin Mẫu Thực Tế
INSERT INTO public.news_feed (title, category, summary, content, author_name, is_pinned) VALUES
('Thông báo Lịch nghỉ Tết Nguyên Đán & Kế hoạch ôn tập trực tuyến', 'announcements', 'Thông báo chính thức về thời gian nghỉ Tết và hướng dẫn học sinh ôn tập tại nhà qua hệ thống EdTech.', 'Kính gửi toàn thể Giáo viên, Học sinh và Phụ huynh!\nNhà trường xin thông báo lịch nghỉ Tết Nguyên Đán năm 2026 bắt đầu từ ngày 15/02 đến hết ngày 25/02. Trong thời gian này, học sinh có thể hoàn thành các bài tập ôn tập tại mục Bài Tập Khối 6-9 trên website.', 'Ban Giám Hiệu', true),
('Hướng nghiệp 2026: Định hướng phát triển năng lực số và Trí tuệ nhân tạo (AI)', 'career_guidance', 'Tổng quan xu hướng nghề nghiệp công nghệ, AI và kỹ năng số dành cho học sinh THCS.', 'Trong kỷ nguyên số, việc trang bị kiến thức Tin học, Năng lực số (NLS) và khả năng ứng dụng AI là chìa khóa mở ra tương lai sáng cho học sinh THCS. Bài viết chia sẻ các lộ trình phát triển kỹ năng quan trọng cho học sinh khối 8, 9.', 'Tổ Chuyên Môn Tin Học', false),
('Văn bản hướng dẫn thực hiện Chương trình GDPT 2018 môn Ngữ Văn và KHTN', 'documents', 'Bộ văn bản chỉ đạo mới nhất từ Bộ Giáo dục & Đào tạo về đổi mới phương pháp dạy học.', 'Chi tiết văn bản hướng dẫn xây dựng ma trận đề kiểm tra, đánh giá định kỳ theo định hướng phát triển phẩm chất, năng lực học sinh môn Ngữ Văn, Toán, KHTN và Lịch sử - Địa lý.', 'Phòng Giáo Dục', false),
('Chào mừng Ngày Hội Sáng Tạo Kỹ Thuật Số & Triển Lãm Sản Phẩm Học Sinh', 'school_news', 'Sự kiện thường niên tôn vinh các dự án, mô hình và sản phẩm sáng tạo số của học sinh.', 'Ngày hội sáng tạo quy tụ hơn 50 sản phẩm học sinh nộp qua Padlet và Drive. Kính mời quý thầy cô và học sinh tham quan gian hàng trực tuyến tại mục Sản Phẩm HS.', 'Đoàn Thanh Niên', false);

-- 3. Bài Giảng Mẫu Thực Tế (Khối 6, 7, 8, 9)
INSERT INTO public.lectures (title, grade, subject, file_type, file_url, has_nls, has_ai_support) VALUES
('Bài giảng Ngữ Văn 6: Thánh Gióng & Tích hợp Năng lực số (NLS)', 6, 'Ngữ Văn', 'pptx', 'https://docs.google.com/presentation/d/1sample_van6/export/pptx', true, true),
('Giáo án Toán 7: Hình học Trực quan - Hình Lăng Trụ Đứng', 7, 'Toán Học', 'docx', 'https://docs.google.com/document/d/1sample_toan7/export/docx', true, true),
('Bài giảng KHTN 8: Phản ứng Hóa học & Năng lượng Hóa học', 8, 'Khoa Học Tự Nhiên', 'pptx', 'https://docs.google.com/presentation/d/1sample_khtn8/export/pptx', true, true),
('Elearning Lịch Sử 9: Việt Nam Trong Những Năm 1939 - 1945', 9, 'Lịch Sử', 'elearning', 'https://elearning.edu.vn/courses/history9_lesson1', true, true);

-- 4. Bài Tập Mẫu Thực Tế (Khối 6, 7, 8, 9)
INSERT INTO public.assignments (title, grade, type, description, file_url) VALUES
('Phiếu Học Tập số 1: Trải nghiệm Văn bản Thánh Gióng - Khối 6', 6, 'worksheet', 'Học sinh điền sơ đồ tư duy nhân vật Thánh Gióng và trả lời các câu hỏi phát triển năng lực.', 'https://drive.google.com/file/d/sample_worksheet_6/view'),
('Bài Tập Về Nhà Toán 7: Bài tập thực hành Biểu đồ cột kép', 7, 'homework', 'Hoàn thành 5 bài tập phân tích biểu đồ và nộp bài trước 22h ngày Chủ Nhật.', 'https://drive.google.com/file/d/sample_homework_7/view'),
('Phiếu Học Tập KHTN 8: Thí nghiệm định luật Bảo toàn khối lượng', 8, 'worksheet', 'Phiếu ghi chép hiện tượng thí nghiệm và tính toán khối lượng chất sản phẩm.', 'https://drive.google.com/file/d/sample_worksheet_8/view'),
('Bài Tập Ngữ Văn 9: Viết bài văn nghị luận về một vấn đề đời sống', 9, 'homework', 'Học sinh viết bài văn từ 500 - 700 chữ và nộp sản phẩm trực tiếp hoặc qua Drive/Padlet.', 'https://drive.google.com/file/d/sample_homework_9/view');

-- 5. Học Liệu Số Mẫu Thực Tế
INSERT INTO public.digital_resources (title, resource_type, description, media_url, thumbnail_url, duration, author) VALUES
('Phim Giáo Dục: Hành trình khám phá Vũ trụ & Hệ Mặt Trời', 'educational_films', 'Thước phim khoa học 3D sinh động giúp học sinh hiểu về chuyển động của Trái Đất và các hành tinh.', 'https://www.youtube.com/watch?v=libKVRa074s', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', '12 phút', 'Tổ KHTN'),
('Sổ Tay Tri Thức: 100+ Công thức Toán THCS & Mẹo Giải Nhanh', 'knowledge_handbook', 'Cẩm nang tra cứu công thức Đại số, Hình học và sơ đồ tư duy dễ nhớ.', 'https://drive.google.com/file/d/sample_handbook/view', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', '50 trang', 'Tổ Toán'),
('Podcast Ngắn #1: Bí quyết Quản lý Thời gian & Ôn thi Hiệu quả', 'podcasts', 'Podcast tâm sự học đường chia sẻ 5 phương pháp học thông minh dành cho học sinh khối 8, 9.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800', '08 phút', 'Cô Trà My');

-- 6. Kho Game Học Tập Mẫu
INSERT INTO public.games (title, description, subject, game_type, game_data) VALUES
('Đấu Trí Tri Thức - Thử Thách Trắc Nghiệm KHTN & Lịch Sử', 'Thử thách 5 câu hỏi kiến thức tổng hợp với thời gian đếm ngược!', 'Tổng hợp', 'quiz', '{
    "questions": [
        {
            "question": "Thành phần nào của tế bào được coi là trung tâm điều khiển mọi hoạt động sống?",
            "options": ["Màng tế bào", "Nhân tế bào", "Tế bào chất", "Không bào"],
            "answer": 1,
            "explanation": "Nhân tế bào chứa vật chất di truyền (DNA) điều khiển mọi hoạt động sống."
        },
        {
            "question": "Chiến thắng Điện Biên Phủ lừng lẫy năm châu diễn ra vào năm nào?",
            "options": ["1945", "1954", "1968", "1975"],
            "answer": 1,
            "explanation": "Chiến thắng Điện Biên Phủ lịch sử diễn ra vào ngày 07/05/1954."
        },
        {
            "question": "Văn bản Thánh Gióng thuộc thể loại dân gian nào?",
            "options": ["Thần thoại", "Truyền thuyết", "Cổ tích", "Truyện ngụ ngôn"],
            "answer": 1,
            "explanation": "Thánh Gióng là truyện truyền thuyết ca ngợi hình tượng người anh hùng chống giặc ngoại xâm."
        }
    ]
}'::jsonb),
('Thẻ Bài Từ Vựng KHTN Khối 6-8', 'Lật thẻ học khái niệm khoa học siêu nhớ lâu!', 'Khoa Học Tự Nhiên', 'flashcard', '{
    "cards": [
        {"front": "Quang hợp", "back": "Quá trình thực vật sử dụng ánh sáng mặt trời biến CO2 và H2O thành Glucose và O2."},
        {"front": "Đơn bào", "back": "Cơ thể chỉ được cấu tạo từ một tế bào duy nhất (ví dụ: Trùng roi, Vi khuẩn)."},
        {"front": "Phản ứng hóa học", "back": "Quá trình biến đổi từ chất này thành chất khác."}
    ]
}'::jsonb);

-- 7. Danh Sách Lớp & Học Sinh Mẫu
INSERT INTO public.classes (name, grade, school_year) VALUES
('Lớp 6A1', 6, '2025-2026'),
('Lớp 7A2', 7, '2025-2026'),
('Lớp 8A1', 8, '2025-2026'),
('Lớp 9A3', 9, '2025-2026');

INSERT INTO public.students (student_code, full_name, gender, class_id) VALUES
('HS6001', 'Nguyễn Văn An', 'Nam', (SELECT id FROM public.classes WHERE name = 'Lớp 6A1' LIMIT 1)),
('HS6002', 'Trần Thị Bình', 'Nữ', (SELECT id FROM public.classes WHERE name = 'Lớp 6A1' LIMIT 1)),
('HS7001', 'Lê Hoàng Nam', 'Nam', (SELECT id FROM public.classes WHERE name = 'Lớp 7A2' LIMIT 1)),
('HS8001', 'Phạm Minh Anh', 'Nữ', (SELECT id FROM public.classes WHERE name = 'Lớp 8A1' LIMIT 1)),
('HS9001', 'Vũ Quốc Bảo', 'Nam', (SELECT id FROM public.classes WHERE name = 'Lớp 9A3' LIMIT 1));

-- 8. Thông Báo Hệ Thống Mẫu
INSERT INTO public.notifications (title, content, is_urgent) VALUES
('🎉 Ra mắt Hệ thống EdTech Giáo Dục 2026!', 'Chào mừng quý thầy cô và các em học sinh đến với nền tảng học tập số tích hợp AI và phân quyền toàn diện.', true),
('🤖 Đã kết nối thành công Trợ lý Hỏi-Đáp AI 24/24', 'Học sinh có thể đặt câu hỏi bài tập tại mục Hỏi - Đáp để nhận phản hồi thông minh lập tức.', false);
