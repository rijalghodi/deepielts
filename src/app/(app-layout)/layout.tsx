import React from "react";

import { AppLayout } from "@/components/layouts/app-layout";
import { AsideProvider } from "@/components/ui/aside";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AsideProvider>
        <AppLayout>{children}</AppLayout>
      </AsideProvider>
    </SidebarProvider>
  );
}
