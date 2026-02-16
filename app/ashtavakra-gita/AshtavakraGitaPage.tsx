"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Sparkles, Zap, Heart, Shield, Flame } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Pie, PieChart } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chapters = [
    { id: 1, english: "The Witnessing Self", sanskrit: "आत्मसाक्षात्कार", theme: "Self Realization", description: "Direct instruction on the nature of the Self as the witness, separate from the body and mind.", verses: 20, link: "ag-1-1-1" },
    { id: 2, english: "The Marvel of the Infinite Self", sanskrit: "आश्चर्यम्", theme: "Universal Consciousness", description: "Janaka's realization of his own infinite nature as the support of the universe.", verses: 25, link: "ag-1-2-1" },
    { id: 3, english: "Self in All and All in Self", sanskrit: "सर्वत्र आत्मदर्शनम्", theme: "Non-duality", description: "How a person of wisdom perceives the same Self in all beings.", verses: 14, link: "ag-1-3-1" },
    { id: 4, english: "The Knower and the Non-knower", sanskrit: "ज्ञातृ-अज्ञातृ", theme: "Wisdom", description: "The difference between one who knows the Self and one who is still caught in the world.", verses: 6, link: "ag-1-4-1" },
    { id: 5, english: "Four Stages of Dissolution", sanskrit: "लय-चतुष्टयम्", theme: "Dissolution", description: "The process of dissolving the ego and identifying with the pure Consciousness.", verses: 4, link: "ag-1-5-1" },
    { id: 6, english: "The Higher Knowledge", sanskrit: "परम ज्ञानम्", theme: "Ultimate Truth", description: "The Self as space-like, unaffected by any modifications of the world.", verses: 4, link: "ag-1-6-1" },
    { id: 7, english: "The Nature of Self-Realization", sanskrit: "अनुभव लक्षणम्", theme: "Experience", description: "Descriptions of the state of one who has realized the infinite Self.", verses: 5, link: "ag-1-7-1" },
    { id: 8, english: "Bondage and Liberation", sanskrit: "बन्ध-मोक्ष", theme: "Freedom", description: "The definition of bondage as desire and liberation as the absence of desire.", verses: 4, link: "ag-1-8-1" },
    { id: 9, english: "Detachment", sanskrit: "निर्वेद", theme: "Renunciation", description: "The indifference towards worldly affairs arising from the knowledge of their unreality.", verses: 8, link: "ag-1-9-1" },
    { id: 10, english: "Quietude", sanskrit: "शान्ति", theme: "Peace", description: "The absolute stillness of the mind that has abandoned all seeking.", verses: 8, link: "ag-1-10-1" },
];

const themeCategories = [
    { name: "Non-Duality", icon: Sparkles, color: "#8b5cf6", description: "The radical teaching of Advaita (oneness)" },
    { name: "The Witness", icon: Zap, color: "#f49d25", description: "Observing the mind and body from the source" },
    { name: "Self-Knowledge", icon: BookOpen, color: "#3b82f6", description: "Understanding your true identity as Consciousness" },
    { name: "Liberation", icon: Flame, color: "#ef4444", description: "Freedom from the cycle of birth and death" },
    { name: "Inner Peace", icon: Shield, color: "#10b981", description: "The natural state of the realized soul" },
    { name: "Pure Love", icon: Heart, color: "#ec4899", description: "The bliss of self-contentment" },
];

const narrativePhaseData = [
    { subject: "Advaita", overall: 100, fullMark: 100 },
    { subject: "Silence", overall: 95, fullMark: 100 },
    { subject: "Freedom", overall: 98, fullMark: 100 },
    { subject: "Witness", overall: 92, fullMark: 100 },
    { subject: "Bliss", overall: 90, fullMark: 100 },
];

const chartConfig = {
    overall: { label: "Intensity", color: "#8b5cf6" },
} satisfies ChartConfig;

const chapterColors = [
    "hsl(260, 75%, 40%)", "hsl(280, 70%, 50%)", "hsl(300, 85%, 50%)",
    "hsl(240, 60%, 45%)", "hsl(220, 75%, 35%)", "hsl(200, 80%, 40%)",
    "hsl(180, 70%, 45%)", "hsl(160, 65%, 42%)", "hsl(140, 60%, 38%)",
    "hsl(15, 85%, 45%)"
];

const pieChartConfig: ChartConfig = {
    verses: { label: "Verses" },
    ...chapters.reduce((acc, ch, idx) => {
        acc[`chapter-${ch.id}`] = { label: ch.english, color: chapterColors[idx] || chapterColors[0] };
        return acc;
    }, {} as Record<string, { label: string; color: string }>),
} satisfies ChartConfig;

export default function AshtavakraGitaPage() {
    const { data: verseData, isLoading, error } = useQuery({
        queryKey: ["ashtavakra-gita-stats"],
        queryFn: async () => {
            const { data: book } = await supabase.from("books").select("id").eq("code", "ag").single();
            if (!book) return [];
            const { data: chaptersDb } = await supabase.from("chapters").select("id, chapter_number, name_english").eq("book_id", book.id).order("chapter_number", { ascending: true });
            if (!chaptersDb) return [];
            const stats = await Promise.all(
                chaptersDb.map(async (chapter: any) => {
                    const { count } = await supabase.from("shlokas").select("*", { count: "exact", head: true }).eq("chapter_id", chapter.id);
                    return { name: chapter.name_english, verses: count || 0, chapter: chapter.chapter_number };
                })
            );
            return stats;
        },
    });

    const pieChartData = useMemo(() => {
        if (verseData && verseData.length > 0) {
            return verseData.slice(0, 10).map((item, idx) => ({
                chapter: `chapter-${item.chapter}`,
                verses: item.verses,
                fill: chapterColors[idx] || chapterColors[0],
            }));
        }
        return chapters.map((c, idx) => ({
            chapter: `chapter-${c.id}`,
            verses: c.verses,
            fill: chapterColors[idx] || chapterColors[0],
        }));
    }, [verseData]);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="glow-ambient animate-pulse-slow" />
            <Header />
            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32">
                <Link href="/contents" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 animate-fade-up">
                    <ArrowLeft className="w-4 h-4" />Return
                </Link>
                <div className="text-center mb-12 animate-fade-up-delay-1">
                    <h1 className="text-3xl md:text-5xl font-medium mb-3 tracking-tight text-[#c65c39] dark:text-[#f49d25] hover:opacity-80 transition-opacity font-english"><span className="font-sanskrit">अष्टावक्र गीता</span></h1>
                    <h2 className="text-3xl md:text-5xl font-medium mb-3 tracking-tight text-foreground dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-english">Ashtavakra Gita</h2>
                    <p className="text-lg text-muted-foreground mb-4 font-english">The Song of Ashtavakra</p>
                    <p className="text-muted-foreground max-w-3xl mx-auto mt-6 font-english leading-relaxed">The Ashtavakra Gita is a profound dialogue between Sage Ashtavakra and King Janaka. It is one of the most direct and unapologetic expositions of Advaita Vedanta, focusing on the immediate realization of the Self as pure Awareness.</p>
                </div>

                <section className="mb-16 animate-fade-up-delay-2">
                    <div className="flex flex-col items-center gap-6">
                        <Link href="/shlokas/ag-1-1-1" className="btn-primary inline-block font-english text-base px-8 py-3 rounded-full hover:scale-105 transition-transform">Begin Journey into Silence</Link>
                    </div>
                </section>

                {/* Thematic Categories */}
                <section className="mb-16 animate-fade-up-delay-2">
                    <h2 className="text-3xl font-english text-foreground mb-4 text-center">Core Principles</h2>
                    <p className="text-sm text-muted-foreground mb-8 text-center font-english max-w-3xl mx-auto">The teaching of Ashtavakra is centered around these fundamental pillars of non-dual wisdom.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {themeCategories.map((theme) => (
                            <Card key={theme.name} className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
                                <CardContent className="p-4 text-center">
                                    <theme.icon className="w-8 h-8 mx-auto mb-2" style={{ color: theme.color }} />
                                    <h3 className="font-medium text-foreground text-sm mb-1">{theme.name}</h3>
                                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-16 animate-fade-up-delay-2">
                    <h2 className="text-3xl font-english text-foreground mb-4 text-center">Wisdom Distribution</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-card/50 backdrop-blur-sm border border-border">
                            <CardHeader className="items-center pb-0">
                                <CardTitle className="text-xl font-english">Instruction Intensity</CardTitle>
                                <p className="text-xs text-muted-foreground font-english mt-2 text-center max-w-md mx-auto leading-relaxed">Analysis of spiritual themes across the dialogue.</p>
                            </CardHeader>
                            <CardContent className="pb-4 pt-6 px-2">
                                <ChartContainer id="ashtavakra-radar" config={chartConfig} className="mx-auto aspect-square max-h-[300px] w-full">
                                    <RadarChart data={narrativePhaseData} margin={{ top: 35, right: 50, bottom: 35, left: 50 }}>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--foreground))', fontWeight: 500 }} />
                                        <PolarGrid radialLines={false} />
                                        <Radar dataKey="overall" fill="var(--color-overall)" fillOpacity={0.6} stroke="var(--color-overall)" strokeWidth={2} />
                                    </RadarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border border-border">
                            <CardHeader className="items-center pb-0">
                                <CardTitle className="text-xl font-english">Verse Distribution (First 10 Ch.)</CardTitle>
                                <p className="text-xs text-muted-foreground font-english mt-2 text-center max-w-md mx-auto leading-relaxed">Distribution of verses across the foundational chapters.</p>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4 pt-6">
                                {isLoading ? (<div className="h-[280px] flex items-center justify-center"><p className="text-muted-foreground font-english">Loading...</p></div>) : error ? (<div className="h-[280px] flex items-center justify-center"><p className="text-destructive font-english">Error</p></div>) : (
                                    <ChartContainer id="ashtavakra-pie" config={pieChartConfig} className="mx-auto aspect-square max-h-[280px]">
                                        <PieChart>
                                            <ChartTooltip cursor={false} content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0];
                                                    const nameStr = String(data.name || '');
                                                    const id = nameStr.replace('chapter-', '');
                                                    const chapter = chapters.find(c => c.id === parseInt(id));
                                                    return (<div className="rounded-lg border bg-background p-2 shadow-sm"><span className="text-sm font-medium text-foreground">{chapter?.english || 'Unknown'} : {data.value} Verses</span></div>);
                                                }
                                                return null;
                                            }} />
                                            <Pie data={pieChartData} dataKey="verses" nameKey="chapter" />
                                        </PieChart>
                                    </ChartContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="mb-16 animate-fade-up-delay-3">
                    <h2 className="text-3xl font-english text-foreground mb-12 text-center">Chapters of Enlightenment</h2>
                    <div className="relative">
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border"></div>
                        <div className="space-y-4 md:space-y-8">
                            {chapters.map((chapter, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <div key={chapter.id} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="md:absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 mb-2 md:mb-0 shadow-glow"></div>
                                        <div className={`w-full md:w-[calc(50%-2rem)] ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                                            <Card className="feature-card hover:border-primary/30 transition-all duration-500 overflow-hidden group">
                                                <CardContent className="p-5 relative">
                                                    <div className={`flex flex-col gap-2 ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}>
                                                        <span className="text-xs font-medium text-primary tracking-widest uppercase mb-1">{chapter.theme}</span>
                                                        <h3 className="text-xl font-sanskrit text-foreground mb-0.5 group-hover:text-primary transition-colors">{chapter.sanskrit}</h3>
                                                        <p className="text-lg font-english text-foreground/90 font-medium mb-1">{chapter.english}</p>
                                                        <p className="text-sm text-muted-foreground font-english leading-relaxed mb-3">{chapter.description}</p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs text-muted-foreground font-english">{chapter.verses} Verses</span>
                                                            <Link href={`/shlokas/${chapter.link}`} className="text-xs font-semibold text-primary hover:underline font-english tracking-wider">READ CHAPTER →</Link>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12">
                            <p className="text-muted-foreground italic font-english">... and 10 more chapters of supreme wisdom</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </div>
    );
}
