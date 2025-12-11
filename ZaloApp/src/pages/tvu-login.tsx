/**
 * TVU Login Page - Đăng nhập cổng sinh viên TVU
 */
import { Page, useNavigate } from "zmp-ui";
import { useState, useEffect } from "react";
import { GraduationCap, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isLoggedIn } = useTvuStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auto redirect nếu đã login
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/tvu");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;

    clearError();
    const success = await login(username.trim(), password);

    if (success) {
      navigate("/tvu");
    }
  };

  return (
    <Page className="bg-background min-h-screen">
      {/* Header */}
      <div className="pt-20 pb-8 px-6 bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">TVU Student</h1>
          <p className="text-white/80 text-sm">
            Cổng thông tin sinh viên Đại học Trà Vinh
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="px-6 py-8 -mt-4">
        <div className="card-3d p-6">
          <h2 className="text-lg font-bold text-foreground mb-6 text-center">
            Đăng nhập
          </h2>

          {/* Username */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] mb-2 block">
              Mã số sinh viên
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập MSSV"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--secondary)] text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-[var(--duo-blue)]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] mb-2 block">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--secondary)] text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-[var(--duo-blue)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[var(--muted-foreground)]" />
                ) : (
                  <Eye className="w-5 h-5 text-[var(--muted-foreground)]" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--duo-red)]/10 border border-[var(--duo-red)]/30">
              <p className="text-sm text-[var(--duo-red)] text-center">
                {error}
              </p>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full btn-3d btn-3d-blue py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>ĐĂNG NHẬP</span>
            )}
          </button>

          {/* Info */}
          <p className="text-xs text-[var(--muted-foreground)] text-center mt-4">
            Sử dụng tài khoản cổng thông tin sinh viên TVU
          </p>
        </div>
      </div>
    </Page>
  );
}

export default TvuLoginPage;
