/**
 * TVU Profile - Thông tin sinh viên
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Building,
  Loader2,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuProfilePage() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    studentInfo,
    isLoading,
    loadingAction,
    fetchStudentInfo,
  } = useTvuStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!studentInfo) {
      fetchStudentInfo();
    }
  }, [isLoggedIn, studentInfo, fetchStudentInfo, navigate]);

  const infoItems = studentInfo
    ? [
        { icon: User, label: "Họ tên", value: studentInfo.hoTen },
        { icon: User, label: "MSSV", value: studentInfo.maSV },
        { icon: Calendar, label: "Ngày sinh", value: studentInfo.ngaySinh },
        { icon: User, label: "Giới tính", value: studentInfo.gioiTinh },
        { icon: MapPin, label: "Nơi sinh", value: studentInfo.noiSinh },
        { icon: Mail, label: "Email", value: studentInfo.email },
        { icon: Phone, label: "Điện thoại", value: studentInfo.dienThoai },
        { icon: User, label: "CMND/CCCD", value: studentInfo.soCMND },
        { icon: Building, label: "Lớp", value: studentInfo.lop },
        { icon: Building, label: "Khoa", value: studentInfo.khoa },
        { icon: BookOpen, label: "Ngành", value: studentInfo.nganh },
        {
          icon: BookOpen,
          label: "Chuyên ngành",
          value: studentInfo.chuyenNganh,
        },
        { icon: Calendar, label: "Khóa học", value: studentInfo.khoaHoc },
        { icon: BookOpen, label: "Hệ đào tạo", value: studentInfo.heDaoTao },
        { icon: User, label: "Trạng thái", value: studentInfo.trangThai },
      ]
    : [];

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading - chỉ hiện khi chưa có data */}
      {isLoading && !studentInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-blue)] animate-spin" />
            <p className="text-sm text-foreground">{loadingAction}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-16 pb-6 px-4 bg-gradient-to-r from-[var(--duo-blue)] to-[var(--duo-purple)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/tvu")}
            className="btn-back-3d w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">
              Thông tin sinh viên
            </h1>
            <p className="text-white/80 text-sm">Thông tin cá nhân của bạn</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28 -mt-2">
        {/* Avatar Card */}
        {studentInfo && (
          <div className="card-3d p-6 mb-4 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--duo-blue)] to-[var(--duo-purple)] flex items-center justify-center text-white text-3xl font-bold mb-3">
              {studentInfo.hoTen?.charAt(0) || "S"}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {studentInfo.hoTen}
            </h2>
            <p className="text-[var(--duo-blue)] font-semibold">
              {studentInfo.maSV}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {studentInfo.nganh}
            </p>
          </div>
        )}

        {/* Info List */}
        <div className="space-y-2">
          {infoItems.map((item, index) => (
            <div key={index} className="card-3d p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--duo-blue)]/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[var(--duo-blue)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--muted-foreground)]">
                  {item.label}
                </p>
                <p className="font-semibold text-foreground truncate">
                  {item.value || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export default TvuProfilePage;
