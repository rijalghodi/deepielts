"use client";

import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { IconLogo } from "../ui/icon-logo";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center gap-12">
          <div className="flex items-center gap-1">
            <IconLogo size={64} />
            {/* <span className="font-semibold text-3xl">{APP_NAME}</span> */}
          </div>
          <Loader className="animate-spin w-6 h-6" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar userEmail={user.emailAddresses[0].emailAddress} />
      <main className="px-6 py-2">
        <SidebarTrigger size="icon-lg" />

        {children}
      </main>
    </SidebarProvider>
  );
}
