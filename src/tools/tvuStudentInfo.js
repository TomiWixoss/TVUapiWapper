import { tvuRequest } from "../services/tvuClient.js";

export async function executeTvuStudentInfo(params) {
  const { userId } = params;

  if (!userId) {
    return {
      success: false,
      error: "Thiếu userId (mã sinh viên đã đăng nhập)",
    };
  }

  try {
    const response = await tvuRequest(
      userId,
      "/api/dkmh/w-locsinhvieninfo",
      {}
    );

    if (!response.result || !response.data) {
      return {
        success: false,
        error: response.message || "Không lấy được thông tin sinh viên",
      };
    }

    const d = response.data;
    return {
      success: true,
      data: {
        maSV: d.ma_sv,
        hoTen: d.ten_day_du,
        gioiTinh: d.gioi_tinh,
        ngaySinh: d.ngay_sinh,
        noiSinh: d.noi_sinh,
        lop: d.lop,
        khoa: d.khoa,
        nganh: d.nganh,
        chuyenNganh: d.chuyen_nganh,
        khoaHoc: d.khoa_hoc,
        heDaoTao: d.he_dao_tao,
        email: d.email,
        dienThoai: d.dien_thoai,
        soCMND: d.so_cmnd,
        trangThai: d.hien_dien_sv,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi lấy thông tin sinh viên: ${error.message}`,
    };
  }
}
