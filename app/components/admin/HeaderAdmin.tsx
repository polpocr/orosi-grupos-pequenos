"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";

interface HeaderAdminProps {
  title?: string;
}

export default function HeaderAdmin({ title = "Dashboard" }: HeaderAdminProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1C1B1B] border-b border-[#2A2929] px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-slate-400 hover:text-white hover:bg-[#2A2929]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-[#0F0F0F] border-[#2A2929]">
              <Sidebar onClose={() => setOpen(false)} isMobile={true} />
            </SheetContent>
          </Sheet>

          <h1 className="text-base sm:text-2xl font-bold text-white">{title}</h1>
        </div>

        {/* Right side - User button */}
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
