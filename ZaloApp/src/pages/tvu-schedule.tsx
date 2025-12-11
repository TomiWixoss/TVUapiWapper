/**
 * TVU Schedule - Thời khóa biểu
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuSchedulePage() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    semesters,
    currentSchedule,
    isLoading,
    loadingAction,
    fetchSemesters,
    fetchSchedule,
  } = useTvuStore();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!semesters) {
      fetchSemesters();
    }
  }, [isLoggedIn, semesters, fetchSemesters, navigate]);

  // Set default semester when semesters loaded
  useEffect(() => {
    if (semesters && !selectedSemester) {
      setSelectedSemester(semesters.hocKyHienTai);
    }
  }, [semesters, selectedSemester]);

  // Fetch schedule when semester changes
  useEffect(() => {
    if (selectedSemester && semesters) {
      hasInitialized.current = false;
      fetchSchedule(selectedSemester);
    }
  }, [selectedSemester, semesters, fetchSchedule]);

  // Find current week - chỉ chạy 1 lần khi schedule load xong
  useEffect(() => {
    if (currentSchedule?.danhSachTuan && !hasInitialized.current) {
      hasInitialized.current = true;
      const today = new Date();
      const currentWeekIndex = currentSchedule.danhSachTuan.findIndex(
        (week) => {
          const [d1, m1, y1] = week.ngayBatDau.split("/");
          const [d2, m2, y2] = week.ngayKetThuc.split("/");
          const start = new Date(+y1, +m1 - 1, +d1);
          const end = new Date(+y2, +m2 - 1, +d2, 23, 59, 59);
          return today >= start && today <= end;
        }
      );
      setSelectedWeek(currentWeekIndex >= 0 ? currentWeekIndex : 0);
    }
  }, [currentSchedule]);

  const weeks = currentSchedule?.danhSachTuan || [];
  const currentWeekData = weeks[selectedWeek];

  // Group by day
  const scheduleByDay: Record<string, typeof currentWeekData.lichHoc> = {};
  if (currentWeekData?.lichHoc) {
    currentWeekData.lichHoc.forEach((item) => {
      if (!scheduleByDay[item.thu]) {
        scheduleByDay[item.thu] = [];
      }
      scheduleByDay[item.thu].push(item);
    });
  }

  const dayOrder = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const dayColors = [
    "var(--duo-blue)",
    "var(--duo-green)",
    "var(--duo-yellow)",
    "var(--duo-orange)",
    "var(--duo-purple)",
    "var(--duo-red)",
    "var(--duo-blue)",
  ];

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-green)] animate-spin" />
            <p className="text-sm text-foreground">{loadingAction}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-16 pb-4 px-4 bg-gradient-to-r from-[var(--duo-green)] to-[var(--duo-blue)]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/tvu")}
            className="btn-back-3d w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl text-white">Thời khóa biểu</h1>
            {/* Semester Picker */}
            <button
              onClick={() => setShowSemesterPicker(!showSemesterPicker)}
              className="flex items-center gap-1 text-white/90 text-sm mt-1"
            >
              <span>
                {semesters?.danhSachHocKy?.find(
                  (s) => s.maHocKy === selectedSemester
                )?.tenHocKy || "Chọn học kỳ"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Semester Dropdown */}
        {showSemesterPicker && semesters?.danhSachHocKy && (
          <div className="mb-3 bg-white/20 rounded-xl p-2 max-h-48 overflow-y-auto">
            {semesters.danhSachHocKy.map((sem) => (
              <button
                key={sem.maHocKy}
                onClick={() => {
                  setSelectedSemester(sem.maHocKy);
                  setShowSemesterPicker(false);
                  setSelectedWeek(0);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedSemester === sem.maHocKy
                    ? "bg-white/30 text-white font-bold"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {sem.tenHocKy}
                {sem.maHocKy === semesters.hocKyHienTai && (
                  <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">
                    Hiện tại
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Week Selector */}
        {weeks.length > 0 && (
          <div className="flex items-center justify-between bg-white/20 rounded-xl p-2">
            <button
              onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
              disabled={selectedWeek === 0}
              className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="text-center">
              <p className="text-white font-bold">
                Tuần {currentWeekData?.tuanHocKy}
              </p>
              <p className="text-white/80 text-xs">
                {currentWeekData?.ngayBatDau} - {currentWeekData?.ngayKetThuc}
              </p>
            </div>
            <button
              onClick={() =>
                setSelectedWeek(Math.min(weeks.length - 1, selectedWeek + 1))
              }
              disabled={selectedWeek === weeks.length - 1}
              className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28">
        {!currentWeekData?.lichHoc?.length ? (
          <div className="card-3d p-8 text-center">
            <Calendar className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Không có lịch học trong tuần này
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayOrder.map((day, dayIndex) => {
              const classes = scheduleByDay[day];
              if (!classes?.length) return null;

              return (
                <div key={day}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: dayColors[dayIndex] }}
                    />
                    <h3 className="font-bold text-foreground">{day}</h3>
                  </div>
                  <div className="space-y-2">
                    {classes
                      .sort((a, b) => a.tietBatDau - b.tietBatDau)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="card-3d p-4"
                          style={{
                            borderLeft: `4px solid ${dayColors[dayIndex]}`,
                          }}
                        >
                          <h4 className="font-bold text-foreground mb-2">
                            {item.tenMon}
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                              <Clock className="w-4 h-4" />
                              <span>
                                Tiết {item.tietBatDau} -{" "}
                                {item.tietBatDau + item.soTiet - 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                              <MapPin className="w-4 h-4" />
                              <span>{item.phong}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--muted-foreground)] col-span-2">
                              <User className="w-4 h-4" />
                              <span>{item.giangVien}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Page>
  );
}

export default TvuSchedulePage;
