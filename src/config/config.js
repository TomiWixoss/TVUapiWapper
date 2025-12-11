import "dotenv/config";

// Parse service account from env JSON string
function getServiceAccount() {
  const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
        e.message
      );
    }
  }
  return null;
}

export const CONFIG = {
  firebase: {
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      "https://tvuapiwapper-default-rtdb.asia-southeast1.firebasedatabase.app",
    serviceAccount: getServiceAccount(),
  },
  server: {
    port: process.env.PORT || 3000,
  },
  tvu: {
    timeoutMs: 15000,
    retryLimit: 2,
  },
};
