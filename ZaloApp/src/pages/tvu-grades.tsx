/**
 * TVU Grades - Bảng điểm sinh viên
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuGradesPage() {
  const navigate = useNavigate();
  const { isLoggedIn, grades, isLoading, loadingAction, fetchGrades } =
    useTvuStore();
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!grades) {
      fetchGrades();
    }
  }, [isLoggedIn, grades, fetchGrades, navigate]);

  // Latest semester for summary
  const latestSemester = grades?.danhSachHocKy?.[0];

  const getGradeColor = (grade: string) => {
    const g = parseFloat(grade);
    if (g >= 8.5) return "var(--duo-green)";
    if (g >= 7) return "var(--duo-blue)";
    if (g >= 5.5) return "var(--duo-yellow)";
    if (g >= 4) return "var(--duo-orange)";
    return "var(--duo-red)";
  };

  const getLetterGradeColor = (letter: string) => {
    if (["A", "A+"].includes(letter)) return "var(--duo-green)";
    if (["B", "B+"].includes(letter)) return "var(--duo-blue)";
    if (["C", "C+"].includes(letter)) return "var(--duo-yellow)";
    if (["D", "D+"].includes(letter)) return "var(--duo-orange)";
    return "var(--duo-red)";
  };

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-yellow)] animate-spin" />
            <p className="text-sm text-foreground">{loadingAction}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-16 pb-6 px-4 bg-gradient-to-r from-[var(--duo-yellow)] to-[var(--duo-orange)]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/tvu")}
            className="btn-back-3d w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Bảng điểm</h1>
            <p className="text-white/80 text-sm">Kết quả học tập của bạn</p>
          </div>
        </div>

        {/* GPA Summary */}
        {latestSemester && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {latestSemester.diemTBTichLuy.he4}
              </p>
              <p className="text-xs text-white/80">GPA (hệ 4)</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {latestSemester.diemTBTichLuy.he10}
              </p>
              <p className="text-xs text-white/80">GPA (hệ 10)</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {latestSemester.tinChiTichLuy}
              </p>
              <p className="text-xs text-white/80">Tín chỉ</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28 -mt-2">
        {!grades?.danhSachHocKy?.length ? (
          <div className="card-3d p-8 text-center">
            <BookOpen className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Chưa có dữ liệu điểm
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {grades.danhSachHocKy.map((semester) => {
              const isExpanded = expandedSemester === semester.maHocKy;

              return (
                <div key={semester.maHocKy} className="card-3d overflow-hidden">
                  {/* Semester Header */}
                  <button
                    onClick={() =>
                      setExpandedSemester(isExpanded ? null : semester.maHocKy)
                    }
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--duo-yellow)]/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-[var(--duo-yellow)]" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">
                          {semester.tenHocKy}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {semester.danhSachMon.length} môn •{" "}
                          {semester.tinChiDatHK} tín chỉ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-[var(--duo-green)]">
                          {semester.diemTBHocKy.he4}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          GPA
                        </p>
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
                          className="p-3 rounded-xl bg-[var(--secondary)] flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {subject.tenMon}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {subject.maMon} • {subject.soTinChi} TC
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="px-2 py-1 rounded-lg text-white text-sm font-bold"
                              style={{
                                background: getGradeColor(subject.diemTK),
                              }}
                            >
                              {subject.diemTK}
                            </div>
                            <div
                              className="px-2 py-1 rounded-lg text-white text-sm font-bold"
                              style={{
                                background: getLetterGradeColor(
                                  subject.diemChu
                                ),
                              }}
                            >
                              {subject.diemChu}
                            </div>
                          </div>
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

export default TvuGradesPage;
