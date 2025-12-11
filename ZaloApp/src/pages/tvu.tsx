/**
 * TVU Dashboard - Trang chính TVU Student Portal
 * UI thống kê xịn với Duolingo style
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useMemo } from "react";
import {
  GraduationCap,
  Loader2,
  RefreshCw,
  Clock,
  MapPin,
  AlertTriangle,
  Calendar,
  BookOpen,
  Trophy,
  Flame,
  Star,
  ChevronRight,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuDashboard() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    userName,
    studentInfo,
    currentSchedule,
    grades,
    tuition,
    curriculum,
    notifications,
    isLoading,
    loadingAction,
    fetchAllData,
  } = useTvuStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && !studentInfo && !isLoading) {
      fetchAllData();
    }
  }, [isLoggedIn, studentInfo, isLoading, fetchAllData]);

  // Stats
  const latestSemester = grades?.danhSachHocKy?.[0];
  const gpa4 = parseFloat(latestSemester?.diemTBTichLuy?.he4 || "0");
  const gpa10 = latestSemester?.diemTBTichLuy?.he10 || "--";
  const totalCredits = parseInt(latestSemester?.tinChiTichLuy || "0");
  const semesterGpa = latestSemester?.diemTBHocKy?.he4 || "--";
  const progressPercent = parseInt(curriculum?.tienDoTongThe || "0");
  const unreadCount = notifications?.soThongBaoChuaDoc || 0;
  const hasDebt = (tuition?.tongConNoRaw || 0) > 0;

  // Today's schedule
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

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.6) return "var(--duo-green)";
    if (gpa >= 3.2) return "var(--duo-blue)";
    if (gpa >= 2.5) return "var(--duo-yellow)";
    if (gpa >= 2.0) return "var(--duo-orange)";
    return "var(--duo-red)";
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.6) return "Xuất sắc";
    if (gpa >= 3.2) return "Giỏi";
    if (gpa >= 2.5) return "Khá";
    if (gpa >= 2.0) return "Trung bình";
    return "Cần cố gắng";
  };

  const getTodayStr = () => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const today = new Date();
    return `${days[today.getDay()]}, ${today.getDate()}/${
      today.getMonth() + 1
    }`;
  };

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading */}
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
      <div className="bg-[var(--card)] border-b-2 border-[var(--border)] pt-14 pb-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)] flex items-center justify-center text-white font-bold">
              {studentInfo?.hoTen?.charAt(0) || "S"}
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">
                {studentInfo?.hoTen || userName || "Sinh viên TVU"}
              </h1>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                {studentInfo?.maSV} • {studentInfo?.lop}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchAllData()}
            className="w-9 h-9 rounded-xl bg-[var(--secondary)] flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Alert */}
        {hasDebt && (
          <div className="p-3 rounded-2xl bg-[var(--duo-red)]/10 border-2 border-[var(--duo-red)]/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--duo-red)]/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[var(--duo-red)]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[var(--duo-red)] text-sm">
                Còn nợ học phí
              </p>
              <p className="text-xs text-[var(--duo-red)]/70">
                {tuition?.tongConNo}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--duo-red)]" />
          </div>
        )}

        {/* GPA Hero Card */}
        <div className="card-3d p-4 bg-gradient-to-br from-[var(--duo-blue)]/10 to-[var(--duo-purple)]/10">
          <div className="flex items-center gap-4">
            {/* GPA Circle */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getGpaColor(gpa4)}
                  strokeWidth="3"
                  strokeDasharray={`${(gpa4 / 4) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">
                  {gpa4.toFixed(2)}
                </span>
                <span className="text-[8px] text-[var(--muted-foreground)]">
                  GPA
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Trophy
                  className="w-4 h-4"
                  style={{ color: getGpaColor(gpa4) }}
                />
                <span
                  className="font-bold text-sm"
                  style={{ color: getGpaColor(gpa4) }}
                >
                  {getGpaLabel(gpa4)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[var(--duo-yellow)]" />
                  <span className="text-[var(--muted-foreground)]">Hệ 10:</span>
                  <span className="font-bold text-foreground">{gpa10}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--duo-green)]" />
                  <span className="text-[var(--muted-foreground)]">
                    Tín chỉ:
                  </span>
                  <span className="font-bold text-foreground">
                    {totalCredits}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Progress */}
          <div className="card-3d p-3 text-center">
            <div className="relative w-12 h-12 mx-auto mb-1">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--duo-purple)"
                  strokeWidth="4"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--duo-purple)]">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <p className="text-[10px] font-semibold text-foreground">CTĐT</p>
          </div>

          {/* Week */}
          <div className="card-3d p-3 text-center">
            <div className="w-12 h-12 mx-auto mb-1 rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-[var(--duo-green)]" />
            </div>
            <p className="text-lg font-bold text-[var(--duo-green)]">
              {currentWeekNum || "--"}
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              Tuần học
            </p>
          </div>

          {/* Notifications */}
          <div className="card-3d p-3 text-center relative">
            <div className="w-12 h-12 mx-auto mb-1 rounded-xl bg-[var(--duo-orange)]/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[var(--duo-orange)]" />
            </div>
            <p className="text-lg font-bold text-[var(--duo-orange)]">
              {unreadCount}
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              Thông báo
            </p>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--duo-red)] rounded-full" />
            )}
          </div>
        </div>

        {/* Semester Stats */}
        <div className="card-3d p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">
              Học kỳ gần nhất
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              {latestSemester?.tenHocKy || "--"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--secondary)] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[var(--duo-yellow)] rounded-full transition-all"
                style={{ width: `${(parseFloat(semesterGpa) / 4) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-[var(--duo-yellow)]">
              {semesterGpa}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            {latestSemester?.tinChiDatHK || 0} tín chỉ đạt trong kỳ
          </p>
        </div>

        {/* Today Schedule */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--duo-green)]" />
              <span className="font-bold text-foreground text-sm">
                Lịch học hôm nay
              </span>
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              {getTodayStr()}
            </span>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="card-3d p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-[var(--duo-green)]">
                Không có lịch học!
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Hôm nay bạn được nghỉ ngơi
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySchedule.map((item, idx) => (
                <div key={idx} className="card-3d p-3 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex flex-col items-center justify-center"
                    style={{ background: "var(--duo-green)", color: "white" }}
                  >
                    <span className="text-[10px] font-medium">Tiết</span>
                    <span className="text-sm font-bold leading-none">
                      {item.tietBatDau}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {item.tenMon}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                        <Clock className="w-3 h-3" />
                        {item.tietBatDau}-{item.tietBatDau + item.soTiet - 1}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
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
      </div>
    </Page>
  );
}

export default TvuDashboard;
