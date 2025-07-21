"use client";

import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";

export type InputPasswordProps = InputProps;

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(({ ...props }, ref) => {
  const [opened, setOpened] = React.useState(false);
  return (
    <Input
      {...props}
      ref={ref}
      type={opened ? "text" : "password"}
      rightSection={
        <Button size="icon-sm" variant="ghost" onClick={() => setOpened((prev) => !prev)}>
          {opened ? <EyeClosed /> : <Eye />}
        </Button>
      }
    />
  );
});

InputPassword.displayName = "InputPassword";

export { InputPassword };
