import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Section {
  id: string;
  section_number: number;
  name_english: string;
  name_hindi: string;
}

export interface Chapter {
  id: string;
  chapter_number: number;
  name_english: string;
  name_hindi: string;
  section_id: string;
}

export interface BookNavigation {
  sections: Section[];
  chaptersBySection: Record<number, Chapter[]>;
}

export const useBookNavigation = (bookCode: string) => {
  return useQuery({
    queryKey: ["book-navigation", bookCode],
    queryFn: async (): Promise<BookNavigation | null> => {
      if (!bookCode) return null;

      // Fetch book, sections, and chapters in a single efficient nested query
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select(`
          id,
          sections (
            id,
            section_number,
            name_english,
            name_hindi,
            chapters (
              id,
              chapter_number,
              name_english,
              name_hindi,
              section_id
            )
          )
        `)
        .eq("code", bookCode)
        .order("section_number", { foreignTable: "sections", ascending: true })
        .order("chapter_number", { foreignTable: "sections.chapters", ascending: true })
        .single();

      if (bookError || !bookData) return null;

      const sections = (bookData.sections || []) as any[];

      // Group chapters by section for the existing return structure
      const chaptersBySection: Record<number, Chapter[]> = {};
      sections.forEach((section) => {
        chaptersBySection[section.section_number] = (section.chapters || []).map((c: any) => ({
          id: c.id,
          chapter_number: c.chapter_number,
          name_english: c.name_english,
          name_hindi: c.name_hindi,
          section_id: c.section_id,
        }));
      });

      return {
        sections: sections.map((s) => ({
          id: s.id,
          section_number: s.section_number,
          name_english: s.name_english,
          name_hindi: s.name_hindi,
        })),
        chaptersBySection,
      };
    },
    enabled: !!bookCode,
  });
};

