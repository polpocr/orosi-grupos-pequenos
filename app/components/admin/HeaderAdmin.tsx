"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

interface HeaderAdminProps {
  title?: string;
}

export default function HeaderAdmin({ title = "Dashboard" }: HeaderAdminProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-dark border-b border-slate-200 dark:border-dark px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-border"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-slate-100 dark:bg-dark-sidebar border-slate-200 dark:border-dark-border">
              <Sidebar onClose={() => setOpen(false)} isMobile={true} />
            </SheetContent>
          </Sheet>

          <h1 className="text-base sm:text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>

        {/* Right side - Theme toggle + User button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
