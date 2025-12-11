/**
 * Thay thế tất cả undefined trong object thành null
 * Firebase Realtime Database không chấp nhận undefined
 */
export function sanitizeForFirebase(obj) {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirebase(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeForFirebase(value);
  }
  return result;
}
