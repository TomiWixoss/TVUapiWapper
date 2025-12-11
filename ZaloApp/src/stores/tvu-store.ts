/**
 * TVU Store - Quản lý state cho TVU Student Portal
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  tvuLogin,
  tvuGetStudentInfo,
  tvuGetSemesters,
  tvuGetSchedule,
  tvuGetGrades,
  tvuGetTuition,
  tvuGetCurriculum,
  tvuGetNotifications,
  type TvuStudentData,
  type TvuSemestersData,
  type TvuScheduleData,
  type TvuGradesData,
  type TvuTuitionData,
  type TvuCurriculumData,
  type TvuNotificationsData,
} from "@/services/tvu-api";

interface TvuState {
  // Auth
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  password: string | null; // Lưu để auto re-login khi token hết hạn

  // Data
  studentInfo: TvuStudentData | null;
  semesters: TvuSemestersData | null;
  currentSchedule: TvuScheduleData | null;
  grades: TvuGradesData | null;
  tuition: TvuTuitionData | null;
  curriculum: TvuCurriculumData | null;
  notifications: TvuNotificationsData | null;

  // Loading states
  isLoading: boolean;
  loadingAction: string | null;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  ensureLoggedIn: () => Promise<boolean>;
  fetchStudentInfo: () => Promise<void>;
  fetchSemesters: () => Promise<void>;
  fetchSchedule: (hocKy?: number) => Promise<void>;
  fetchGrades: () => Promise<void>;
  fetchTuition: () => Promise<void>;
  fetchCurriculum: () => Promise<void>;
  fetchNotifications: (limit?: number) => Promise<void>;
  fetchAllData: () => Promise<void>;
  clearError: () => void;
}

export const useTvuStore = create<TvuState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoggedIn: false,
      userId: null,
      userName: null,
      password: null,
      studentInfo: null,
      semesters: null,
      currentSchedule: null,
      grades: null,
      tuition: null,
      curriculum: null,
      notifications: null,
      isLoading: false,
      loadingAction: null,
      error: null,

      login: async (username, password) => {
        set({
          isLoading: true,
          loadingAction: "Đang đăng nhập...",
          error: null,
        });

        const result = await tvuLogin(username, password);

        if (result.success && result.data) {
          set({
            isLoggedIn: true,
            userId: username,
            userName: result.data.userName,
            password: password, // Lưu để auto re-login
            isLoading: false,
            loadingAction: null,
          });
          return true;
        } else {
          set({
            isLoading: false,
            loadingAction: null,
            error: result.error || "Đăng nhập thất bại",
          });
          return false;
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          userId: null,
          userName: null,
          password: null,
          studentInfo: null,
          semesters: null,
          currentSchedule: null,
          grades: null,
          tuition: null,
          curriculum: null,
          notifications: null,
          error: null,
        });
      },

      // Auto re-login nếu token hết hạn
      ensureLoggedIn: async () => {
        const { userId, password, isLoggedIn } = get();
        if (!isLoggedIn || !userId || !password) return false;

        // Gửi login request để refresh token trên backend
        const result = await tvuLogin(userId, password);
        return result.success;
      },

      fetchStudentInfo: async () => {
        const { userId } = get();
        if (!userId) return;

        set({
          isLoading: true,
          loadingAction: "Đang tải thông tin sinh viên...",
        });

        const result = await tvuGetStudentInfo(userId);

        if (result.success && result.data) {
          set({
            studentInfo: result.data,
            isLoading: false,
            loadingAction: null,
          });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchSemesters: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ isLoading: true, loadingAction: "Đang tải danh sách học kỳ..." });

        const result = await tvuGetSemesters(userId);

        if (result.success && result.data) {
          set({
            semesters: result.data,
            isLoading: false,
            loadingAction: null,
          });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchSchedule: async (hocKy) => {
        const { userId, semesters } = get();
        if (!userId) return;

        const semester = hocKy || semesters?.hocKyHienTai;
        if (!semester) {
          set({ error: "Chưa có thông tin học kỳ" });
          return;
        }

        set({ isLoading: true, loadingAction: "Đang tải thời khóa biểu..." });

        const result = await tvuGetSchedule(userId, semester);

        if (result.success && result.data) {
          set({
            currentSchedule: result.data,
            isLoading: false,
            loadingAction: null,
          });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchGrades: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ isLoading: true, loadingAction: "Đang tải bảng điểm..." });

        const result = await tvuGetGrades(userId);

        if (result.success && result.data) {
          set({ grades: result.data, isLoading: false, loadingAction: null });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchTuition: async () => {
        const { userId } = get();
        if (!userId) return;

        set({
          isLoading: true,
          loadingAction: "Đang tải thông tin học phí...",
        });

        const result = await tvuGetTuition(userId);

        if (result.success && result.data) {
          set({ tuition: result.data, isLoading: false, loadingAction: null });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchCurriculum: async () => {
        const { userId } = get();
        if (!userId) return;

        set({
          isLoading: true,
          loadingAction: "Đang tải chương trình đào tạo...",
        });

        const result = await tvuGetCurriculum(userId);

        if (result.success && result.data) {
          set({
            curriculum: result.data,
            isLoading: false,
            loadingAction: null,
          });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchNotifications: async (limit = 20) => {
        const { userId } = get();
        if (!userId) return;

        set({ isLoading: true, loadingAction: "Đang tải thông báo..." });

        const result = await tvuGetNotifications(userId, limit);

        if (result.success && result.data) {
          set({
            notifications: result.data,
            isLoading: false,
            loadingAction: null,
          });
        } else {
          set({ isLoading: false, loadingAction: null, error: result.error });
        }
      },

      fetchAllData: async () => {
        const {
          ensureLoggedIn,
          fetchStudentInfo,
          fetchSemesters,
          fetchGrades,
          fetchTuition,
          fetchNotifications,
        } = get();

        // Đảm bảo đã login (refresh token nếu cần)
        set({ isLoading: true, loadingAction: "Đang kết nối..." });
        await ensureLoggedIn();

        // Fetch in parallel
        await Promise.all([
          fetchStudentInfo(),
          fetchSemesters(),
          fetchGrades(),
          fetchTuition(),
          fetchNotifications(),
        ]);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "tvu-storage",
      partialize: (state) => ({
        // Auth
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        userName: state.userName,
        password: state.password,
        // Cache all data
        studentInfo: state.studentInfo,
        semesters: state.semesters,
        currentSchedule: state.currentSchedule,
        grades: state.grades,
        tuition: state.tuition,
        curriculum: state.curriculum,
        notifications: state.notifications,
      }),
    }
  )
);
