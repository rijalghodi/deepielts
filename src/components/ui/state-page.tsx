import { AlertCircle, Check, FileText, Info } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FallingStarsBackground } from "@/components/ui/falling-stars-bg";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export function StatePage({
  title,
  description,
  icon,
  link,
  linkLabel,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode | "error" | "empty" | "success" | "info";
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className={"relative h-screen overflow-hidden"}>
      <FallingStarsBackground />
      <div className={"absolute inset-0 px-6 flex items-center justify-center"}>
        <div className={"flex flex-col items-center text-center"}>
          {icon === "success" ? (
            <IconWrapper className="bg-success text-success-foreground" size="lg">
              <Check />
            </IconWrapper>
          ) : icon === "error" ? (
            <IconWrapper className="bg-destructive text-destructive-foreground" size="lg">
              <AlertCircle />
            </IconWrapper>
          ) : icon === "empty" ? (
            <IconWrapper className="bg-muted-foreground text-muted-foreground-foreground" size="lg">
              <FileText />
            </IconWrapper>
          ) : icon === "info" ? (
            <IconWrapper className="bg-info text-info-foreground" size="lg">
              <Info />
            </IconWrapper>
          ) : (
            icon
          )}
          <h1 className={"font-semibold text-2xl md:text-3xl mb-6 mt-6 text-foreground"}>{title}</h1>
          <p className={"text-base md:text-lg mb-8 text-muted-foreground"}>{description}</p>
          <Button variant="default" asChild={true}>
            {link ? <Link href={link}>{linkLabel}</Link> : <Link href={"/"}>Go to Home</Link>}
          </Button>
        </div>
      </div>
    </div>
  );
}
