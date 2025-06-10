"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export function NavTasks({
  tasks,
}: {
  tasks: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { user, loading, error } = useUser();

  // Handle loading state
  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Tasks</SidebarGroupLabel>
        <div className="p-2 text-sm text-muted-foreground">Loading...</div>
      </SidebarGroup>
    );
  }

  // Handle error state
  if (error) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Tasks</SidebarGroupLabel>
        <div className="p-2 text-sm text-destructive">Error loading user</div>
      </SidebarGroup>
    );
  }

  // Handle no user state
  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {tasks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
