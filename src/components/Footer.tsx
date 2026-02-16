"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, forwardRef } from "react";
import { Linkedin, Coffee } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = forwardRef<HTMLElement>((props, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer
      ref={ref}
      className="relative mt-8 border-t"
      style={{
        borderColor: 'hsl(var(--accent) / 0.5)'
      }}
      {...props}
    >
      {/* Upper Footer Section */}
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Branding Column */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Ektha"
                width={65}
                height={65}
                className="object-contain cursor-pointer"
              />
              <span
                className="text-xl md:text-2xl font-bold font-sanskrit text-foreground transition-colors duration-300 cursor-pointer hover:text-primary dark:hover:text-accent"
              >
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-english">
              Eternal Knowledge & Truth Archives
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground font-english">Developed by Vikas & AIBM Team</span>
            </div>
          </div>

          {/* Right Side Columns */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8 md:mt-0">
            {/* Socials Column */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-semibold text-foreground mb-4 font-english">Socials</h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://x.com/VikasAcharyaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-english"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="shrink-0">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                    <span>X</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/vikasacharyaa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-english"
                  >
                    <Linkedin className="h-[14px] w-[14px] shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-semibold text-foreground mb-4 font-english">Resources</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/preface" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-english">
                    Preface
                  </Link>
                </li>
                <li>
                  <Link href="/structure" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-english">
                    Structure
                  </Link>
                </li>
              </ul>
            </div>

            {/* Buy me a coffee Column */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-semibold text-foreground mb-4 font-english">Support</h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://buymeacoffee.com/vikasdevopp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-english"
                  >
                    <Coffee className="h-[14px] w-[14px] shrink-0" />
                    <span>Buy me a coffee</span>
                  </a>
                </li>
                <li className="pt-2">
                  {mounted && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-sm text-primary hover:text-primary/80 transition-colors font-english font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
                          Fund The Cause
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center font-english italic">Support Ektha</DialogTitle>
                          <DialogDescription className="text-center font-english">
                            Scan to contribute via UPI
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl">
                          <div className="relative w-64 h-64 mb-4">
                            <Image
                              src="/qr code.jpeg"
                              alt="Fund The Cause QR Code"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm font-semibold text-slate-900">Vikas U U</p>
                            <p className="text-xs text-slate-500 font-mono">vikasacharyaa@slc</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </li>
                <li className="pt-4">
                  <span className="text-[10px] text-muted-foreground font-english uppercase tracking-widest opacity-60 block mb-2">Institutional Support</span>
                  <a
                    href="https://aibmckm.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/aibm.png"
                      alt="AIBM College Logo"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mt-12 mb-8 text-center">
          <p className="text-xs text-muted-foreground font-english opacity-70">
            © 2026 Ektha
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
