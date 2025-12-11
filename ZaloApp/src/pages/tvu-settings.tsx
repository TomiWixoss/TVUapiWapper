/**
 * TVU Settings - Cài đặt và thông tin tài khoản
 */
import { Page, useNavigate } from "zmp-ui";
import {
  Sun,
  Moon,
  Info,
  LogOut,
  User,
  ChevronRight,
  Bell,
  CreditCard,
  FileText,
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useTvuStore } from "@/stores/tvu-store";

function TvuSettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { studentInfo, userId, logout, notifications, tuition } = useTvuStore();

  const handleLogout = () => {
    logout();
    navigate("/tvu-login");
  };

  const unreadCount = notifications?.soThongBaoChuaDoc || 0;
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
      icon: Bell,
      label: "Thông báo",
      desc: unreadCount > 0 ? `${unreadCount} thông báo mới` : "Xem thông báo",
      path: "/tvu-notifications",
      color: "var(--duo-orange)",
      badge: unreadCount > 0,
      badgeCount: unreadCount,
    },
    {
      icon: CreditCard,
      label: "Học phí",
      desc: hasDebt ? `Còn nợ: ${tuition?.tongConNo}` : "Đã đóng đủ",
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
  ];

  return (
    <Page className="bg-background min-h-screen">
      {/* Header */}
      <div className="pt-16 pb-4 px-4 bg-[var(--card)] border-b-2 border-[var(--border)]">
        <h1 className="font-bold text-xl text-foreground">Tài khoản</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-32">
        {/* User Info */}
        {studentInfo && (
          <div className="card-3d p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)] flex items-center justify-center text-white font-bold text-2xl">
                {studentInfo.hoTen?.charAt(0) || "S"}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-foreground">
                  {studentInfo.hoTen}
                </h2>
                <p className="text-sm text-[var(--duo-blue)] font-semibold">
                  {userId}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {studentInfo.nganh}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card-3d w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}20` }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: item.color }}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {item.desc}
                  </p>
                </div>
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

          <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mt-4 mb-2">
            Cài đặt
          </h3>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="card-3d w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-yellow)]/20 flex items-center justify-center">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-[var(--duo-yellow)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--duo-yellow)]" />
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Chế độ tối</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {theme === "dark" ? "Đang bật" : "Đang tắt"}
                </p>
              </div>
            </div>
            <div
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                theme === "dark"
                  ? "bg-[var(--duo-blue)]"
                  : "bg-[var(--secondary)]"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full bg-white shadow-md transition-transform"
                style={{
                  transform:
                    theme === "dark" ? "translateX(24px)" : "translateX(0)",
                }}
              />
            </div>
          </button>

          {/* App Info */}
          <div className="card-3d p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-[var(--duo-blue)]" />
              </div>
              <div>
                <p className="font-semibold text-foreground">TVU Student</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Phiên bản 1.0.0
                </p>
              </div>
            </div>
          </div>
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

export default TvuSettingsPage;
