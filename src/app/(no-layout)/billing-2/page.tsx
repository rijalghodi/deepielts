import React from "react";

import { authGetUser } from "@/app/api/auth/auth-middleware";

import Foo from "./foo";

export default async function Billing2Page() {
  const user = await authGetUser();

  if (!user) {
    return <div>User not found</div>;
  }

  return <Foo />;
}
