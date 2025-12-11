/**
 * TVU Curriculum - Chương trình đào tạo
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuCurriculumPage() {
  const navigate = useNavigate();
  const { isLoggedIn, curriculum, isLoading, loadingAction, fetchCurriculum } =
    useTvuStore();
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!curriculum) {
      fetchCurriculum();
    }
  }, [isLoggedIn, curriculum, fetchCurriculum, navigate]);

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading - chỉ hiện khi chưa có data */}
      {isLoading && !curriculum && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-purple)] animate-spin" />
            <p className="text-sm text-foreground">{loadingAction}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-16 pb-6 px-4 bg-gradient-to-r from-[var(--duo-purple)] to-[var(--duo-blue)]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/tvu")}
            className="btn-back-3d w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">
              Chương trình đào tạo
            </h1>
            <p className="text-white/80 text-sm">
              {curriculum?.nganh || "Tiến độ học tập"}
            </p>
          </div>
        </div>

        {/* Progress */}
        {curriculum && (
          <div className="bg-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Tiến độ tổng thể</span>
              <span className="text-white font-bold">
                {curriculum.tienDoTongThe}
              </span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: curriculum.tienDoTongThe.match(/\d+%/)?.[0] || "0%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28 -mt-2">
        {!curriculum?.danhSachHocKy?.length ? (
          <div className="card-3d p-8 text-center">
            <FileText className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Chưa có dữ liệu chương trình đào tạo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {curriculum.danhSachHocKy.map((semester) => {
              const isExpanded = expandedSemester === semester.thuTuHocKy;
              const completedCount = semester.danhSachMon.filter(
                (m) => m.daDat
              ).length;
              const totalCount = semester.danhSachMon.length;
              const progress =
                totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <div
                  key={semester.thuTuHocKy}
                  className="card-3d overflow-hidden"
                >
                  {/* Semester Header */}
                  <button
                    onClick={() =>
                      setExpandedSemester(
                        isExpanded ? null : semester.thuTuHocKy
                      )
                    }
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{
                          background:
                            progress === 100
                              ? "var(--duo-green)"
                              : "var(--duo-purple)",
                        }}
                      >
                        {semester.thuTuHocKy}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">
                          {semester.tenHocKy}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {semester.tienDo} môn hoàn thành
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16">
                        <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--duo-green)] rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--muted-foreground)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)]" />
                      )}
                    </div>
                  </button>

                  {/* Subjects */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border)] p-4 space-y-2">
                      {semester.danhSachMon.map((subject, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl flex items-center gap-3 ${
                            subject.daDat
                              ? "bg-[var(--duo-green)]/10"
                              : "bg-[var(--secondary)]"
                          }`}
                        >
                          {subject.daDat ? (
                            <CheckCircle className="w-5 h-5 text-[var(--duo-green)] shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-sm truncate ${
                                subject.daDat
                                  ? "text-[var(--duo-green)]"
                                  : "text-foreground"
                              }`}
                            >
                              {subject.tenMon}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {subject.maMon} • {subject.soTinChi} TC
                            </p>
                          </div>
                          {subject.diemChu && (
                            <span className="px-2 py-1 rounded-lg bg-[var(--duo-green)] text-white text-xs font-bold">
                              {subject.diemChu}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Page>
  );
}

export default TvuCurriculumPage;
