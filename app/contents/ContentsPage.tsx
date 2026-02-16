"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, Grid, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";


import { useBooks } from "@/hooks/use-books";

export default function ContentsPage() {
  const { data: books = [], isLoading } = useBooks();
  const [viewMode, setViewMode] = useState<"list" | "tiles">("list");

  useEffect(() => {
    const saved = localStorage.getItem("contents-view-mode");
    if (saved === "list" || saved === "tiles") {
      setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contents-view-mode", viewMode);
  }, [viewMode]);

  const handleViewChange = (value: string | null) => {
    if (value && (value === "list" || value === "tiles")) {
      setViewMode(value);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="glow-ambient animate-pulse-slow" />
      <Header />

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-32">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 animate-fade-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Title and View Toggle */}
        <div className="mb-12 animate-fade-up-delay-1">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight text-foreground">
                Read book
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore our collection of ancient texts
              </p>
            </div>
            <div className="flex-shrink-0 pt-2">
              <ToggleGroup type="single" value={viewMode} onValueChange={handleViewChange}>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="tiles" aria-label="Tiles view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div key={viewMode}>
          {viewMode === "list" ? (
            <div className="space-y-8 animate-fade-up-delay-3">
              {books.map((book) => (
                book.sections.length > 0 ? (
                  <Accordion key={book.id} type="single" collapsible className="w-full">
                    <AccordionItem value={book.id} className="border-b border-border">
                      <AccordionTrigger className="hover:no-underline items-center">
                        <div className="text-left flex-1">
                          <Link
                            href={book.placeholderLink}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block"
                          >
                            <h2 className="text-4xl font-sanskrit text-foreground mb-2 hover:text-primary transition-colors inline-block">
                              {book.name_hindi}
                            </h2>
                          </Link>
                          <p className="text-xl font-english text-muted-foreground">{book.name_english}</p>
                          <p className="text-sm text-muted-foreground mt-2 font-english">{book.description}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-4 pt-4">
                          {book.sections.map((section) => (
                            <div key={section.id} className="mandala-entry">
                              <Link href={`/shlokas/${section.shlokaLink}`} className="book-title text-sm">
                                <span className="font-sanskrit">{section.name_hindi}</span>
                                <span className="book-subtitle font-english"> ({section.name_english})</span>
                              </Link>
                              <span className="book-description"> - {section.description}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <Link
                    key={book.id}
                    href={book.placeholderLink}
                    className="block border-b border-border pb-8 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-left flex-1">
                        <h2 className="text-4xl font-sanskrit text-foreground mb-2 hover:text-primary transition-colors">
                          {book.name_hindi}
                        </h2>
                        <p className="text-xl font-english text-muted-foreground">{book.name_english}</p>
                        <p className="text-sm text-muted-foreground mt-2 font-english">{book.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                )
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12 animate-fade-up-delay-3 px-2 md:px-0">
              {books.map((book) => (
                <Link key={book.id} href={book.placeholderLink} className="block group h-full">
                  <Card className="overflow-hidden h-full flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300 border-border/50">
                    {/* Image Section */}
                    {book.code === "mb" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/mahabharata.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "rm" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/ramayana.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "rv" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/rigveda.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "yv" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/yoga%20vasistha.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "mp" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/markandaye%20puran.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "dm" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/devi.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "bg" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/gita.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "ms" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/manu%20smriti.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "ph" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/parahar%20sastra.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "ro" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/Rāmopākhyāna.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : book.code === "sbp" ? (
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <Image
                          src="/srimad%20bhagvatam.png"
                          alt={book.name_english}
                          fill
                          className="object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                    ) : (
                      <div className={`h-48 bg-gradient-to-br ${book.imageGradient} relative overflow-hidden flex-shrink-0`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                      </div>
                    )}
                    {/* Content Section */}
                    <CardContent className="p-6 bg-card flex-1 flex flex-col">
                      <h2 className="text-2xl font-sanskrit text-foreground mb-2 group-hover:text-primary transition-colors">
                        {book.name_hindi}
                      </h2>
                      <p className="text-base font-english text-muted-foreground mb-3">{book.name_english}</p>
                      <div className="flex items-center justify-between mt-auto h-[40px]">
                        <p className="text-sm text-muted-foreground font-english leading-relaxed flex-1 pr-2 line-clamp-2">
                          {book.description}
                        </p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-english italic">More Books will be added soon</p>

        <Footer />
      </main>
    </div>
  );
}

