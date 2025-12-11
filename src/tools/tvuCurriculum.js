import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuCurriculum(params) {
  const { userId } = params;

  if (!userId) return { success: false, error: "Thiếu userId" };

  try {
    const response = await tvuRequest(userId, "/api/sch/w-locdsctdtsinhvien", {
      filter: { loai_chuong_trinh_dao_tao: 2 },
      additional: { paging: { limit: 500, page: 1 }, ordering: [] },
    });

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được chương trình đào tạo",
      };
    }

    const d = response.data;
    const nganh = d.ds_nganh_sinh_vien?.[0]?.ten_nganh || "Không xác định";

    const semesters = d.ds_CTDT_hocky.map((hk) => {
      const monDaDat = hk.ds_CTDT_mon_hoc.filter(
        (m) => m.mon_da_dat === "x"
      ).length;
      const tongMon = hk.ds_CTDT_mon_hoc.length;
      return {
        thuTuHocKy: hk.hoc_ky,
        tenHocKy: hk.ten_hoc_ky,
        tienDo: `${monDaDat}/${tongMon}`,
        danhSachMon: hk.ds_CTDT_mon_hoc.map((mon) => ({
          maMon: mon.ma_mon,
          tenMon: mon.ten_mon,
          soTinChi: mon.so_tin_chi,
          daDat: mon.mon_da_dat === "x",
          diemChu: mon.diem_chu || null,
        })),
      };
    });

    const tongMonDaDat = d.ds_CTDT_hocky.reduce(
      (sum, hk) =>
        sum + hk.ds_CTDT_mon_hoc.filter((m) => m.mon_da_dat === "x").length,
      0
    );
    const tongMon = d.ds_CTDT_hocky.reduce(
      (sum, hk) => sum + hk.ds_CTDT_mon_hoc.length,
      0
    );

    return {
      success: true,
      data: {
        nganh,
        tienDoTongThe: `${tongMonDaDat}/${tongMon} môn (${Math.round(
          (tongMonDaDat / tongMon) * 100
        )}%)`,
        danhSachHocKy: semesters,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi lấy chương trình đào tạo: ${error.message}`,
    };
  }
}
