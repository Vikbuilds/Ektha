
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Section {
    id: string;
    code: string;
    section_number: number;
    name_english: string;
    name_hindi: string;
    description: string | null;
    transliteration: string | null;
    shlokaLink?: string; // Derived field
}

export interface Book {
    id: string;
    code: string;
    name_english: string;
    name_hindi: string;
    description: string | null;
    transliteration: string | null;
    sections: Section[];
    imageGradient: string; // Derived field
    placeholderLink: string; // Derived field
}

const GRADIENTS = [
    "from-amber-900 via-orange-800 to-amber-700",
    "from-blue-900 via-indigo-800 to-blue-700",
    "from-purple-900 via-violet-800 to-purple-700",
    "from-rose-900 via-pink-800 to-rose-700",
    "from-emerald-900 via-teal-800 to-emerald-700",
    "from-stone-900 via-neutral-800 to-stone-700",
    "from-cyan-900 via-blue-800 to-cyan-700",
    "from-violet-900 via-purple-800 to-violet-700",
    "from-indigo-900 via-blue-800 to-indigo-700",
    "from-sky-900 via-cyan-800 to-sky-700",
    "from-fuchsia-900 via-pink-800 to-fuchsia-700",
];

export const useBooks = () => {
    return useQuery({
        queryKey: ["books"],
        queryFn: async (): Promise<Book[]> => {
            // Fetch books with their sections in a single query
            const { data: booksData, error: booksError } = await supabase
                .from("books")
                .select("*, sections(*)")
                .order("display_order", { ascending: true })
                .order("section_number", { foreignTable: "sections", ascending: true });

            if (booksError) throw booksError;
            if (!booksData) return [];

            // Map results to the expected Book interface
            return (booksData as any[]).map((book, index) => {
                const bookSections = (book.sections || []).map((s: any) => ({
                    ...s,
                    shlokaLink: `${s.code}-1-1` // Construct default link: {section_code}-1-1
                }));

                // Default image gradient based on index
                const gradient = GRADIENTS[index % GRADIENTS.length];

                // Mapping of book codes to their application routes
                const BOOK_ROUTES: Record<string, string> = {
                    'bg': 'bhagavad-gita',
                    'rm': 'ramayana',
                    'mb': 'mahabharata',
                    'rv': 'rigveda',
                    'sbp': 'srimad-bhagavatam',
                    'dm': 'devi-mahatmyam',
                    'ms': 'manu-smriti',
                    'mp': 'markandeya-purana',
                    'ph': 'parashara',
                    'ro': 'ramopakyana',
                    'yv': 'yoga-vasishtha',
                    'ag': 'ashtavakra-gita',
                };

                return {
                    ...book,
                    sections: bookSections,
                    imageGradient: gradient,
                    placeholderLink: `/${BOOK_ROUTES[book.code] || book.code}`
                };
            });
        },
    });
};
