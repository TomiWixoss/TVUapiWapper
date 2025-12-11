import { tvuLogin } from "../services/tvuClient.js";

export async function executeTvuLogin(params) {
  const { username, password } = params;

  if (!username || !password) {
    return { success: false, error: "Thiếu username hoặc password" };
  }

  try {
    const result = await tvuLogin(username, password);
    return {
      success: true,
      data: {
        message: "Đăng nhập thành công!",
        userId: result.user_id || username,
        userName: result.user_name || username,
        tokenType: result.token_type || "Bearer",
        expiresIn: result.expires_in || 3600,
      },
    };
  } catch (error) {
    return { success: false, error: `Đăng nhập thất bại: ${error.message}` };
  }
}
