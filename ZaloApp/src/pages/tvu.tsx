/**
 * TVU Dashboard - Trang chính TVU Student Portal
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useMemo } from "react";
import {
  GraduationCap,
  LogOut,
  Loader2,
  RefreshCw,
  Clock,
  MapPin,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Bell,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuDashboard() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    userName,
    studentInfo,
    semesters,
    currentSchedule,
    grades,
    tuition,
    curriculum,
    notifications,
    isLoading,
    loadingAction,
    logout,
    fetchAllData,
  } = useTvuStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
    }
  }, [isLoggedIn, navigate]);

  // Không tự động fetch - chỉ fetch khi bấm nút reload
  // Data được cache trong localStorage

  const handleLogout = () => {
    logout();
    navigate("/tvu-login");
  };

  // Calculate stats
  const latestSemester = grades?.danhSachHocKy?.[0];
  const gpa4 = latestSemester?.diemTBTichLuy?.he4 || "--";
  const gpa10 = latestSemester?.diemTBTichLuy?.he10 || "--";
  const totalCredits = latestSemester?.tinChiTichLuy || "--";
  const semesterGpa = latestSemester?.diemTBHocKy?.he4 || "--";

  // Curriculum progress
  const curriculumProgress = curriculum?.tienDoTongThe || "0%";
  const progressPercent = parseInt(curriculumProgress) || 0;

  // Unread notifications
  const unreadCount = notifications?.soThongBaoChuaDoc || 0;

  // Debt
  const debt = tuition?.tongConNo || "0 VNĐ";
  const hasDebt = (tuition?.tongConNoRaw || 0) > 0;

  // Get today's schedule
  const todaySchedule = useMemo(() => {
    if (!currentSchedule?.danhSachTuan) return [];

    const today = new Date();
    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const todayName = dayNames[today.getDay()];

    const currentWeek = currentSchedule.danhSachTuan.find((week) => {
      const [d1, m1, y1] = week.ngayBatDau.split("/");
      const [d2, m2, y2] = week.ngayKetThuc.split("/");
      const start = new Date(+y1, +m1 - 1, +d1);
      const end = new Date(+y2, +m2 - 1, +d2, 23, 59, 59);
      return today >= start && today <= end;
    });

    if (!currentWeek?.lichHoc) return [];

    return currentWeek.lichHoc
      .filter((item) => item.thu === todayName)
      .sort((a, b) => a.tietBatDau - b.tietBatDau);
  }, [currentSchedule]);

  // Get current week number
  const currentWeekNum = useMemo(() => {
    if (!currentSchedule?.danhSachTuan) return null;
    const today = new Date();
    const week = currentSchedule.danhSachTuan.find((w) => {
      const [d1, m1, y1] = w.ngayBatDau.split("/");
      const [d2, m2, y2] = w.ngayKetThuc.split("/");
      const start = new Date(+y1, +m1 - 1, +d1);
      const end = new Date(+y2, +m2 - 1, +d2, 23, 59, 59);
      return today >= start && today <= end;
    });
    return week?.tuanHocKy || null;
  }, [currentSchedule]);

  const getTodayName = () => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[new Date().getDay()];
  };

  const formatDate = () => {
    const today = new Date();
    return `${today.getDate()}/${today.getMonth() + 1}`;
  };

  // Get GPA rating
  const getGpaRating = (gpa: string) => {
    const g = parseFloat(gpa);
    if (isNaN(g)) return { text: "--", color: "var(--muted-foreground)" };
    if (g >= 3.6) return { text: "Xuất sắc", color: "var(--duo-green)" };
    if (g >= 3.2) return { text: "Giỏi", color: "var(--duo-blue)" };
    if (g >= 2.5) return { text: "Khá", color: "var(--duo-yellow)" };
    if (g >= 2.0) return { text: "TB", color: "var(--duo-orange)" };
    return { text: "Yếu", color: "var(--duo-red)" };
  };

  const gpaRating = getGpaRating(gpa4);

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading Overlay */}
      {isLoading && !studentInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-blue)] animate-spin" />
            <p className="text-sm text-foreground font-medium">
              {loadingAction}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-12 pb-4 px-4 bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-[10px]">Xin chào,</p>
              <h1 className="text-sm font-bold text-white leading-tight">
                {studentInfo?.hoTen || userName || "Sinh viên TVU"}
              </h1>
              <p className="text-white/60 text-[10px]">
                {studentInfo?.maSV} • {studentInfo?.lop}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchAllData()}
            className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* GPA Card */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{gpa4}</span>
                <span className="text-[8px] text-white/70">GPA</span>
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: gpaRating.color }}
                >
                  {gpaRating.text}
                </p>
                <p className="text-white/70 text-[10px]">
                  Điểm TB hệ 10: {gpa10}
                </p>
                <p className="text-white/70 text-[10px]">
                  HK này: {semesterGpa} (hệ 4)
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{totalCredits}</p>
              <p className="text-[10px] text-white/70">tín chỉ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 pb-28">
        {/* Alert: Debt */}
        {hasDebt && (
          <div className="mb-3 p-3 rounded-xl bg-[var(--duo-red)]/10 border border-[var(--duo-red)]/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--duo-red)] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--duo-red)]">
                Còn nợ học phí
              </p>
              <p className="text-xs text-[var(--duo-red)]/80">{debt}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Progress */}
          <div className="card-3d p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[var(--duo-purple)]" />
              <span className="text-xs font-semibold text-foreground">
                Tiến độ CTĐT
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-[var(--duo-purple)]">
                {curriculumProgress}
              </span>
            </div>
            <div className="mt-2 h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--duo-purple)] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Current Week */}
          <div className="card-3d p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--duo-green)]" />
              <span className="text-xs font-semibold text-foreground">
                Tuần học
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-[var(--duo-green)]">
                {currentWeekNum || "--"}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                /{currentSchedule?.danhSachTuan?.length || "--"}
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
              {semesters?.danhSachHocKy?.find(
                (s) => s.maHocKy === semesters.hocKyHienTai
              )?.tenHocKy || ""}
            </p>
          </div>

          {/* Semester GPA */}
          <div className="card-3d p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[var(--duo-yellow)]" />
              <span className="text-xs font-semibold text-foreground">
                Điểm HK gần nhất
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[var(--duo-yellow)]">
                {semesterGpa}
              </span>
              <span className="text-xs text-[var(--muted-foreground)] mb-1">
                / 4.0
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
              {latestSemester?.tinChiDatHK || 0} tín chỉ đạt
            </p>
          </div>

          {/* Notifications */}
          <div className="card-3d p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[var(--duo-orange)]" />
              <span className="text-xs font-semibold text-foreground">
                Thông báo
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-[var(--duo-orange)]">
                {unreadCount}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                chưa đọc
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
              Tổng: {notifications?.danhSachThongBao?.length || 0} thông báo
            </p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--duo-green)]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--duo-green)]">
                  {getTodayName()}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-foreground text-sm">Hôm nay</h2>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  {formatDate()} • {todaySchedule.length} môn học
                </p>
              </div>
            </div>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="card-3d p-4 text-center">
              <p className="font-semibold text-[var(--duo-green)]">
                🎉 Không có lịch học!
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Hôm nay bạn được nghỉ ngơi
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="card-3d p-3 flex items-center gap-3"
                  style={{ borderLeft: "3px solid var(--duo-green)" }}
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--duo-green)]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[var(--duo-green)]">
                      T{item.tietBatDau}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {item.tenMon}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {item.tietBatDau}-{item.tietBatDau + item.soTiet - 1}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {item.phong}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-xl bg-[var(--secondary)] flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 text-[var(--duo-red)]" />
          <span className="text-sm font-semibold text-[var(--duo-red)]">
            Đăng xuất
          </span>
        </button>
      </div>
    </Page>
  );
}

export default TvuDashboard;
