"use client";

import * as React from "react";
import {
  Bot,
  CalendarDays,
  ChevronsRight,
  Command,
  Frame,
  LifeBuoy,
  ListTodo,
  Send,
  SquareTerminal,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

import { NavLabels } from "@/components/layout/sidebar/nav-labels";
import { NavTasks } from "@/components/layout/sidebar/nav-tasks";
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getUserDetails } from "@/hooks/user/getUserDetails";
import { useCategories } from "@/hooks/categories/useCategories";
import { Category } from "@/types/Task";

function AppSidebarComponent(props: React.ComponentProps<typeof Sidebar>) {
  const { getId } = getUserDetails();
  const userId = getId.data;

  const { fetchCategories } = useCategories();
  const { data: categories } = fetchCategories;

  const dynamicCategories = React.useMemo(() => {
    return (
      categories?.map((category: Category) => ({
        title: category.name,
        url: `/user/${userId}/categories/${category.id}`,
      })) ?? []
    );
  }, [categories, userId]);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    labels: [
      {
        title: "Priority",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          { title: "High", url: "#" },
          { title: "Moderate", url: "#" },
          { title: "Low", url: "#" },
        ],
      },
      {
        title: "Status",
        url: "#",
        icon: Bot,
        items: [
          { title: "Done", url: "#" },
          { title: "In Progress", url: "#" },
          { title: "In Review", url: "#" },
          { title: "On Hold", url: "#" },
          { title: "To Do", url: "#" },
          { title: "Waiting", url: "#" },
          { title: "Stuck", url: "#" },
        ],
      },
      {
        title: "Categories",
        url: "#",
        icon: Frame,
        items: dynamicCategories,
      },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: LifeBuoy },
      { title: "Feedback", url: "#", icon: Send },
    ],
    tasks: [
      {
        name: "Upcoming",
        url: `/user/${userId}/upcoming`,
        icon: ChevronsRight,
      },
      { name: "Today", url: `/user/${userId}/today`, icon: ListTodo },
      { name: "Calendar", url: `/user/${userId}/calendar`, icon: CalendarDays },
      { name: "Sticky Wall", url: "#", icon: StickyNote },
    ],
  };

  return (
    <Sidebar variant="inset" {...props} className="border-r bg-secondary">
      <SidebarHeader className="bg-secondary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ToDo App</span>
                  <span className="truncate text-xs">Supabase</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-secondary scroll-smooth">
        <NavTasks tasks={data.tasks} />
        <NavLabels items={data.labels} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <ThemeSwitcher />
      </SidebarContent>
      <SidebarFooter className="bg-secondary">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

// Only re-render sidebar if props actually change
export const AppSidebar = React.memo(AppSidebarComponent);
