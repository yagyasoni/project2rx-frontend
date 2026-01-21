"use client";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="text-white absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-foreground rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary-foreground">MedRx.co</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
            Request Demo
          </Button>
          <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 rounded-full px-6">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;