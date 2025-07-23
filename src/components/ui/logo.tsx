import Image from "next/image";
import { useTheme } from "next-themes";

import logoDark from "~/logo-dark.png";
import logoLight from "~/logo-light.png";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function Logo({ width = 100, height = 100 }: LogoProps) {
  const { theme } = useTheme();
  return <Image src={theme === "dark" ? logoDark : logoLight} alt="Logo" width={width} height={height} />;
}
