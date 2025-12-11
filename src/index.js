import express from "express";
import { CONFIG } from "./config/config.js";
import {
  initFirebase,
  startCommandListener,
} from "./services/firebaseService.js";
import { availableTools } from "./tools/index.js";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "TVU Firebase Backend",
    availableTools,
    usage: {
      description:
        "Gửi command vào Firebase Realtime Database tại /commands/{id}",
      format: {
        action: "tên tool (vd: tvuLogin, tvuGrades...)",
        params: "object chứa các tham số",
      },
      example: {
        action: "tvuLogin",
        params: { username: "MSSV", password: "matkhau" },
      },
    },
  });
});

// API endpoint để test trực tiếp (optional)
app.get("/tools", (req, res) => {
  res.json({
    tools: availableTools,
    descriptions: {
      tvuLogin: "Đăng nhập TVU - params: { username, password }",
      tvuStudentInfo: "Lấy thông tin sinh viên - params: { userId }",
      tvuSemesters: "Lấy danh sách học kỳ - params: { userId }",
      tvuSchedule: "Lấy thời khóa biểu - params: { userId, hocKy }",
      tvuGrades: "Lấy bảng điểm - params: { userId }",
      tvuTuition: "Lấy thông tin học phí - params: { userId }",
      tvuCurriculum: "Lấy chương trình đào tạo - params: { userId }",
      tvuNotifications: "Lấy thông báo - params: { userId, limit? }",
    },
  });
});

// Start server
async function start() {
  try {
    // Initialize Firebase
    initFirebase();

    // Start listening for commands
    startCommandListener();

    // Start Express server
    app.listen(CONFIG.server.port, () => {
      console.log(`[Server] 🚀 Running on port ${CONFIG.server.port}`);
      console.log(`[Server] 📋 Available tools: ${availableTools.join(", ")}`);
    });
  } catch (error) {
    console.error("[Server] ✗ Failed to start:", error.message);
    process.exit(1);
  }
}

start();
