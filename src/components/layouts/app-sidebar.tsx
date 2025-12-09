import { CreditCard, Edit, LogOut, PieChart, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSettingsDialog } from "@/components/settings/settings-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks";
import { useLogout } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/contexts/auth-context";

import { Badge } from "../ui/badge";

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
];

type AppSidebarProps = {
  userName?: string;
};

export function AppSidebar(props: AppSidebarProps) {
  const { logout } = useLogout();
  const { user } = useAuth();
  const settingsDialog = useSettingsDialog();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" className="shadow-md bg-sidebar">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="flex-1">
                  <div className="space-y-1 flex-1">
                    <p className="truncate text-left font-medium">{props.userName ?? "User"}</p>
                    {user?.activeSubscription ? (
                      <Badge variant="light" className="text-success bg-success/10">
                        Pro Plan
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-neutral bg-neutral/10">
                        Free Plan
                      </Badge>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[240px]"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={10}
              >
                <DropdownMenuItem onClick={() => settingsDialog.open()}>
                  <Settings /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/billing")}>
                  <CreditCard /> Billing
                </DropdownMenuItem>
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {QUICK_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
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
