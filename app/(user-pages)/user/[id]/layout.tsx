"use client";

import React, { ReactNode, useMemo } from "react";
import { useSearchParams, useSelectedLayoutSegments } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { useCategories } from "@/hooks/categories/useCategories";

export default function UserLayout({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  console.log(segments);
  const categoryId = segments?.[2];

  const searchParams = useSearchParams();
  console.log(searchParams);

  const priority = searchParams.get("priority");
  const status = searchParams.get("status");

  const { fetchCategories } = useCategories();
  const { data: categories, isLoading: categoriesLoading } = fetchCategories;

  const { categoryName, title } = useMemo(() => {
    if (!segments || segments.length < 2) {
      return { categoryName: null, title: "" };
    }

    const section = segments[1];

    if (section === "categories") {
      if (!categoryId) {
        return { categoryName: null, title: "Categories" };
      }

      // If categories are still loading, show a loading state but don't delay
      if (categoriesLoading) {
        return { categoryName: "Loading...", title: "Loading..." };
      }

      // Find category name or use fallback
      const foundCategory = categories?.find((cat) => cat.id === categoryId);
      const name = foundCategory?.name || "Category";

      return { categoryName: name, title: name };
    }

    if (priority) {
      const priorityName = priority.charAt(0).toUpperCase() + priority.slice(1);
      return { categoryName: null, title: `${priorityName}` };
    }
    if (status) {
      const hypenFilteredStatusName = status.replace("-", " ");
      const statusName =
        hypenFilteredStatusName.charAt(0).toUpperCase() +
        hypenFilteredStatusName.slice(1);
      return { categoryName: null, title: `${statusName}` };
    }

    // For other sections
    const formattedTitle = section.charAt(0).toUpperCase() + section.slice(1);
    return { categoryName: null, title: formattedTitle };
  }, [segments, categories, categoryId, categoriesLoading]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <SidebarProvider className="flex">
        <MemoizedSidebar props={{}} />
        <SidebarInset>
          <header className="flex h-24 w-full px-4 py-10 justify-between items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="text-6xl font-semibold capitalize">{title}</div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// Wrap sidebar in memo to avoid re-renders
const MemoizedSidebar = React.memo(AppSidebar);
