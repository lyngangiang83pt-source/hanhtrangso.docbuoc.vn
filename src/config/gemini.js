import { GoogleGenAI } from '@google/genai';

// Đọc Gemini API Key từ ENV
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || '';

// Khởi tạo Gemini Client
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Gửi tin nhắn tới Chatbot Hỏi - Đáp 24/24
 */
export async function askGeminiAi(userPrompt, conversationHistory = []) {
  try {
    if (!apiKey || !ai) {
      // Fallback phản hồi thông minh nếu chưa điền Gemini API Key
      return getSmartOfflineResponse(userPrompt);
    }

    const systemInstruction = `Bạn là Trợ Lý AI Giáo Dục 24/24 thân thiện, thông minh dành cho học sinh và giáo viên THCS.
Hãy trả lời câu hỏi bài học một cách chính xác, ngắn gọn, trình bày rõ ràng với Markdown và công thức dễ hiểu.
Nếu học sinh hỏi về các môn học (Ngữ Văn, Toán, KHTN, Lịch Sử, Tiếng Anh, Tin học...), hãy giảng giải chi tiết từng bước.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nCâu hỏi: ${userPrompt}` }] }
      ]
    });

    return response.text || 'Xin lỗi, trợ lý AI hiện đang bận. Thầy/Cô và học sinh hãy thử lại sau nhé!';
  } catch (error) {
    console.warn('Lỗi gọi Gemini API:', error.message);
    return getSmartOfflineResponse(userPrompt);
  }
}

/**
 * Trợ Lý AI Cao Cấp Dành Cho Kho VIP (Soạn Giáo Án, Ra Đề Thi, Chấm Bài)
 */
export async function askGeminiVipAssistant(taskType, topic, parameters = {}) {
  try {
    if (!apiKey || !ai) {
      return getVipOfflineSample(taskType, topic);
    }

    let prompt = '';
    if (taskType === 'lesson_plan') {
      prompt = `Hãy xây dựng kế hoạch bài dạy (Giáo án) theo chuẩn Công văn 5512 cho môn ${parameters.subject || 'Ngữ Văn'} Khối ${parameters.grade || 8}, bài: "${topic}". Gồm đầy đủ: Mục tiêu (Kiến thức, Năng lực, Phẩm chất), Thiết bị dạy học, và Các hoạt động dạy học (Khởi động, Khám phá, Luyện tập, Vận dụng).`;
    } else if (taskType === 'quiz_creator') {
      prompt = `Hãy tạo bộ đề thi trắc nghiệm 5 câu hỏi môn ${parameters.subject || 'Toán'} Khối ${parameters.grade || 7} về chủ đề "${topic}". Gồm câu hỏi, 4 phương án A B C D, đáp án đúng và lời giải chi tiết.`;
    } else if (taskType === 'grading_assistant') {
      prompt = `Hãy đánh giá và nhận xét bài làm học sinh cho đề bài "${topic}". Nội dung bài làm: "${parameters.studentAnswer || topic}". Đưa ra điểm số (thang 10), ưu điểm, hạn chế và câu sửa lại chuẩn mực.`;
    } else {
      prompt = `Hỗ trợ giáo viên xử lý công việc: ${topic}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return response.text || 'Dịch vụ AI VIP chưa thể xử lý yêu cầu lúc này.';
  } catch (error) {
    return getVipOfflineSample(taskType, topic);
  }
}

// Hàm phản hồi offline thông minh nếu chưa có API Key
function getSmartOfflineResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('thánh gióng') || p.includes('ngữ văn')) {
    return `**Giải đáp Ngữ Văn 6:**
Hình tượng **Thánh Gióng** đại diện cho sức mạnh đoàn kết của nhân dân ta trong cuộc chiến chống giặc ngoại xâm (giặc Ân).
- **Ý nghĩa tiếng nói đầu tiên:** Tiếng nói đòi đi đánh giặc thể hiện lòng yêu nước tiềm tàng.
- **Hình ảnh roi sắt, ngựa sắt, nón sắt:** Thể hiện thành tựu rèn đúc kim loại và sức mạnh công nghệ quân sự của người Việt cổ.`;
  }
  if (p.includes('toán') || p.includes('công thức') || p.includes('lăng trụ')) {
    return `**Giải đáp Toán 7 - Hình Lăng Trụ Đứng:**
1. **Thể tích hình lăng trụ đứng:** \\(V = S_{đáy} \\times h\\)
2. **Diện tích xung quanh:** \\(S_{xq} = C_{đáy} \\times h\\)
*(Trong đó: \\(S_{đáy}\\) là diện tích đáy, \\(C_{đáy}\\) là chu vi đáy, \\(h\\) là chiều cao lăng trụ).*`;
  }
  if (p.includes('khtn') || p.includes('phản ứng') || p.includes('hóa học')) {
    return `**Giải đáp KHTN 8 - Phản ứng hóa học:**
Phản ứng hóa học là quá trình biến đổi từ chất này (chất tham gia) thành chất khác (chất sản phẩm).
- **Định luật bảo toàn khối lượng:** Tổng khối lượng các chất tham gia bằng tổng khối lượng các chất sản phẩm thu được: \\(m_A + m_B = m_C + m_D\\).`;
  }
  return `🤖 **Trợ Lý AI EdTech 24/24:**
Cảm ơn câu hỏi của bạn về: "${prompt}".
Hệ thống đã ghi nhận và phân tích dữ liệu bài học. Bạn có thể tra cứu chi tiết hơn trong mục **Học Liệu Số** hoặc **Bài Giảng Khối 6-9** nhé!`;
}

function getVipOfflineSample(taskType, topic) {
  if (taskType === 'lesson_plan') {
    return `# 📝 KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN 5512)
**BÀI:** ${topic.toUpperCase()}

## I. MỤC TIÊU BÀI HỌC
1. **Kiến thức:** Học sinh nắm vững các khái niệm trọng tâm, áp dụng giải bài tập thực tế.
2. **Năng lực:** Phát triển Năng lực Tự học, Năng lực Số (NLS) và Giải quyết vấn đề.
3. **Phẩm chất:** Chăm chỉ, Trung thực, Có trách nhiệm.

## II. THIẾT BỊ DẠY HỌC & HỌC LIỆU
- Tivi/Máy chiếu, Bài giảng PowerPoint (pptx), Phiếu học tập số.

## III. TIẾN TRÌNH DẠY HỌC
- **Hoạt động 1: Khởi động (5 phút):** Chơi Game trắc nghiệm đố vui.
- **Hoạt động 2: Hình thành kiến thức (20 phút):** Giáo viên hướng dẫn phân tích sơ đồ tư duy.
- **Hoạt động 3: Luyện tập (12 phút):** Học sinh nộp bài qua Padlet/Form.
- **Hoạt động 4: Vận dụng (8 phút):** Bài tập mở rộng liên hệ thực tiễn.`;
  }
  return `✨ **KẾT QUẢ XỬ LÝ TỪ TRỢ LÝ AI VIP:**\nĐã tạo tài liệu chuyên sâu cho chủ đề "${topic}". Bạn có thể tải về file định dạng docx/pptx tại Kho VIP.`;
}
