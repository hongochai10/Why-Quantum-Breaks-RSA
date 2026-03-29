import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)",
          borderRadius: "36px",
        }}
      >
        {/* Outer orbital ring */}
        <div
          style={{
            position: "absolute",
            width: "140px",
            height: "60px",
            border: "3px solid rgba(6, 182, 212, 0.5)",
            borderRadius: "50%",
            transform: "rotate(-30deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "140px",
            height: "60px",
            border: "3px solid rgba(139, 92, 246, 0.5)",
            borderRadius: "50%",
            transform: "rotate(30deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "60px",
            height: "140px",
            border: "3px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "50%",
          }}
        />
        {/* Central nucleus */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#0a0a12",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
