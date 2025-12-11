/**
 * TVU Schedule - Thời khóa biểu
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!semesters) {
      fetchSemesters();
    }
  }, [isLoggedIn, semesters, fetchSemesters, navigate]);

  useEffect(() => {
    if (semesters && !currentSchedule) {
      fetchSchedule(semesters.hocKyHienTai);
    }
  }, [semesters, currentSchedule, fetchSchedule]);

  // Find current week
  useEffect(() => {
    if (currentSchedule?.danhSachTuan) {
      const today = new Date();
      const currentWeekIndex = currentSchedule.danhSachTuan.findIndex(
        (week) => {
          const start = new Date(week.ngayBatDau);
          const end = new Date(week.ngayKetThuc);
          return today >= start && today <= end;
        }
      );
      if (currentWeekIndex >= 0) {
        setSelectedWeek(currentWeekIndex);
      }
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
          <div>
            <h1 className="font-bold text-xl text-white">Thời khóa biểu</h1>
            <p className="text-white/80 text-sm">
              {semesters?.danhSachHocKy?.find(
                (s) => s.maHocKy === semesters.hocKyHienTai
              )?.tenHocKy || "Học kỳ hiện tại"}
            </p>
          </div>
        </div>

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
