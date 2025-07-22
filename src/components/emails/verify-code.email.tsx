import * as React from "react";

import { APP_NAME } from "@/lib/constants";

interface EmailTemplateProps {
  firstName?: string;
  code: string;
}

export function VerifyCodeEmail({ code }: EmailTemplateProps) {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "40px auto",
        background: "#fff",
        padding: "40px 32px",
        borderRadius: "12px",
        boxShadow: "0 0 2px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px", fontWeight: "700", color: "#000" }}>
        <span style={{ color: "#0043ff" }}>{APP_NAME}</span>
      </h1>
      <p style={{ fontSize: "18px", fontWeight: "600", margin: "24px 0 8px" }}>Your login code for {APP_NAME}</p>
      <p style={{ fontSize: "14px", color: "#555" }}>
        Copy and paste this code, this code will only be valid for the next 5 minutes.
      </p>

      <div
        style={{
          margin: "24px 0",
          background: "#f1f3f6",
          padding: "24px",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          borderRadius: "8px",
        }}
      >
        {code}
      </div>

      <p style={{ fontSize: "13px", color: "#888", marginTop: "32px" }}>
        If you didn't request a login, don't worry. You can safely ignore this email.
      </p>
    </div>
  );
}
