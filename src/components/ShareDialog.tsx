"use client";

import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Check, Copy, Palette } from "lucide-react";
import { toJpeg } from "html-to-image";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
    shloka: {
        sanskrit: string;
        translation: string;
        code: string;
        bookName: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Theme = {
    id: string;
    name: string;
    bgClass: string;
    textClass: string;
    accentClass: string;
    cardBg: string;
};

const themes: Theme[] = [
    {
        id: "parchment",
        name: "Classic Parchment",
        bgClass: "bg-[#FDFCF0]",
        textClass: "text-[#2D2A26]",
        accentClass: "text-primary",
        cardBg: "bg-[#FDFCF0]"
    },
    {
        id: "midnight",
        name: "Sacred Midnight",
        bgClass: "bg-[#0F172A]",
        textClass: "text-slate-100",
        accentClass: "text-blue-400",
        cardBg: "bg-[#0F172A]"
    },
    {
        id: "saffron",
        name: "Sacred Saffron",
        bgClass: "bg-gradient-to-br from-[#F97316] to-[#EA580C]",
        textClass: "text-white",
        accentClass: "text-white/80",
        cardBg: "bg-gradient-to-br from-[#F97316] to-[#EA580C]"
    },
    {
        id: "stone",
        name: "Eternal Stone",
        bgClass: "bg-[#F5F5F4]",
        textClass: "text-[#44403C]",
        accentClass: "text-[#78716C]",
        cardBg: "bg-[#F5F5F4]"
    }
];

export function ShareDialog({ shloka, open, onOpenChange }: QuoteCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadImage = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        const hiddenNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];

        try {
            // Ensure fonts are loaded before capturing
            if (typeof document !== 'undefined' && 'fonts' in document) {
                await (document as any).fonts.ready;
            }

            // SURGICAL STYLE SHIELD:
            // Some extensions or scripts inject cross-origin stylesheets that trigger 
            // 'SecurityError: Cannot access rules' in html-to-image.
            // We temporarily hide them during the capture process.
            if (typeof document !== 'undefined') {
                const styleSheets = Array.from(document.styleSheets);
                const nodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));

                nodes.forEach((node) => {
                    try {
                        const sheet = (node as any).sheet as CSSStyleSheet;
                        if (sheet) {
                            // Test if rules are accessible
                            const _ = sheet.cssRules;
                        }
                    } catch (e) {
                        // If we can't access rules, this sheet will crash toPng. Hide it.
                        const parent = node.parentNode;
                        if (parent) {
                            hiddenNodes.push({
                                node,
                                parent,
                                nextSibling: node.nextSibling
                            });
                            parent.removeChild(node);
                        }
                    }
                });
            }

            const dataUrl = await toJpeg(cardRef.current, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: selectedTheme.id === 'midnight' ? '#0F172A' : '#FDFCF0',
                cacheBust: true,
            });

            // Convert to Blob with explicit MIME type for reliable naming
            const blob = await (await fetch(dataUrl)).blob();
            const jpegBlob = new Blob([blob], { type: 'image/jpeg' });
            const blobUrl = URL.createObjectURL(jpegBlob);

            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = blobUrl;
            link.download = `ektha-quote-${shloka.code}.jpg`;

            document.body.appendChild(link);
            link.click();

            // Cleanup with a delay to ensure the browser captures the download
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 200);

            toast.success("Quote card downloaded successfully!");
        } catch (err) {
            console.error("Quote Card Generation Error:", err);
            toast.error("Failed to generate image. Please try again.");
        } finally {
            // RESTORE SHIELDED NODES:
            // Immediately put the stylesheets back so the UI doesn't break
            hiddenNodes.reverse().forEach(({ node, parent, nextSibling }) => {
                try {
                    parent.insertBefore(node, nextSibling);
                } catch (e) {
                    console.error("Failed to restore stylesheet node", e);
                }
            });
            setIsDownloading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-english text-xl">Create Quote Card</DialogTitle>
                    <DialogDescription className="font-english">
                        Customize and share this timeless wisdom with your circle.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Card Preview Container */}
                    <div className="flex justify-center bg-muted/30 p-4 rounded-lg border border-border/50 overflow-hidden">
                        <div
                            ref={cardRef}
                            className={cn(
                                "w-[400px] aspect-square flex flex-col justify-between p-10 relative",
                                selectedTheme.bgClass
                            )}
                        >
                            {/* Top Branding */}
                            <div className="flex justify-between items-center opacity-40">
                                <span className={cn("text-[10px] font-mono tracking-widest uppercase", selectedTheme.textClass)}>
                                    {shloka.bookName}
                                </span>
                                <span className={cn("text-[10px] font-mono", selectedTheme.textClass)}>
                                    {shloka.code}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div className="flex flex-col gap-6 items-center text-center">
                                <div className={cn("text-2xl md:text-3xl font-sanskrit leading-relaxed", selectedTheme.textClass)}>
                                    {shloka.sanskrit}
                                </div>
                                <div className="w-12 h-px bg-current opacity-20" />
                                <div className={cn("text-base md:text-lg font-playfair italic", selectedTheme.textClass)}>
                                    "{shloka.translation}"
                                </div>
                            </div>

                            {/* Bottom Branding */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-[10px] uppercase tracking-widest font-english opacity-60 font-semibold", selectedTheme.textClass)}>
                                        ektha.info
                                    </span>
                                </div>
                                <span className={cn("text-[8px] opacity-40 font-english uppercase tracking-[0.2em]", selectedTheme.textClass)}>
                                    Eternal Knowledge & Truth Archives
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium font-english">
                        <Palette className="w-4 h-4" />
                        Choose Theme
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-2 rounded-md border text-xs font-english transition-all",
                                    selectedTheme.id === theme.id
                                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                        : "border-border hover:bg-muted"
                                )}
                            >
                                <div className={cn("w-full h-12 rounded shadow-inner border border-black/5", theme.cardBg)} />
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="font-english" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="font-english gap-2"
                        onClick={downloadImage}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Download Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
