import json
import os

# Tạo dữ liệu training cho Vibely
training_data = []

# Thêm các câu hỏi và câu trả lời về Vibely
training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Vibely là gì?"},
        {"role": "assistant", "content": "Vibely là một nền tảng mạng xã hội học tập được thiết kế để kết nối học sinh, sinh viên và giáo viên. Nền tảng này giúp người dùng chia sẻ tài liệu học tập, tham gia thảo luận, tạo lịch học và quản lý thời gian học tập hiệu quả."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để đăng ký tài khoản trên Vibely?"},
        {"role": "assistant", "content": "Để đăng ký tài khoản trên Vibely, bạn cần truy cập trang chủ và nhấp vào nút 'Đăng ký'. Sau đó, điền thông tin cá nhân như email, mật khẩu, tên người dùng và chọn vai trò (học sinh, sinh viên hoặc giáo viên). Cuối cùng, xác nhận email của bạn để hoàn tất quá trình đăng ký."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Vibely có những tính năng chính nào?"},
        {"role": "assistant", "content": "Vibely có nhiều tính năng hữu ích cho việc học tập, bao gồm:\n1. Chia sẻ và quản lý tài liệu học tập\n2. Tạo và tham gia các nhóm học tập\n3. Lập lịch học và nhắc nhở deadline\n4. Chat và thảo luận với bạn học\n5. Tìm kiếm tài liệu và bài giảng\n6. Theo dõi tiến độ học tập\n7. Tạo ghi chú và tóm tắt bài học\n8. Kết nối với giáo viên và bạn học"}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tạo một nhóm học tập trên Vibely?"},
        {"role": "assistant", "content": "Để tạo một nhóm học tập trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào nút 'Tạo nhóm' trên trang chủ\n3. Đặt tên cho nhóm và chọn môn học liên quan\n4. Thêm mô tả về mục đích của nhóm\n5. Chọn quyền riêng tư (công khai hoặc riêng tư)\n6. Mời bạn học tham gia bằng cách gửi lời mời\n7. Nhấp vào 'Tạo' để hoàn tất"}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để chia sẻ tài liệu học tập trên Vibely?"},
        {"role": "assistant", "content": "Để chia sẻ tài liệu học tập trên Vibely, bạn có thể:\n1. Nhấp vào nút 'Tải lên' trên trang chủ hoặc trong nhóm học tập\n2. Chọn file tài liệu từ thiết bị của bạn\n3. Thêm tiêu đề và mô tả cho tài liệu\n4. Chọn môn học liên quan\n5. Chọn quyền riêng tư (công khai, nhóm hoặc riêng tư)\n6. Nhấp vào 'Chia sẻ' để hoàn tất\nTài liệu của bạn sẽ hiển thị trong thư viện tài liệu và có thể được tìm kiếm bởi người dùng khác."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tạo lịch học trên Vibely?"},
        {"role": "assistant", "content": "Để tạo lịch học trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào tab 'Lịch học' trên thanh điều hướng\n3. Nhấp vào nút 'Thêm sự kiện'\n4. Điền thông tin về sự kiện (tên, ngày, giờ, môn học, địa điểm)\n5. Thêm nhắc nhở (nếu cần)\n6. Chọn màu sắc để phân biệt các môn học\n7. Nhấp vào 'Lưu' để hoàn tất\nBạn cũng có thể đồng bộ lịch học với Google Calendar hoặc Apple Calendar."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Vibely có tính năng chat không?"},
        {"role": "assistant", "content": "Có, Vibely có tính năng chat cho phép người dùng giao tiếp với nhau. Bạn có thể:\n1. Chat trực tiếp với bạn học\n2. Tạo nhóm chat cho nhóm học tập\n3. Gửi tin nhắn, hình ảnh và tài liệu\n4. Tạo cuộc gọi video để học nhóm trực tuyến\n5. Chia sẻ màn hình để giải thích bài tập\nTính năng chat được tích hợp sẵn trong ứng dụng, giúp việc học tập trở nên thuận tiện hơn."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tìm kiếm tài liệu học tập trên Vibely?"},
        {"role": "assistant", "content": "Để tìm kiếm tài liệu học tập trên Vibely, bạn có thể:\n1. Sử dụng thanh tìm kiếm ở đầu trang\n2. Nhập từ khóa liên quan đến môn học hoặc chủ đề bạn cần\n3. Lọc kết quả theo môn học, loại tài liệu hoặc ngày đăng\n4. Nhấp vào tài liệu bạn muốn xem\n5. Tải xuống hoặc lưu tài liệu vào thư viện cá nhân\nBạn cũng có thể khám phá tài liệu theo môn học bằng cách nhấp vào tab 'Thư viện' và chọn môn học bạn quan tâm."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Vibely có tính năng theo dõi tiến độ học tập không?"},
        {"role": "assistant", "content": "Có, Vibely có tính năng theo dõi tiến độ học tập giúp bạn theo dõi quá trình học tập của mình. Bạn có thể:\n1. Xem thống kê thời gian học tập\n2. Theo dõi số lượng tài liệu đã đọc\n3. Kiểm tra tiến độ hoàn thành bài tập\n4. Xem báo cáo hiệu suất học tập\n5. Đặt mục tiêu học tập và theo dõi việc đạt được mục tiêu\nTính năng này giúp bạn có cái nhìn tổng quan về quá trình học tập và điều chỉnh phương pháp học cho phù hợp."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tạo ghi chú trên Vibely?"},
        {"role": "assistant", "content": "Để tạo ghi chú trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào tab 'Ghi chú' trên thanh điều hướng\n3. Nhấp vào nút 'Tạo ghi chú mới'\n4. Đặt tiêu đề cho ghi chú\n5. Viết nội dung ghi chú\n6. Thêm hình ảnh hoặc tệp đính kèm (nếu cần)\n7. Chọn môn học liên quan\n8. Nhấp vào 'Lưu' để hoàn tất\nBạn có thể chỉnh sửa, xóa hoặc chia sẻ ghi chú với bạn học."}
    ]
})

# Thêm các câu hỏi và câu trả lời về tài liệu học tập
training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tìm tài liệu học tập cho môn Toán?"},
        {"role": "assistant", "content": "Để tìm tài liệu học tập cho môn Toán trên Vibely, bạn có thể:\n1. Sử dụng thanh tìm kiếm và nhập 'Toán'\n2. Chọn bộ lọc môn học và chọn 'Toán'\n3. Duyệt qua các danh mục tài liệu theo cấp độ (THCS, THPT, Đại học)\n4. Tìm kiếm theo chủ đề cụ thể như 'Đại số', 'Hình học', 'Giải tích'\n5. Lọc theo loại tài liệu (bài giảng, bài tập, đề thi)\nBạn cũng có thể tham gia các nhóm học tập Toán để nhận tài liệu và hỗ trợ từ bạn học."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tìm tài liệu học tập cho môn Vật lý?"},
        {"role": "assistant", "content": "Để tìm tài liệu học tập cho môn Vật lý trên Vibely, bạn có thể:\n1. Sử dụng thanh tìm kiếm và nhập 'Vật lý'\n2. Chọn bộ lọc môn học và chọn 'Vật lý'\n3. Duyệt qua các danh mục tài liệu theo cấp độ (THCS, THPT, Đại học)\n4. Tìm kiếm theo chủ đề cụ thể như 'Cơ học', 'Điện học', 'Quang học'\n5. Lọc theo loại tài liệu (bài giảng, bài tập, đề thi)\nBạn cũng có thể tham gia các nhóm học tập Vật lý để nhận tài liệu và hỗ trợ từ bạn học."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tìm tài liệu học tập cho môn Hóa học?"},
        {"role": "assistant", "content": "Để tìm tài liệu học tập cho môn Hóa học trên Vibely, bạn có thể:\n1. Sử dụng thanh tìm kiếm và nhập 'Hóa học'\n2. Chọn bộ lọc môn học và chọn 'Hóa học'\n3. Duyệt qua các danh mục tài liệu theo cấp độ (THCS, THPT, Đại học)\n4. Tìm kiếm theo chủ đề cụ thể như 'Hóa vô cơ', 'Hóa hữu cơ', 'Hóa phân tích'\n5. Lọc theo loại tài liệu (bài giảng, bài tập, đề thi)\nBạn cũng có thể tham gia các nhóm học tập Hóa học để nhận tài liệu và hỗ trợ từ bạn học."}
    ]
})

# Thêm các câu hỏi và câu trả lời về lịch học
training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để thêm một buổi học vào lịch?"},
        {"role": "assistant", "content": "Để thêm một buổi học vào lịch trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào tab 'Lịch học' trên thanh điều hướng\n3. Nhấp vào nút 'Thêm sự kiện'\n4. Điền thông tin về buổi học:\n   - Tiêu đề: Tên môn học hoặc chủ đề\n   - Ngày và giờ bắt đầu\n   - Thời lượng buổi học\n   - Địa điểm (nếu có)\n   - Mô tả (nếu cần)\n5. Chọn màu sắc để phân biệt với các môn học khác\n6. Thêm nhắc nhở (nếu cần)\n7. Nhấp vào 'Lưu' để hoàn tất"}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để đặt nhắc nhở cho deadline?"},
        {"role": "assistant", "content": "Để đặt nhắc nhở cho deadline trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào tab 'Lịch học' hoặc 'Nhiệm vụ' trên thanh điều hướng\n3. Nhấp vào nút 'Thêm nhiệm vụ' hoặc 'Thêm deadline'\n4. Điền thông tin về deadline:\n   - Tiêu đề: Tên bài tập hoặc nhiệm vụ\n   - Ngày và giờ hết hạn\n   - Môn học liên quan\n   - Mô tả chi tiết (nếu cần)\n5. Chọn mức độ ưu tiên\n6. Thêm nhắc nhở (có thể chọn nhắc trước 1 ngày, 1 tuần, v.v.)\n7. Nhấp vào 'Lưu' để hoàn tất\nBạn sẽ nhận được thông báo khi đến thời gian nhắc nhở."}
    ]
})

# Thêm các câu hỏi và câu trả lời về nhóm học tập
training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để mời bạn học vào nhóm học tập?"},
        {"role": "assistant", "content": "Để mời bạn học vào nhóm học tập trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Truy cập vào nhóm học tập của bạn\n3. Nhấp vào tab 'Thành viên' hoặc 'Quản lý nhóm'\n4. Nhấp vào nút 'Mời thành viên'\n5. Tìm kiếm bạn học bằng tên, email hoặc tên người dùng\n6. Chọn bạn học bạn muốn mời\n7. Nhấp vào 'Gửi lời mời'\nBạn học sẽ nhận được thông báo về lời mời và có thể chấp nhận hoặc từ chối."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để tìm nhóm học tập phù hợp?"},
        {"role": "assistant", "content": "Để tìm nhóm học tập phù hợp trên Vibely, bạn có thể:\n1. Sử dụng thanh tìm kiếm và nhập từ khóa liên quan đến môn học hoặc chủ đề\n2. Duyệt qua danh sách các nhóm học tập theo môn học\n3. Lọc nhóm theo cấp độ học tập (THCS, THPT, Đại học)\n4. Xem các nhóm phổ biến hoặc được đề xuất\n5. Kiểm tra số lượng thành viên và hoạt động của nhóm\n6. Đọc mô tả của nhóm để hiểu mục đích và quy tắc\n7. Tham gia nhóm và giới thiệu bản thân\nBạn cũng có thể tạo nhóm học tập mới nếu không tìm thấy nhóm phù hợp."}
    ]
})

# Thêm các câu hỏi và câu trả lời về tài khoản và cài đặt
training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để thay đổi mật khẩu tài khoản?"},
        {"role": "assistant", "content": "Để thay đổi mật khẩu tài khoản trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào biểu tượng hồ sơ ở góc trên bên phải\n3. Chọn 'Cài đặt tài khoản'\n4. Nhấp vào 'Bảo mật' hoặc 'Thay đổi mật khẩu'\n5. Nhập mật khẩu hiện tại\n6. Nhập mật khẩu mới và xác nhận lại\n7. Nhấp vào 'Lưu' hoặc 'Cập nhật' để hoàn tất\nNếu bạn quên mật khẩu, bạn có thể nhấp vào 'Quên mật khẩu?' trên trang đăng nhập và làm theo hướng dẫn để đặt lại mật khẩu."}
    ]
})

training_data.append({
    "messages": [
        {"role": "system", "content": "Bạn là trợ lý ảo của mạng xã hội học tập Vibely, giúp người dùng hiểu về các tính năng và chức năng của nền tảng."},
        {"role": "user", "content": "Làm thế nào để cập nhật thông tin cá nhân?"},
        {"role": "assistant", "content": "Để cập nhật thông tin cá nhân trên Vibely, bạn cần:\n1. Đăng nhập vào tài khoản của bạn\n2. Nhấp vào biểu tượng hồ sơ ở góc trên bên phải\n3. Chọn 'Chỉnh sửa hồ sơ'\n4. Cập nhật các thông tin như:\n   - Ảnh đại diện\n   - Tên hiển thị\n   - Email\n   - Số điện thoại\n   - Trường học/Lớp học\n   - Môn học yêu thích\n   - Giới thiệu bản thân\n5. Nhấp vào 'Lưu' để hoàn tất\nThông tin cá nhân của bạn sẽ được cập nhật và hiển thị trên hồ sơ của bạn."}
    ]
})

# Lưu dữ liệu training vào file JSONL
with open("vibely_training_data.jsonl", "w", encoding="utf-8") as f:
    for item in training_data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"Đã tạo file vibely_training_data.jsonl với {len(training_data)} mẫu dữ liệu training.") 