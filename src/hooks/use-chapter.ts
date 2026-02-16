import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Shloka {
  id: string;
  code: string;
  shloka_number: number;
  sanskrit: string | null;
  transliteration: string | null;
  translation_english: string | null;
  translation_hindi: string | null;
  is_highlighted: boolean;
}

export interface ChapterData {
  bookCode: string;
  bookName: string;
  bookNameHindi: string;
  sectionNumber: number;
  sectionName: string;
  sectionNameHindi: string;
  chapterNumber: number;
  chapterName: string;
  chapterNameHindi: string;
  totalShlokas: number;
  shlokas: Shloka[];
  hasTranslation: boolean;
  contentFormat: string;
}

export const useChapter = (code: string | undefined) => {
  return useQuery({
    queryKey: ["chapter", code],
    queryFn: async (): Promise<ChapterData | null> => {
      if (!code) return null;

      // Check if supabase client is available
      if (!supabase) {
        console.error("Supabase client is not initialized. Check your environment variables.");
        return null;
      }

      // Parse code: {book_code}-{section}-{chapter}-{shloka}
      const parts = code.split("-");
      if (parts.length < 3) return null;

      const bookCode = parts[0];
      const sectionNum = parseInt(parts[1]);
      const chapterNum = parseInt(parts[2]);

      try {
        // Fetch all required data in a single efficient nested query
        const { data: bookData, error: queryError } = await supabase
          .from("books")
          .select(`
            code,
            name_english,
            name_hindi,
            has_translation_english,
            content_format,
            sections!inner (
              id,
              section_number,
              name_english,
              name_hindi,
              chapters!inner (
                id,
                chapter_number,
                name_english,
                name_hindi,
                total_shlokas,
                shlokas (
                  id,
                  code,
                  shloka_number,
                  sanskrit,
                  transliteration,
                  translation_english,
                  translation_hindi,
                  is_highlighted
                )
              )
            )
          `)
          .eq("code", bookCode)
          .eq("sections.section_number", sectionNum)
          .eq("sections.chapters.chapter_number", chapterNum)
          .order("shloka_number", { foreignTable: "sections.chapters.shlokas", ascending: true })
          .single();

        if (queryError) {
          console.error("Error fetching chapter data:", queryError);
          return null;
        }
        if (!bookData) return null;

        const section = (bookData.sections as any[])[0];
        const chapter = (section.chapters as any[])[0];
        const shlokas = (chapter.shlokas as any[]) || [];

        return {
          bookCode,
          bookName: bookData.name_english,
          bookNameHindi: bookData.name_hindi,
          sectionNumber: section.section_number,
          sectionName: section.name_english,
          sectionNameHindi: section.name_hindi,
          chapterNumber: chapter.chapter_number,
          chapterName: chapter.name_hindi || chapter.name_english || `अध्याय ${chapter.chapter_number}`,
          chapterNameHindi: chapter.name_hindi || `अध्याय ${chapter.chapter_number}`,
          totalShlokas: chapter.total_shlokas || shlokas?.length || 0,
          shlokas: (shlokas || []).map((s: any) => ({
            id: s.id,
            code: s.code,
            shloka_number: s.shloka_number,
            sanskrit: s.sanskrit,
            transliteration: s.transliteration,
            translation_english: s.translation_english,
            translation_hindi: s.translation_hindi,
            is_highlighted: s.is_highlighted,
          })),
          hasTranslation: bookData.has_translation_english || false,
          contentFormat: bookData.content_format || "shloka",
        };
      } catch (err) {
        console.error("Error in useChapter:", err);
        return null;
      }
    },
    enabled: !!code,
  });
};
