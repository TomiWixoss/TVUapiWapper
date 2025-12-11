/**
 * TVU Dashboard - Trang chính TVU Student Portal
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect } from "react";
import {
  GraduationCap,
  User,
  Calendar,
  BookOpen,
  CreditCard,
  Bell,
  FileText,
  LogOut,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuDashboard() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    userId,
    userName,
    studentInfo,
    grades,
    tuition,
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

  // Fetch data on mount
  useEffect(() => {
    if (isLoggedIn && !studentInfo) {
      fetchAllData();
    }
  }, [isLoggedIn, studentInfo, fetchAllData]);

  const handleLogout = () => {
    logout();
    navigate("/tvu-login");
  };

  // Calculate GPA
  const latestSemester = grades?.danhSachHocKy?.[0];
  const gpa4 = latestSemester?.diemTBTichLuy?.he4 || "0";
  const gpa10 = latestSemester?.diemTBTichLuy?.he10 || "0";
  const totalCredits = latestSemester?.tinChiTichLuy || "0";

  // Unread notifications
  const unreadCount = notifications?.soThongBaoChuaDoc || 0;

  // Debt
  const debt = tuition?.tongConNo || "0 VNĐ";
  const hasDebt = (tuition?.tongConNoRaw || 0) > 0;

  const menuItems = [
    {
      icon: User,
      label: "Thông tin sinh viên",
      desc: studentInfo?.hoTen || "Xem thông tin cá nhân",
      path: "/tvu-profile",
      color: "var(--duo-blue)",
    },
    {
      icon: Calendar,
      label: "Thời khóa biểu",
      desc: "Lịch học trong tuần",
      path: "/tvu-schedule",
      color: "var(--duo-green)",
    },
    {
      icon: BookOpen,
      label: "Bảng điểm",
      desc: `GPA: ${gpa4} (hệ 4)`,
      path: "/tvu-grades",
      color: "var(--duo-yellow)",
    },
    {
      icon: CreditCard,
      label: "Học phí",
      desc: hasDebt ? `Còn nợ: ${debt}` : "Đã đóng đủ",
      path: "/tvu-tuition",
      color: hasDebt ? "var(--duo-red)" : "var(--duo-green)",
      badge: hasDebt,
    },
    {
      icon: FileText,
      label: "Chương trình đào tạo",
      desc: "Tiến độ học tập",
      path: "/tvu-curriculum",
      color: "var(--duo-purple)",
    },
    {
      icon: Bell,
      label: "Thông báo",
      desc:
        unreadCount > 0
          ? `${unreadCount} thông báo mới`
          : "Không có thông báo mới",
      path: "/tvu-notifications",
      color: "var(--duo-orange)",
      badge: unreadCount > 0,
      badgeCount: unreadCount,
    },
  ];

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
      <div className="pt-16 pb-6 px-4 bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {studentInfo?.hoTen || userName || "Sinh viên TVU"}
              </h1>
              <p className="text-white/80 text-sm">{userId}</p>
            </div>
          </div>
          <button
            onClick={() => fetchAllData()}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{gpa4}</p>
            <p className="text-xs text-white/80">GPA (hệ 4)</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{gpa10}</p>
            <p className="text-xs text-white/80">GPA (hệ 10)</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalCredits}</p>
            <p className="text-xs text-white/80">Tín chỉ</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-4 pb-28 -mt-2">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card-3d w-full p-4 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}20` }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-[var(--duo-red)] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badgeCount || "!"}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
              </div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 p-4 rounded-2xl bg-[var(--duo-red)]/10 border-2 border-[var(--duo-red)]/30 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5 text-[var(--duo-red)]" />
          <span className="font-bold text-[var(--duo-red)]">Đăng xuất</span>
        </button>
      </div>
    </Page>
  );
}

export default TvuDashboard;
