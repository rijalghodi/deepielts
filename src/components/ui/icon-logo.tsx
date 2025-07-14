// components/icons/MyIcon.tsx
import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
   size?: number | string;
   className?: string;
   color?: string;
   dark?: boolean;
}

export const IconLogo = React.forwardRef<SVGSVGElement, IconProps>(({ size = 80, dark = false, ...props }, ref) => (
   <svg viewBox="0 0 21 21" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <g
         fill="none"
         fillRule="evenodd"
         // className="stroke-black dark:stroke-white"
         stroke={dark ? "#ffffff" : "#000000"}
         strokeLinecap="round"
         strokeLinejoin="round"
         transform="translate(3 3)"
      >
         <path d="m2.5.5h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2v-10c0-1.1045695.8954305-2 2-2z" />

         <path d="m4.5 7.5 2 2 4-4" />
      </g>
   </svg>
));

IconLogo.displayName = "IconLogo";
