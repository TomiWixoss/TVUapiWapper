/**
 * TVU Tuition - Thông tin học phí
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";

function TvuTuitionPage() {
  const navigate = useNavigate();
  const { isLoggedIn, tuition, isLoading, loadingAction, fetchTuition } =
    useTvuStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!tuition) {
      fetchTuition();
    }
  }, [isLoggedIn, tuition, fetchTuition, navigate]);

  const hasDebt = (tuition?.tongConNoRaw || 0) > 0;

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
      <div
        className={`pt-16 pb-6 px-4 bg-gradient-to-r ${
          hasDebt
            ? "from-[var(--duo-red)] to-[var(--duo-orange)]"
            : "from-[var(--duo-green)] to-[var(--duo-blue)]"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/tvu")}
            className="btn-back-3d w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Học phí</h1>
            <p className="text-white/80 text-sm">Thông tin công nợ học phí</p>
          </div>
        </div>

        {/* Total Debt */}
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {hasDebt ? (
              <AlertCircle className="w-6 h-6 text-white" />
            ) : (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
            <span className="text-white/80 text-sm">
              {hasDebt ? "Tổng công nợ" : "Trạng thái"}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {hasDebt ? tuition?.tongConNo : "Đã đóng đủ"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28 -mt-2">
        {!tuition?.danhSachHocKy?.length ? (
          <div className="card-3d p-8 text-center">
            <CreditCard className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="text-[var(--muted-foreground)]">
              Chưa có dữ liệu học phí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tuition.danhSachHocKy.map((semester, idx) => {
              const semesterHasDebt = semester.raw.conNo > 0;

              return (
                <div key={idx} className="card-3d p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          semesterHasDebt
                            ? "bg-[var(--duo-red)]/20"
                            : "bg-[var(--duo-green)]/20"
                        }`}
                      >
                        {semesterHasDebt ? (
                          <AlertCircle className="w-5 h-5 text-[var(--duo-red)]" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-[var(--duo-green)]" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {semester.tenHocKy}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            semesterHasDebt
                              ? "text-[var(--duo-red)]"
                              : "text-[var(--duo-green)]"
                          }`}
                        >
                          {semester.trangThai}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-[var(--secondary)]">
                      <p className="text-[var(--muted-foreground)] text-xs">
                        Phải thu
                      </p>
                      <p className="font-bold text-foreground">
                        {semester.phaiThu}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--secondary)]">
                      <p className="text-[var(--muted-foreground)] text-xs">
                        Miễn giảm
                      </p>
                      <p className="font-bold text-[var(--duo-blue)]">
                        {semester.mienGiam}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--secondary)]">
                      <p className="text-[var(--muted-foreground)] text-xs">
                        Đã thu
                      </p>
                      <p className="font-bold text-[var(--duo-green)]">
                        {semester.daThu}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--secondary)]">
                      <p className="text-[var(--muted-foreground)] text-xs">
                        Còn nợ
                      </p>
                      <p
                        className={`font-bold ${
                          semesterHasDebt
                            ? "text-[var(--duo-red)]"
                            : "text-[var(--duo-green)]"
                        }`}
                      >
                        {semester.conNo}
                      </p>
                    </div>
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

export default TvuTuitionPage;
