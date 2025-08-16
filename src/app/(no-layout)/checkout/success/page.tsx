import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FallingStarsBackground } from "@/components/ui/falling-stars-bg";
import { IconWrapper } from "@/components/ui/icon-wrapper";

import { authGetUser } from "@/app/api/auth/auth-middleware";

export default async function SuccessPage() {
  const user = await authGetUser();

  return (
    <main>
      <div className={"relative h-screen overflow-hidden"}>
        <FallingStarsBackground />
        <div className={"absolute inset-0 px-6 flex items-center justify-center"}>
          <div className={"flex flex-col items-center text-center"}>
            <IconWrapper className="bg-success text-success-foreground" size="lg">
              <Check />
            </IconWrapper>
            <h1 className={"font-semibold text-3xl md:text-4xl mb-6 mt-6 text-foreground"}>Payment successful</h1>
            <p className={"text-base md:text-lg mb-8 text-muted-foreground"}>
              Success! Your payment is complete, and you're all set.
            </p>
            <Button variant="default" asChild={true}>
              {user ? <Link href={"/dashboard"}>Go to Dashboard</Link> : <Link href={"/"}>Go to Home</Link>}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
