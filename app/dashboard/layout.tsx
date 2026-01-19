"use client";

import type React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar";
import { ChatbotFAB } from "@/components/chatbot-fab";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import Image from "next/image";
import blackIconUrl from "@/public/black.svg";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Loader2, ShieldX } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia>
            <Loader2 className="size-12 text-primary animate-spin" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Loading</EmptyTitle>
            <EmptyDescription>Please wait while we verify your access...</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex justify-center gap-1">
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-2 bg-primary/60 rounded-full animate-bounce" />
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon" className="size-16 bg-destructive/10">
            <ShieldX className="size-8 text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Access Denied</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have permission to view this page. Please sign in to continue.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="mr-2" size="lg" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Participation Hub</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
          <Link href="/dashboard" className="flex flex-row items-center gap-2">
            <Image src={blackIconUrl} alt="Logo" className="size-12" />
            <span className="font-semibold text-xl">Participation Hub</span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
        <ChatbotFAB />
      </SidebarInset>
    </SidebarProvider>
  );
}
