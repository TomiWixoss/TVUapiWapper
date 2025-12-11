# Cấu trúc Firebase cho TVU Student App

## Realtime Database

### /commands/{commandId}

Gửi lệnh đến backend để gọi TVU API

```json
{
  "action": "tvuLogin | tvuStudentInfo | tvuSemesters | tvuSchedule | tvuGrades | tvuTuition | tvuCurriculum | tvuNotifications",
  "params": {
    "userId": "string - MSSV (bắt buộc cho các action khác tvuLogin)",
    "username": "string - MSSV (cho tvuLogin)",
    "password": "string - Mật khẩu (cho tvuLogin)",
    "hocKy": "number - Mã học kỳ (cho tvuSchedule)",
    "limit": "number - Số lượng (cho tvuNotifications)"
  },
  "status": "pending | processing | completed | error",
  "response": {
    "success": "boolean",
    "data": "object - Dữ liệu trả về",
    "error": "string - Thông báo lỗi nếu có"
  },
  "createdAt": "timestamp",
  "processedAt": "timestamp",
  "completedAt": "timestamp"
}
```

## Các Action hỗ trợ

### 1. tvuLogin

Đăng nhập TVU Student Portal

**Params:**

- `username`: MSSV
- `password`: Mật khẩu

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Đăng nhập thành công!",
    "userId": "123456",
    "userName": "Nguyễn Văn A",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
}
```

### 2. tvuStudentInfo

Lấy thông tin sinh viên

**Params:**

- `userId`: MSSV đã đăng nhập

**Response:**

```json
{
  "success": true,
  "data": {
    "maSV": "123456",
    "hoTen": "Nguyễn Văn A",
    "gioiTinh": "Nam",
    "ngaySinh": "01/01/2000",
    "noiSinh": "Trà Vinh",
    "lop": "CNTT01",
    "khoa": "Công nghệ thông tin",
    "nganh": "Công nghệ thông tin",
    "chuyenNganh": "Kỹ thuật phần mềm",
    "khoaHoc": "2020-2024",
    "heDaoTao": "Đại học chính quy",
    "email": "example@tvu.edu.vn",
    "dienThoai": "0123456789",
    "soCMND": "123456789",
    "trangThai": "Đang học"
  }
}
```

### 3. tvuSemesters

Lấy danh sách học kỳ

### 4. tvuSchedule

Lấy thời khóa biểu theo học kỳ

**Params:**

- `userId`: MSSV
- `hocKy`: Mã học kỳ (VD: 20241)

### 5. tvuGrades

Lấy bảng điểm toàn bộ

### 6. tvuTuition

Lấy thông tin học phí

### 7. tvuCurriculum

Lấy chương trình đào tạo

### 8. tvuNotifications

Lấy thông báo từ nhà trường

**Params:**

- `userId`: MSSV
- `limit`: Số lượng (mặc định 20)

## Flow hoạt động

1. **Client (Zalo Mini App)** gửi command vào `/commands/{id}` với `status: pending`
2. **Backend (Express)** lắng nghe `child_added` event
3. Backend cập nhật `status: processing` và gọi TVU API
4. Backend cập nhật `status: completed/error` và ghi `response`
5. Client nhận response qua `onValue` listener

## Ví dụ sử dụng từ Client

```typescript
import { sendTvuCommand } from "@/services/tvu-api";

// Đăng nhập
const loginResult = await sendTvuCommand("tvuLogin", {
  username: "123456",
  password: "matkhau",
});

// Lấy thông tin sinh viên
const infoResult = await sendTvuCommand("tvuStudentInfo", {
  userId: "123456",
});

// Lấy bảng điểm
const gradesResult = await sendTvuCommand("tvuGrades", {
  userId: "123456",
});
```
