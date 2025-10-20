"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billings",
    url: "/billings",
    icon: CreditCard,
  },
];

const project = [
  {
    name: "Project - 1",
  },
  {
    name: "Project - 2",
  },
  {
    name: "Project - 3",
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/logo-2.png" alt="logo" width={60} height={60} />
          {open && (
            <h1 className="text-primary/80 text-xl font-bold">RepoSensAI</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn({
                      "!bg-primary !text-white": pathname === item.url,
                    })}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {project.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <div>
                      <div
                        className={cn(
                          "text-primary flex size-6 items-center justify-center rounded-sm border bg-white text-sm",
                          {
                            "bg-primary text-white": true,
                            // "bg-primary text-white": project.id = project.id
                          },
                        )}
                      >
                        {item.name[0]}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="h2"></div>
              <SidebarMenuItem>
                <Link href="/create">
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus />
                    {open && "Create Project"}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
