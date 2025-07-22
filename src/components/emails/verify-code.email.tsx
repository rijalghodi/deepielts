import * as React from "react";

import { APP_NAME } from "@/lib/constants";

interface EmailTemplateProps {
  firstName?: string;
  code: string;
}

export function VerifyCodeEmail({ code }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome to {APP_NAME}!</h1>
      <p>Your verification code is {code}</p>
    </div>
  );
}
