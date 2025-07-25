import Link from "next/link";
import React, { ComponentProps } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";

export interface Testimonial {
  id: string | number;
  name: string;
  designation: string;
  company: string;
  testimonial: string;
  avatar: string;
}

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => (
  <div className="flex flex-col gap-4 size-full items-center justify-center">
    {/* Desktop: Horizontal marquee (hidden on small screens) */}
    <div className="hidden xl:block w-full">
      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent autoFill={false} loop={1000} pauseOnHover={true} direction="left">
          {testimonials.map((testimonial) => (
            <MarqueeItem key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>

    {/* Mobile: Vertical marquee (hidden on large screens) */}
    <div className="xl:hidden w-full flex flex-wrap gap-4 justify-center">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="min-w-0 w-full max-w-sm bg-accent rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="#" target="_blank">
            <TwitterLogo className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-[17px]">{testimonial.testimonial}</p>
    </div>
  );
};

const TwitterLogo = (props: ComponentProps<"svg">) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>X</title>
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  </svg>
);

export default Testimonials;
