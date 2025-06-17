
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, UploadCloud, History, Menu, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

const navItems = [
  { href: '/', label: 'Case Assessment', icon: FileText },
  { href: '/upload', label: 'Document Upload', icon: UploadCloud },
  { href: '/audit', label: 'Audit Trail', icon: History },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    <nav className={cn("flex flex-col gap-2", isMobile ? "p-4" : "p-4")}>
      {navItems.map((item) => (
        <Button
          key={item.label}
          asChild
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className={cn(
            "w-full justify-start",
            pathname === item.href 
              ? "bg-primary/90 text-primary-foreground hover:bg-primary" 
              : "hover:bg-primary/10",
            isMobile ? "text-lg py-3" : ""
          )}
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-card">
        <div className="flex items-center h-16 border-b px-6">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-xl font-bold text-primary font-headline">OncoAssist</h1>
        </div>
        <NavLinks />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex items-center h-16 border-b px-6">
                <Stethoscope className="h-8 w-8 text-primary" />
                <h1 className="ml-2 text-xl font-bold text-primary font-headline">OncoAssist</h1>
              </div>
              <NavLinks isMobile={true} />
            </SheetContent>
          </Sheet>
          {/* Placeholder for User Profile / Settings if needed */}
          {/* <UserNav /> */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
