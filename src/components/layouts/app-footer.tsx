import { Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

import { APP_NAME, APP_SOCIAL_LINKS } from "@/lib/constants/brand";

export default function AppFooter() {
  return (
    <footer className="w-full bg-background border-t border-border mt-12">
      <div className="max-w-screen-lg mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:underline text-sm">
            Home
          </Link>
          <Link href="/privacy" className="hover:underline text-sm">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline text-sm">
            Terms
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={APP_SOCIAL_LINKS.youtube}
            target="_blank"
            aria-label="YouTube"
            className="text-muted-foreground hover:text-primary"
          >
            <Youtube className="w-5 h-5" />
          </Link>
          <Link
            href={APP_SOCIAL_LINKS.twitter}
            target="_blank"
            aria-label="Twitter"
            className="text-muted-foreground hover:text-primary"
          >
            <Twitter className="w-5 h-5" />
          </Link>
          <Link
            href={APP_SOCIAL_LINKS.instagram}
            target="_blank"
            aria-label="Instagram"
            className="text-muted-foreground hover:text-primary"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
