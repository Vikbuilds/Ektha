"use client";

import { Menu, X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  showSearch?: boolean;
}

const Header = ({ showSearch = true }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => pathname === path;

  // Search query logic
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) return [];
      const { data, error } = await supabase
        .from("shlokas")
        .select(`
          id,
          code,
          shloka_number,
          sanskrit,
          transliteration,
          translation_english,
          chapter:chapter_id (
            chapter_number,
            name_english,
            section:section_id (
              name_english,
              book:book_id (
                name_english,
                code
              )
            )
          )
        `)
        .or(`sanskrit.ilike.%${searchQuery}%,translation_english.ilike.%${searchQuery}%,transliteration.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length >= 3,
  });

  // Shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Listen for custom open-ektha-search event
  useEffect(() => {
    const handleOpenSearch = () => setOpen(true);
    window.addEventListener("open-ektha-search", handleOpenSearch);
    return () => window.removeEventListener("open-ektha-search", handleOpenSearch);
  }, []);

  // Scroll detection for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header when scrolling down and past threshold
        setHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearchSelect = (shlokaCode: string) => {
    setOpen(false);
    router.push(`/shlokas/${shlokaCode}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full py-4 px-4 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{
        transition: headerVisible
          ? 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="max-w-4xl mx-auto flex h-24 items-center justify-between px-4 rounded-full bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-white/10 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Ektha"
            width={55}
            height={55}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* Center: Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 items-center gap-2 hidden lg:flex">
          <Link
            href="/contents"
            className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${isActive('/contents')
              ? 'text-black bg-muted/50 dark:text-white'
              : 'text-black hover:text-black hover:bg-muted/50 dark:text-white dark:hover:text-white'
              }`}
          >
            Explore
          </Link>
          <Link
            href="/structure"
            className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${isActive('/structure')
              ? 'text-black bg-muted/50 dark:text-white'
              : 'text-black hover:text-black hover:bg-muted/50 dark:text-white dark:hover:text-white'
              }`}
          >
            Structure
          </Link>
          <Link
            href="/preface"
            className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${isActive('/preface')
              ? 'text-black bg-muted/50 dark:text-white'
              : 'text-black hover:text-black hover:bg-muted/50 dark:text-white dark:hover:text-white'
              }`}
          >
            Preface
          </Link>
        </nav>

        {/* Right: Icons and Buttons */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search Trigger */}
          {showSearch && (
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-full transition-all duration-300 hover:bg-muted/50 bg-muted/30 group"
              aria-label="Search scriptures"
            >
              <Search className="h-4 w-4 text-foreground transition-transform group-hover:scale-110" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full transition-all duration-300 hover:bg-muted/50 bg-muted/30"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-foreground transition-transform duration-200" />
            ) : (
              <svg className="h-4 w-4 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>

          {/* Theme Toggle */}
          <AnimatedThemeToggler className="p-2 rounded-full transition-all duration-300 hover:bg-muted/50 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-foreground" />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden mt-2 mx-2 p-3 rounded-2xl bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-white/10 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen
          ? 'opacity-100 max-h-80 translate-y-0'
          : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <nav className="flex flex-col gap-1">
          {showSearch && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setOpen(true);
              }}
              className="flex items-center justify-center gap-2 text-base font-medium px-4 py-3 rounded-xl bg-primary/10 text-primary mb-1 transition-colors hover:bg-primary/20"
            >
              <Search className="h-4 w-4" />
              Search Scriptures
            </button>
          )}
          <Link
            href="/contents"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium transition-all duration-200 px-4 py-3 rounded-xl text-center transform ${mobileMenuOpen ? 'translate-x-0 opacity-100 delay-100' : '-translate-x-4 opacity-0'
              } ${pathname === '/contents'
                ? 'text-primary font-semibold bg-primary/10'
                : 'text-foreground hover:bg-muted/30'
              }`}
          >
            Explore
          </Link>
          <Link
            href="/structure"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium transition-all duration-200 px-4 py-3 rounded-xl text-center transform ${mobileMenuOpen ? 'translate-x-0 opacity-100 delay-150' : '-translate-x-4 opacity-0'
              } ${pathname === '/structure'
                ? 'text-primary font-semibold bg-primary/10'
                : 'text-foreground hover:bg-muted/30'
              }`}
          >
            Structure
          </Link>
          <Link
            href="/preface"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium transition-all duration-200 px-4 py-3 rounded-xl text-center transform ${mobileMenuOpen ? 'translate-x-0 opacity-100 delay-200' : '-translate-x-4 opacity-0'
              } ${pathname === '/preface'
                ? 'text-primary font-semibold bg-primary/10'
                : 'text-foreground hover:bg-muted/30'
              }`}
          >
            Preface
          </Link>
        </nav>
      </div>

      {/* Global Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search by keyword, shloka, or translation..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="max-h-[70vh]">
          {isSearching && (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground animate-in fade-in zoom-in duration-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Searching archives...</span>
            </div>
          )}

          {!isSearching && searchQuery.length > 0 && searchQuery.length < 3 && (
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground animate-in fade-in duration-300">
              Please enter at least 3 characters to search.
            </CommandEmpty>
          )}

          {!isSearching && searchQuery.length >= 3 && searchResults?.length === 0 && (
            <CommandEmpty className="py-10 text-center animate-in fade-in duration-300 px-4">
              <div className="flex flex-col items-center gap-2">
                <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium">No shlokas found matching "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground">Try searching with different keywords like "Arjuna", "Dharma", or "Yoga".</p>
              </div>
            </CommandEmpty>
          )}

          {!isSearching && searchResults && searchResults.length > 0 && (
            <CommandGroup heading="Verses found in Archives" className="p-2">
              {searchResults.map((result: any) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSearchSelect(result.code)}
                  className="p-3 mb-1 cursor-pointer rounded-xl transition-all duration-200 border border-transparent hover:border-primary/20 hover:bg-primary/5 group"
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        {result.chapter.section.book.name_english} {result.chapter.chapter_number}.{result.shloka_number}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-english uppercase tracking-wider group-hover:text-foreground/70 transition-colors">
                        {result.chapter.name_english}
                      </span>
                    </div>
                    <p className="text-sm font-sanskrit leading-relaxed line-clamp-1 group-hover:text-foreground transition-colors">
                      {result.sanskrit}
                    </p>
                    <p className="text-xs text-muted-foreground font-english italic line-clamp-2 leading-relaxed group-hover:text-foreground/60 transition-colors">
                      {result.translation_english}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Header;
