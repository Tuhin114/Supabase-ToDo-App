// app/(public)/layout.tsx
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center gap-10">
      <nav className="w-full border-b h-16 flex items-center px-12">
        <Link href="/" className="text-2xl font-bold">
          ToDo
        </Link>
        <div className="ml-auto text-sm">
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </nav>

      <div className="flex-1 w-full flex flex-col gap-20 items-center p-5">
        {children}
      </div>

      <footer className="w-full border-t text-center text-xs py-8">
        <p>Powered by Supabase</p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
