"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/shop" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Shop
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            About
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
