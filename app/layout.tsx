// app/layout.tsx
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactQueryClientProvider } from "@/utils/react-query/ReactQueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = Geist({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.className} bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ReactQueryDevtools initialIsOpen={true} />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
