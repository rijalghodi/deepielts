import Link from "next/link";
import type React from "react";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants/brand";

import { IconLogo } from "../ui/icon-logo";

type Props = {
   children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
   return (
      <main className="flex min-h-screen w-screen">
         {/* Side decoration */}
         <div className="h-screen flex-1 bg-foreground text-background hidden lg:flex flex-col justify-between p-10">
            <Link href="/" className="flex gap-2 items-center">
               <IconLogo size={28} dark />
               <span className="text-2xl font-semibold">{APP_NAME}</span>
            </Link>
            <div className="flex flex-col gap-2">
               <p className="text-xl">{APP_TAGLINE}.</p>
            </div>
         </div>
         <div className="flex-1">{children}</div>
      </main>
   );
}
