import { SignOutButton } from "@clerk/nextjs";
import { Calendar, CalendarDays, ChevronDown, Inbox, LogOut, Settings, Sun } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const QUICK_MENU = [
  {
    title: "Today",
    url: "/today",
    icon: () => <Sun />,
  },
  {
    title: "This Week",
    url: "/week",
    icon: () => <Calendar />,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: () => <Inbox />,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: () => <CalendarDays />,
  },
];

type AppSidebarProps = {
  userEmail?: string;
};

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center w-full gap-3 justify-between">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex justify-start px-1 w-5/6">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-left">{props.userEmail ?? "User"}</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-sidebar" align="start">
              <DropdownMenuItem>
                <Settings /> Settings
              </DropdownMenuItem>
              <SignOutButton>
                <DropdownMenuItem>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {QUICK_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/* List */}
        <SidebarGroup>
          <SidebarGroupLabel>List</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {QUICK_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
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
      <SidebarFooter />
    </Sidebar>
  );
}
