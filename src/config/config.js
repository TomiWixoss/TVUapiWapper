import "dotenv/config";

export const CONFIG = {
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    serviceAccountPath:
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json",
  },
  server: {
    port: process.env.PORT || 3000,
  },
  tvu: {
    timeoutMs: 15000,
    retryLimit: 2,
  },
};
