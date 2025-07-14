import type { Metadata } from "next";

import "./globals.css";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_KEYWORS } from "@/lib/constants/brand";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/lib/providers/react-query";
import { ThemeProvider } from "next-themes";
import { DialogSystemProvider } from "@/lib/providers/dialog-system";
import { Geist } from "next/font/google";

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

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("antialiased", fontSans.className)}>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>
                <DialogSystemProvider>
                  {children}
                  <Toaster richColors position="bottom-center" />
                </DialogSystemProvider>
              </TooltipProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
