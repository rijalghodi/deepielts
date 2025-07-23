import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

import { APP_DESCRIPTION, APP_KEYWORS, APP_NAME, APP_TAGLINE } from "@/lib/constants/brand";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { DialogSystemProvider } from "@/lib/providers/dialog-system";
import { ReactQueryProvider } from "@/lib/providers/react-query";
import { cn } from "@/lib/utils";

import { AppLayout } from "@/components/layouts/app-layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - ${APP_TAGLINE}`,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORS,
  authors: [
    {
      name: "Rijal Ghodi",
      url: "https://rijalghodi.xyz",
    },
  ],
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontSans.className)}>
        <AuthProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>
                <DialogSystemProvider>
                  <AppLayout>{children}</AppLayout>
                  <Toaster richColors position="bottom-center" />
                </DialogSystemProvider>
              </TooltipProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
