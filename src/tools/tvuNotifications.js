import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuNotifications(params) {
  const { userId, limit = 20 } = params;

  if (!userId) return { success: false, error: "Thiếu userId" };

  try {
    const response = await tvuRequest(userId, "/api/web/w-locdsthongbao", {
      filter: { id: null, is_noi_dung: true, is_web: true },
      additional: {
        paging: { limit, page: 1 },
        ordering: [{ name: "ngay_gui", order_type: 1 }],
      },
    });

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được thông báo",
      };
    }

    const d = response.data;
    const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

    const notifications = d.ds_thong_bao.map((tb) => ({
      id: tb.id,
      tieuDe: tb.tieu_de,
      noiDung: stripHtml(tb.noi_dung).substring(0, 500),
      ngayGui: tb.ngay_gui,
      nguoiGui: tb.nguoi_gui,
      doiTuong: tb.doi_tuong_search,
      daDoc: tb.is_da_doc,
      quanTrong: tb.is_phai_xem,
    }));

    return {
      success: true,
      data: {
        soThongBaoChuaDoc: d.notification,
        danhSachThongBao: notifications,
      },
    };
  } catch (error) {
    return { success: false, error: `Lỗi lấy thông báo: ${error.message}` };
  }
}
