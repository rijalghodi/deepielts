"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Foo() {
  const { data } = useQuery({
    queryKey: ["foo"],
    queryFn: async () => {
      const res = await fetch("/api/billing/checkout");
      const data = await res.json();
      return data;
    },
  });
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
