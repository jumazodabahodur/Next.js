import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { StoreProvider } from "@/store/provider";
import QueryProvider from "@/store/query-provider";
import { ThemeProvider } from "@/store/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Todo - Premium Task Management",
  description: "A minimalist and beautiful todo application built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white min-h-screen transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <StoreProvider>
              <NextIntlClientProvider messages={messages}>
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-100 dark:from-brand-primary/20 dark:via-slate-900 dark:to-[#030712] transition-colors duration-500" />
                {children}
              </NextIntlClientProvider>
            </StoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
