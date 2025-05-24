import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  redirect(`/user/${params.id}/today`);
}
