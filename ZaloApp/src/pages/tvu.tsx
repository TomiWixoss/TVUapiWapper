/**
 * TVU Dashboard - Trang chính TVU Student Portal
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useMemo } from "react";
import {
  GraduationCap,
  User,
  Calendar,
  BookOpen,
  CreditCard,
  FileText,
  LogOut,
  ChevronRight,
  Loader2,
  RefreshCw,
  Clock,
  MapPin,
  AlertCircle,
  Settings,
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
    notifications,
    isLoading,
    loadingAction,
    logout,
    fetchAllData,
    fetchSemesters,
    fetchSchedule,
  } = useTvuStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch data on mount
  useEffect(() => {
    if (isLoggedIn && !studentInfo) {
      fetchAllData();
    }
  }, [isLoggedIn, studentInfo, fetchAllData]);

  // Fetch schedule for today
  useEffect(() => {
    if (isLoggedIn && !semesters) {
      fetchSemesters();
    }
  }, [isLoggedIn, semesters, fetchSemesters]);

  useEffect(() => {
    if (semesters && !currentSchedule) {
      fetchSchedule(semesters.hocKyHienTai);
    }
  }, [semesters, currentSchedule, fetchSchedule]);

  const handleLogout = () => {
    logout();
    navigate("/tvu-login");
  };

  // Calculate GPA
  const latestSemester = grades?.danhSachHocKy?.[0];
  const gpa4 = latestSemester?.diemTBTichLuy?.he4 || "--";
  const totalCredits = latestSemester?.tinChiTichLuy || "--";

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

    // Find current week
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

  // Get day name in Vietnamese
  const getTodayName = () => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return days[new Date().getDay()];
  };

  const formatDate = () => {
    const today = new Date();
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  };

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
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
      <div className="pt-14 pb-4 px-4 bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs">Xin chào,</p>
              <h1 className="text-base font-bold text-white leading-tight">
                {studentInfo?.hoTen || userName || "Sinh viên TVU"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAllData()}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => navigate("/tvu-settings")}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className="bg-white/20 rounded-xl p-2.5 text-center cursor-pointer"
            onClick={() => navigate("/tvu-grades")}
          >
            <p className="text-xl font-bold text-white">{gpa4}</p>
            <p className="text-[10px] text-white/80">GPA</p>
          </div>
          <div
            className="bg-white/20 rounded-xl p-2.5 text-center cursor-pointer"
            onClick={() => navigate("/tvu-curriculum")}
          >
            <p className="text-xl font-bold text-white">{totalCredits}</p>
            <p className="text-[10px] text-white/80">Tín chỉ</p>
          </div>
          <div
            className="bg-white/20 rounded-xl p-2.5 text-center cursor-pointer relative"
            onClick={() => navigate("/tvu-notifications")}
          >
            <p className="text-xl font-bold text-white">{unreadCount}</p>
            <p className="text-[10px] text-white/80">Thông báo</p>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--duo-red)] rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 pb-28">
        {/* Alerts */}
        {hasDebt && (
          <button
            onClick={() => navigate("/tvu-tuition")}
            className="w-full mb-3 p-3 rounded-xl bg-[var(--duo-red)]/10 border border-[var(--duo-red)]/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-[var(--duo-red)] flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[var(--duo-red)]">
                Còn nợ học phí
              </p>
              <p className="text-xs text-[var(--duo-red)]/80">{debt}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--duo-red)]" />
          </button>
        )}

        {/* Today's Schedule */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-foreground">Lịch học hôm nay</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {getTodayName()}, {formatDate()}
              </p>
            </div>
            <button
              onClick={() => navigate("/tvu-schedule")}
              className="text-xs text-[var(--duo-blue)] font-semibold flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="card-3d p-6 text-center">
              <Calendar className="w-10 h-10 text-[var(--duo-green)] mx-auto mb-2" />
              <p className="font-semibold text-foreground">
                Không có lịch học!
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Hôm nay bạn được nghỉ ngơi 🎉
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="card-3d p-3 flex items-start gap-3"
                  style={{ borderLeft: "4px solid var(--duo-green)" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--duo-green)]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[var(--duo-green)]">
                      T{item.tietBatDau}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {item.tenMon}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Tiết {item.tietBatDau}-
                        {item.tietBatDau + item.soTiet - 1}
                      </span>
                      <span className="flex items-center gap-1">
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

        {/* Quick Actions */}
        <div className="mb-4">
          <h2 className="font-bold text-foreground mb-2">Truy cập nhanh</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                icon: User,
                label: "Hồ sơ",
                path: "/tvu-profile",
                color: "var(--duo-blue)",
              },
              {
                icon: BookOpen,
                label: "Điểm",
                path: "/tvu-grades",
                color: "var(--duo-yellow)",
              },
              {
                icon: CreditCard,
                label: "Học phí",
                path: "/tvu-tuition",
                color: "var(--duo-green)",
              },
              {
                icon: FileText,
                label: "CTĐT",
                path: "/tvu-curriculum",
                color: "var(--duo-purple)",
              },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="card-3d p-3 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}20` }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: item.color }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-foreground">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications?.danhSachThongBao &&
          notifications.danhSachThongBao.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-foreground">Thông báo mới</h2>
                <button
                  onClick={() => navigate("/tvu-notifications")}
                  className="text-xs text-[var(--duo-blue)] font-semibold flex items-center gap-1"
                >
                  Xem tất cả <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {notifications.danhSachThongBao.slice(0, 3).map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => navigate("/tvu-notifications")}
                    className="card-3d w-full p-3 text-left"
                  >
                    <div className="flex items-start gap-2">
                      {!notif.daDoc && (
                        <span className="w-2 h-2 rounded-full bg-[var(--duo-blue)] mt-1.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${
                            !notif.daDoc
                              ? "font-bold text-foreground"
                              : "text-[var(--muted-foreground)]"
                          }`}
                        >
                          {notif.tieuDe}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          {notif.ngayGui}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 p-3 rounded-xl bg-[var(--secondary)] flex items-center justify-center gap-2"
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
