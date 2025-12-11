/**
 * TVU API Service - Giao tiếp với backend qua Firebase Realtime Database
 */
import {
  ref,
  push,
  onValue,
  off,
  update,
  serverTimestamp,
} from "firebase/database";
import { realtimeDb } from "@/lib/firebase";

export type TvuAction =
  | "tvuLogin"
  | "tvuStudentInfo"
  | "tvuSemesters"
  | "tvuSchedule"
  | "tvuGrades"
  | "tvuTuition"
  | "tvuCurriculum"
  | "tvuNotifications";

export interface TvuCommand {
  action: TvuAction;
  params: Record<string, unknown>;
  status?: "pending" | "processing" | "completed" | "error";
  response?: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
  createdAt?: unknown;
  processedAt?: unknown;
  completedAt?: unknown;
}

export interface TvuApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Gửi command đến Firebase và đợi response từ backend
 */
export async function sendTvuCommand<T = unknown>(
  action: TvuAction,
  params: Record<string, unknown> = {},
  timeoutMs = 30000
): Promise<TvuApiResponse<T>> {
  return new Promise((resolve) => {
    const commandsRef = ref(realtimeDb, "commands");

    // Push new command
    const newCommandRef = push(commandsRef);
    const commandData: TvuCommand = {
      action,
      params,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    // Set timeout
    const timeout = setTimeout(() => {
      off(newCommandRef);
      resolve({ success: false, error: "Timeout - Backend không phản hồi" });
    }, timeoutMs);

    // Listen for response
    onValue(newCommandRef, (snapshot) => {
      const data = snapshot.val() as TvuCommand | null;
      if (!data) return;

      if (data.status === "completed" || data.status === "error") {
        clearTimeout(timeout);
        off(newCommandRef);

        if (data.response) {
          resolve(data.response as TvuApiResponse<T>);
        } else {
          resolve({ success: false, error: "Không có response từ backend" });
        }
      }
    });

    // Send command
    update(newCommandRef, commandData).catch((error) => {
      clearTimeout(timeout);
      off(newCommandRef);
      resolve({ success: false, error: `Lỗi gửi command: ${error.message}` });
    });
  });
}

// ═══════════════════════════════════════════════════
// TVU API FUNCTIONS
// ═══════════════════════════════════════════════════

export interface TvuLoginData {
  message: string;
  userId: string;
  userName: string;
  tokenType: string;
  expiresIn: number;
}

export async function tvuLogin(username: string, password: string) {
  return sendTvuCommand<TvuLoginData>("tvuLogin", { username, password });
}

export interface TvuStudentData {
  maSV: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  noiSinh: string;
  lop: string;
  khoa: string;
  nganh: string;
  chuyenNganh: string;
  khoaHoc: string;
  heDaoTao: string;
  email: string;
  dienThoai: string;
  soCMND: string;
  trangThai: string;
}

export async function tvuGetStudentInfo(userId: string) {
  return sendTvuCommand<TvuStudentData>("tvuStudentInfo", { userId });
}

export interface TvuSemester {
  maHocKy: number;
  tenHocKy: string;
}

export interface TvuSemestersData {
  hocKyHienTai: number;
  danhSachHocKy: TvuSemester[];
}

export async function tvuGetSemesters(userId: string) {
  return sendTvuCommand<TvuSemestersData>("tvuSemesters", { userId });
}

export interface TvuScheduleItem {
  maMon: string;
  tenMon: string;
  thu: string;
  tietBatDau: number;
  soTiet: number;
  phong: string;
  giangVien: string;
}

export interface TvuScheduleWeek {
  tuanHocKy: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  lichHoc: TvuScheduleItem[];
}

export interface TvuScheduleData {
  hocKy: number;
  danhSachTuan: TvuScheduleWeek[];
}

export async function tvuGetSchedule(userId: string, hocKy: number) {
  return sendTvuCommand<TvuScheduleData>("tvuSchedule", { userId, hocKy });
}

export interface TvuGradeSubject {
  maMon: string;
  tenMon: string;
  soTinChi: number;
  diemTK: string;
  diemChu: string;
  ketQua: string;
  diemThanhPhan: Array<{
    kyHieu: string;
    ten: string;
    trongSo: string;
    diem: string;
  }>;
}

export interface TvuGradeSemester {
  maHocKy: string;
  tenHocKy: string;
  diemTBHocKy: { he10: string; he4: string };
  diemTBTichLuy: { he10: string; he4: string };
  tinChiDatHK: string;
  tinChiTichLuy: string;
  xepLoai: string;
  danhSachMon: TvuGradeSubject[];
}

export interface TvuGradesData {
  danhSachHocKy: TvuGradeSemester[];
}

export async function tvuGetGrades(userId: string) {
  return sendTvuCommand<TvuGradesData>("tvuGrades", { userId });
}

export interface TvuTuitionSemester {
  tenHocKy: string;
  phaiThu: string;
  mienGiam: string;
  daThu: string;
  conNo: string;
  trangThai: string;
  raw: {
    phaiThu: number;
    mienGiam: number;
    daThu: number;
    conNo: number;
  };
}

export interface TvuTuitionData {
  tongConNo: string;
  tongConNoRaw: number;
  danhSachHocKy: TvuTuitionSemester[];
}

export async function tvuGetTuition(userId: string) {
  return sendTvuCommand<TvuTuitionData>("tvuTuition", { userId });
}

export interface TvuCurriculumSubject {
  maMon: string;
  tenMon: string;
  soTinChi: number;
  daDat: boolean;
  diemChu: string | null;
}

export interface TvuCurriculumSemester {
  thuTuHocKy: number;
  tenHocKy: string;
  tienDo: string;
  danhSachMon: TvuCurriculumSubject[];
}

export interface TvuCurriculumData {
  nganh: string;
  tienDoTongThe: string;
  danhSachHocKy: TvuCurriculumSemester[];
}

export async function tvuGetCurriculum(userId: string) {
  return sendTvuCommand<TvuCurriculumData>("tvuCurriculum", { userId });
}

export interface TvuNotification {
  id: number;
  tieuDe: string;
  noiDung: string;
  ngayGui: string;
  nguoiGui: string;
  doiTuong: string;
  daDoc: boolean;
  quanTrong: boolean;
}

export interface TvuNotificationsData {
  soThongBaoChuaDoc: number;
  danhSachThongBao: TvuNotification[];
}

export async function tvuGetNotifications(userId: string, limit = 20) {
  return sendTvuCommand<TvuNotificationsData>("tvuNotifications", {
    userId,
    limit,
  });
}
