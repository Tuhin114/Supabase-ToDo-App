"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CalendarDays,
  ChevronsRight,
  Command,
  Frame,
  LifeBuoy,
  ListTodo,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  StickyNote,
} from "lucide-react";

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
        {
          title: "High",
          url: "#",
        },
        {
          title: "Moderate",
          url: "#",
        },
        {
          title: "Low",
          url: "#",
        },
      ],
    },
    {
      title: "Status",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Done",
          url: "#",
        },
        {
          title: "In Progress",
          url: "#",
        },
        {
          title: "In Review",
          url: "#",
        },
        {
          title: "On Hold",
          url: "#",
        },
        {
          title: "To Do",
          url: "#",
        },
        {
          title: "Waiting",
          url: "#",
        },
        {
          title: "Stuck",
          url: "#",
        },
      ],
    },
    {
      title: "Tags",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Design",
          url: "#",
        },
        {
          title: "Development",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
    {
      title: "Lists",
      url: "#",
      icon: Frame,
      items: [
        {
          title: "Work",
          url: "#",
        },
        {
          title: "Personal",
          url: "#",
        },
        {
          title: "Projects",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  tasks: [
    {
      name: "Upcoming",
      url: "#",
      icon: ChevronsRight,
    },
    {
      name: "Today",
      url: "#",
      icon: ListTodo,
    },
    {
      name: "Calendar",
      url: "#",
      icon: CalendarDays,
    },
    {
      name: "Sticky Wall",
      url: "#",
      icon: StickyNote,
    },
  ],
  lists: [
    {
      name: "Work",
      url: "#",
    },
    {
      name: "Personal",
      url: "#",
    },
    {
      name: "Projects",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="border-r bg-secondary">
      <SidebarHeader className="bg-secondary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ToDo App</span>
                  <span className="truncate text-xs">Supabase</span>
                </div>
              </a>
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
