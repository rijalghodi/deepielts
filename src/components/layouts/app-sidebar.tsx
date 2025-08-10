import { Edit, History, LogOut, Palette, PieChart, Settings } from "lucide-react";
import Link from "next/link";

import { useLogout } from "@/lib/api/auth.api";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemDiv,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const QUICK_MENU = [
  {
    title: "New Check",
    icon: () => <Edit />,
    href: "/",
  },
  {
    title: "Progress",
    icon: () => <PieChart />,
    href: "/dashboard",
  },
  {
    title: "History",
    icon: () => <History />,
    href: "/dashboard#history",
  },
];

type AppSidebarProps = {
  userName?: string;
};

export function AppSidebar(props: AppSidebarProps) {
  const { logout } = useLogout();
  return (
    <Sidebar collapsible="icon" className="shadow-md bg-sidebar">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="flex-1">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <p className="truncate text-left font-medium">{props.userName ?? "User"}</p>
                    <p className="text-xs text-muted-foreground">Free Plan</p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px]" align="start" side="right" sideOffset={10}>
                <DropdownMenuItem>
                  <Settings /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItemDiv className="h-9">
                  <Palette /> Theme
                  <DropdownMenuShortcut>
                    <ThemeToggle variant="horizontal" />
                  </DropdownMenuShortcut>
                </DropdownMenuItemDiv>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarRail />
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {QUICK_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
