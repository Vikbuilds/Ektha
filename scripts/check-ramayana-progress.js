const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
        const key = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        if (key && value) env[key] = value;
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkProgress() {
    const { data: book } = await supabase.from('books').select('id').eq('code', 'rm').single();
    if (!book) {
        console.log('Book not found');
        return;
    }

    const { data: sections } = await supabase.from('sections').select('id, name_english, code').eq('book_id', book.id).order('section_number', { ascending: true });

    for (const s of sections) {
        // Count chapters
        const { count: chapterCount } = await supabase.from('chapters').select('id', { count: 'exact', head: true }).eq('section_id', s.id);

        // Count shlokas
        const { data: chapters } = await supabase.from('chapters').select('id').eq('section_id', s.id);
        const chapterIds = chapters.map(c => c.id);

        let shlokaCount = 0;
        if (chapterIds.length > 0) {
            const { count } = await supabase.from('shlokas').select('id', { count: 'exact', head: true }).in('chapter_id', chapterIds);
            shlokaCount = count;
        }

        console.log(`${s.name_english} (${s.code}): ${chapterCount} chapters, ${shlokaCount} shlokas`);
    }
}

checkProgress().catch(console.error);
