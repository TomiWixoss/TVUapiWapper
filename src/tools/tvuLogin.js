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
        userId: result.user_id,
        userName: result.user_name,
        tokenType: result.token_type,
        expiresIn: result.expires_in,
      },
    };
  } catch (error) {
    return { success: false, error: `Đăng nhập thất bại: ${error.message}` };
  }
}
