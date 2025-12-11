import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuSchedule(params) {
  const { userId, hocKy } = params;

  if (!userId) return { success: false, error: "Thiếu userId" };
  if (!hocKy) return { success: false, error: "Thiếu mã học kỳ (hocKy)" };

  try {
    const response = await tvuRequest(
      userId,
      "/api/sch/w-locdstkbtuanusertheohocky",
      {
        filter: { hoc_ky: hocKy, ten_hoc_ky: "" },
        additional: {
          paging: { limit: 100, page: 1 },
          ordering: [{ name: null, order_type: null }],
        },
      }
    );

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được thời khóa biểu",
      };
    }

    const thuMap = {
      2: "Thứ 2",
      3: "Thứ 3",
      4: "Thứ 4",
      5: "Thứ 5",
      6: "Thứ 6",
      7: "Thứ 7",
      8: "Chủ nhật",
    };

    const weeks = response.data.ds_tuan_tkb.map((week) => ({
      tuanHocKy: week.tuan_hoc_ky,
      ngayBatDau: week.ngay_bat_dau,
      ngayKetThuc: week.ngay_ket_thuc,
      lichHoc: week.ds_thoi_khoa_bieu.map((item) => ({
        maMon: item.ma_mon,
        tenMon: item.ten_mon,
        thu: thuMap[item.thu_kieu_so] || `Thứ ${item.thu_kieu_so}`,
        tietBatDau: item.tiet_bat_dau,
        soTiet: item.so_tiet,
        phong: item.ten_phong || item.ma_phong,
        giangVien: item.ten_giang_vien,
      })),
    }));

    return { success: true, data: { hocKy, danhSachTuan: weeks } };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi lấy thời khóa biểu: ${error.message}`,
    };
  }
}
