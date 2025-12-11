import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuSemesters(params) {
  const { userId } = params;

  if (!userId) {
    return {
      success: false,
      error: "Thiếu userId (mã sinh viên đã đăng nhập)",
    };
  }

  try {
    const response = await tvuRequest(userId, "/api/sch/w-locdshockytkbuser", {
      filter: { is_tieng_anh: null },
      additional: {
        paging: { limit: 100, page: 1 },
        ordering: [{ name: "hoc_ky", order_type: 1 }],
      },
    });

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được danh sách học kỳ",
      };
    }

    const d = response.data;
    return {
      success: true,
      data: {
        hocKyHienTai: d.hoc_ky_theo_ngay_hien_tai,
        danhSachHocKy: d.ds_hoc_ky.map((hk) => ({
          maHocKy: hk.hoc_ky,
          tenHocKy: hk.ten_hoc_ky,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi lấy danh sách học kỳ: ${error.message}`,
    };
  }
}
