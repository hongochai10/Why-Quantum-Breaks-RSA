import React, { type ReactNode } from "react";
import { vi } from "vitest";

// Mock framer-motion for jsdom testing
const motion = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      // Return a forwardRef component for any HTML/SVG element
      return React.forwardRef(function MotionComponent(
        props: Record<string, unknown>,
        ref: React.Ref<unknown>
      ) {
        const motionProps = new Set([
          "initial", "animate", "exit", "transition",
          "whileHover", "whileTap", "whileFocus", "whileInView",
          "variants", "layout", "layoutId",
        ]);
        const rest = Object.fromEntries(
          Object.entries(props).filter(([key]) => !motionProps.has(key))
        );
        return React.createElement(prop, { ...rest, ref });
      });
    },
  }
);

function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const useAnimation = () => ({
  start: vi.fn(),
  stop: vi.fn(),
  set: vi.fn(),
});

export { motion, AnimatePresence, useAnimation };
