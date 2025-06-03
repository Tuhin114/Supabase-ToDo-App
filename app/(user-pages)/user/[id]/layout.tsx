// app/user/[id]/layout.tsx
"use client";

import { ReactNode, useMemo } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  // gives you ['[id]', 'today'] or ['[id]', 'upcoming'], etc.
  const segments = useSelectedLayoutSegments() ?? "";
  // console.log("segments", segments);
  // turn e.g. "today" into "Today"
  const title = useMemo(() => {
    if (!segments) return "";
    return segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
  }, [segments]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <SidebarProvider className="flex">
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-24 w-full px-4 py-10 justify-between items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {title && (
                <div className="text-6xl font-semibold capitalize">{title}</div>
              )}
            </div>
          </header>
          <Separator
            orientation="horizontal"
            className="bg-sidebar-border h-px w-auto"
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
