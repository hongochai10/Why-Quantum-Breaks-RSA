import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Suppress unhandled rejections from async component cleanup
// (e.g., ShorPanel's simulation loop running after unmount)
const originalListeners = process.listeners("unhandledRejection");
process.removeAllListeners("unhandledRejection");
process.on("unhandledRejection", (reason) => {
  // Silence errors from unmounted components accessing stale state
  if (
    reason instanceof TypeError &&
    reason.message.includes("Cannot read properties of undefined")
  ) {
    return;
  }
  // Re-throw other unhandled rejections
  for (const listener of originalListeners) {
    (listener as (reason: unknown) => void)(reason);
  }
});

afterEach(() => {
  cleanup();
});
