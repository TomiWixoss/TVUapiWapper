import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuTuition(params) {
  const { userId } = params;

  if (!userId) return { success: false, error: "Thiếu userId" };

  try {
    const response = await tvuRequest(
      userId,
      "/api/rms/w-locdstonghophocphisv",
      {
        filter: {},
        additional: { paging: { limit: 100, page: 1 } },
      }
    );

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được thông tin học phí",
      };
    }

    const formatMoney = (n) => `${n.toLocaleString("vi-VN")} VNĐ`;

    const semesters = response.data.ds_hoc_phi_hoc_ky.map((hk) => ({
      tenHocKy: hk.ten_hoc_ky,
      phaiThu: formatMoney(hk.phai_thu),
      mienGiam: formatMoney(hk.mien_giam),
      daThu: formatMoney(hk.da_thu),
      conNo: formatMoney(hk.con_no),
      trangThai: hk.trang_thai,
      raw: {
        phaiThu: hk.phai_thu,
        mienGiam: hk.mien_giam,
        daThu: hk.da_thu,
        conNo: hk.con_no,
      },
    }));

    const tongConNo = response.data.ds_hoc_phi_hoc_ky.reduce(
      (sum, hk) => sum + hk.con_no,
      0
    );

    return {
      success: true,
      data: {
        tongConNo: formatMoney(tongConNo),
        tongConNoRaw: tongConNo,
        danhSachHocKy: semesters,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi lấy thông tin học phí: ${error.message}`,
    };
  }
}
