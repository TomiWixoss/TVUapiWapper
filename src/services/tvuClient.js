/**
 * TVU API Client - Ky-based HTTP client cho TVU Student Portal
 */
import ky from "ky";
import { CONFIG } from "../config/config.js";

const TVU_BASE_URL = "https://ttsv.tvu.edu.vn";

// Token storage per user (userId -> { token, expiry })
const tokenStore = new Map();

const tvuHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Referer: "https://ttsv.tvu.edu.vn",
};

// ═══════════════════════════════════════════════════
// TOKEN MANAGEMENT (per user)
// ═══════════════════════════════════════════════════
export function setTvuToken(userId, token, expiresIn = 3600) {
  tokenStore.set(userId, {
    token,
    expiry: Date.now() + expiresIn * 1000,
  });
  console.log(`[TVU] Token set for user ${userId}, expires in ${expiresIn}s`);
}

export function getTvuToken(userId) {
  const data = tokenStore.get(userId);
  if (data && Date.now() < data.expiry) {
    return data.token;
  }
  tokenStore.delete(userId);
  return null;
}

export function clearTvuToken(userId) {
  tokenStore.delete(userId);
}

// ═══════════════════════════════════════════════════
// KY INSTANCES
// ═══════════════════════════════════════════════════
const tvuPublicApi = ky.create({
  prefixUrl: TVU_BASE_URL,
  timeout: CONFIG.tvu.timeoutMs,
  retry: {
    limit: CONFIG.tvu.retryLimit,
    methods: ["post"],
    statusCodes: [408, 500, 502, 503, 504],
  },
  headers: tvuHeaders,
});

function createAuthenticatedClient(userId) {
  const token = getTvuToken(userId);
  if (!token) {
    throw new Error("Chưa đăng nhập TVU. Vui lòng đăng nhập trước.");
  }

  return ky.create({
    prefixUrl: TVU_BASE_URL,
    timeout: CONFIG.tvu.timeoutMs,
    retry: {
      limit: CONFIG.tvu.retryLimit,
      methods: ["post"],
      statusCodes: [408, 500, 502, 503, 504],
    },
    headers: {
      ...tvuHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// ═══════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════
export async function tvuLogin(username, password) {
  console.log(`[TVU] Logging in as ${username}`);
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  params.append("grant_type", "password");

  const data = await tvuPublicApi
    .post("api/auth/login", {
      body: params.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .json();

  if (data.access_token) {
    setTvuToken(username, data.access_token, data.expires_in || 3600);
  }
  console.log(`[TVU] ✓ Login success for ${username}`);
  return data;
}

export async function tvuRequest(
  userId,
  endpoint,
  body = {},
  extraHeaders = {}
) {
  const client = createAuthenticatedClient(userId);
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  try {
    const data = await client
      .post(path, {
        json: body,
        headers: extraHeaders,
      })
      .json();

    return data;
  } catch (error) {
    // Log chi tiết lỗi
    console.error(`[TVU] Request failed: ${endpoint}`, error.message);
    if (error.response) {
      const text = await error.response.text().catch(() => "");
      console.error(`[TVU] Response:`, text);
    }
    throw error;
  }
}
