/**
 * TVU Notifications - Thông báo từ nhà trường
 */
import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useTvuStore } from "@/stores/tvu-store";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

function TvuNotificationsPage() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    notifications,
    isLoading,
    loadingAction,
    fetchNotifications,
  } = useTvuStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/tvu-login");
      return;
    }
    if (!notifications) {
      fetchNotifications(30);
    }
  }, [isLoggedIn, notifications, fetchNotifications, navigate]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  return (
    <Page className="bg-background min-h-screen">
      {/* Loading - chỉ hiện khi chưa có data */}
      {isLoading && !notifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--duo-orange)] animate-spin" />
            <p className="text-sm text-foreground">{loadingAction}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-16 pb-4 px-4 bg-gradient-to-r from-[var(--duo-orange)] to-[var(--duo-red)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tvu")}
              className="btn-back-3d w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="font-bold text-xl text-white">Thông báo</h1>
              <p className="text-white/80 text-sm">
                {notifications?.soThongBaoChuaDoc || 0} thông báo chưa đọc
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchNotifications(30)}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28">
        {!notifications?.danhSachThongBao?.length ? (
          <div className="card-3d p-8 text-center">
            <Bell className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="text-[var(--muted-foreground)]">Không có thông báo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.danhSachThongBao.map((notif) => {
              const isExpanded = expandedId === notif.id;

              return (
                <div key={notif.id} className="card-3d overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : notif.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.quanTrong
                            ? "bg-[var(--duo-red)]/20"
                            : notif.daDoc
                            ? "bg-[var(--secondary)]"
                            : "bg-[var(--duo-orange)]/20"
                        }`}
                      >
                        {notif.quanTrong ? (
                          <AlertCircle className="w-5 h-5 text-[var(--duo-red)]" />
                        ) : (
                          <Bell
                            className={`w-5 h-5 ${
                              notif.daDoc
                                ? "text-[var(--muted-foreground)]"
                                : "text-[var(--duo-orange)]"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {notif.quanTrong && (
                            <span className="px-2 py-0.5 rounded-full bg-[var(--duo-red)] text-white text-[10px] font-bold">
                              Quan trọng
                            </span>
                          )}
                          {!notif.daDoc && (
                            <span className="w-2 h-2 rounded-full bg-[var(--duo-orange)]" />
                          )}
                        </div>
                        <p
                          className={`font-bold text-sm ${
                            notif.daDoc
                              ? "text-[var(--muted-foreground)]"
                              : "text-foreground"
                          } line-clamp-2`}
                        >
                          {notif.tieuDe}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
                          <span>{formatDate(notif.ngayGui)}</span>
                          <span>•</span>
                          <span>{notif.nguoiGui}</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Content */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border)] p-4">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {notif.noiDung}
                      </p>
                      {notif.doiTuong && (
                        <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                          Đối tượng: {notif.doiTuong}
                        </p>
                      )}
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

export default TvuNotificationsPage;
