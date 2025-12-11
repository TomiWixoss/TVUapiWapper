import admin from "firebase-admin";
import { CONFIG } from "../config/config.js";
import { toolExecutors, availableTools } from "../tools/index.js";
import { sanitizeForFirebase } from "../utils/sanitize.js";

let db = null;

export function initFirebase() {
  try {
    const serviceAccount = CONFIG.firebase.serviceAccount;

    if (!serviceAccount) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON không được cấu hình trong .env"
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: CONFIG.firebase.databaseURL,
    });

    db = admin.database();
    console.log("[Firebase] ✓ Initialized successfully");
    console.log("[Firebase] 📍 Database URL:", CONFIG.firebase.databaseURL);
    return db;
  } catch (error) {
    console.error("[Firebase] ✗ Init failed:", error.message);
    throw error;
  }
}

export function getDatabase() {
  return db;
}

// Listen for new commands at /commands/{commandId}
export function startCommandListener() {
  const commandsRef = db.ref("commands");

  console.log("[Firebase] 🎧 Listening for commands at /commands...");

  // Listen for new children added
  commandsRef.on("child_added", async (snapshot) => {
    const commandId = snapshot.key;
    const commandData = snapshot.val();

    // Skip if already processed
    if (commandData.status === "completed" || commandData.status === "error") {
      return;
    }

    console.log(`[Firebase] 📥 New command: ${commandId}`, commandData);
    await processCommand(commandId, commandData);
  });
}

async function processCommand(commandId, commandData) {
  const { action, params = {} } = commandData;
  const commandRef = db.ref(`commands/${commandId}`);

  // Update status to processing
  await commandRef.update({
    status: "processing",
    processedAt: admin.database.ServerValue.TIMESTAMP,
  });

  try {
    // Check if action exists
    if (!action || !toolExecutors[action]) {
      throw new Error(
        `Action không hợp lệ: ${action}. Các action hỗ trợ: ${availableTools.join(
          ", "
        )}`
      );
    }

    // Execute the tool
    console.log(`[Firebase] ⚙️ Executing: ${action}`);
    const result = await toolExecutors[action](params);

    // Write response back to Firebase (sanitize to replace undefined with null)
    await commandRef.update({
      status: result.success ? "completed" : "error",
      response: sanitizeForFirebase(result),
      completedAt: admin.database.ServerValue.TIMESTAMP,
    });

    console.log(
      `[Firebase] ✓ Command ${commandId} completed:`,
      result.success ? "success" : "error"
    );

    // Auto-delete command after 5 seconds
    setTimeout(async () => {
      try {
        await commandRef.remove();
        console.log(`[Firebase] 🗑️ Command ${commandId} deleted`);
      } catch (e) {
        console.error(`[Firebase] Failed to delete command: ${e.message}`);
      }
    }, 5000);
  } catch (error) {
    console.error(`[Firebase] ✗ Command ${commandId} failed:`, error.message);

    await commandRef.update({
      status: "error",
      response: {
        success: false,
        error: error.message,
      },
      completedAt: admin.database.ServerValue.TIMESTAMP,
    });

    // Auto-delete error command after 5 seconds
    setTimeout(async () => {
      try {
        await commandRef.remove();
        console.log(`[Firebase] 🗑️ Command ${commandId} deleted`);
      } catch (e) {
        console.error(`[Firebase] Failed to delete command: ${e.message}`);
      }
    }, 5000);
  }
}

// Helper to write response directly
export async function writeResponse(path, data) {
  await db.ref(path).set(data);
}
