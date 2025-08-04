"use client";

import { Slot } from "@radix-ui/react-slot";
import { PanelRightIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ASIDE_COOKIE_NAME = "aside_state";
const ASIDE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const ASIDE_WIDTH = "480px";
export const ASIDE_WIDTH_MOBILE = "380px";
const ASIDE_KEYBOARD_SHORTCUT = "b";

type AsideContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleAside: () => void;
};

const AsideContext = React.createContext<AsideContextProps | null>(null);

function useAside() {
  const context = React.useContext(AsideContext);
  if (!context) {
    throw new Error("useAside must be used within an AsideProvider.");
  }

  return context;
}

function AsideProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile(1200);
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the aside.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the aside state.
      document.cookie = `${ASIDE_COOKIE_NAME}=${openState}; path=/; max-age=${ASIDE_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the aside.
  const toggleAside = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the aside.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ASIDE_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleAside();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleAside]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the aside with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<AsideContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleAside,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleAside],
  );

  return (
    <AsideContext.Provider value={contextValue}>
      <div
        data-slot="aside-wrapper"
        style={
          {
            "--aside-width": ASIDE_WIDTH,
            ...style,
          } as React.CSSProperties
        }
        className={cn("group/aside-wrapper flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </AsideContext.Provider>
  );
}

function Aside({
  side = "right",
  variant = "aside",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "aside" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useAside();

  if (collapsible === "none") {
    return (
      <aside
        data-slot="aside"
        className={cn("bg-aside text-aside-foreground flex h-full w-(--aside-width) flex-col", className)}
        {...props}
      >
        {children}
      </aside>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-aside="aside"
          data-slot="aside"
          data-mobile="true"
          className="bg-aside text-aside-foreground w-screen p-0 [&>button]:hidden"
          style={
            {
              "--aside-width": ASIDE_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Aside</SheetTitle>
          </SheetHeader>
          <aside className="flex h-full w-full flex-col">{children}</aside>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className="group peer text-aside-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="aside"
    >
      {/* This is what handles the aside gap on desktop */}
      <div
        data-slot="aside-gap"
        className={cn(
          "relative w-(--aside-width) transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--aside-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--aside-width-icon)",
        )}
      />
      <div
        data-slot="aside-container"
        className={cn(
          "fixed bg-aside inset-y-0 z-10 hidden h-svh w-(--aside-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--aside-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--aside-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--aside-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--aside-width-icon) group-data-[side=left]:border-l group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-aside="aside"
          data-slot="aside-inner"
          className={cn(
            "group-data-[variant=floating]:border-aside-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}

function AsideHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 px-4 py-3", className)}
      {...props}
    />
  );
}

function AsideFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 px-4 py-3", className)}
      {...props}
    />
  );
}

function AsideTrigger({
  className,
  onClick,
  asChild,
  ...props
}: React.ComponentProps<typeof Button> & { asChild?: boolean }) {
  const { toggleAside } = useAside();

  if (asChild) {
    return (
      <Slot
        data-aside="trigger"
        data-slot="aside-trigger"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          toggleAside();
        }}
        {...props}
      />
    );
  }

  return (
    <Button
      data-aside="trigger"
      data-slot="aside-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleAside();
      }}
      {...props}
    >
      <PanelRightIcon />
      <span className="sr-only">Toggle Aside</span>
    </Button>
  );
}

function AsideRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleAside } = useAside();

  return (
    <button
      data-aside="rail"
      data-slot="aside-rail"
      aria-label="Toggle Aside"
      tabIndex={-1}
      onClick={toggleAside}
      title="Toggle Aside"
      className={cn(
        "hover:after:bg-aside-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:-left-4 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-aside group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function AsideInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="aside-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:mr-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-2",
        className,
      )}
      {...props}
    />
  );
}

function AsideContent({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-0 flex-col gap-2 overflow-auto">{children}</div>;
}

export { Aside, AsideContent, AsideFooter, AsideHeader, AsideInset, AsideProvider, AsideRail, AsideTrigger, useAside };
