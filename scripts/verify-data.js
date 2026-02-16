
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
        const key = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        if (key && value) env[key] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    console.log('Verifying data...');

    const { count: bookCount, error: bookError } = await supabase.from('books').select('*', { count: 'exact', head: true }).eq('code', 'bg');
    if (bookError) console.error('Book Error:', bookError);
    console.log(`Books (bg): ${bookCount}`);

    const { count: chapterCount, error: chapterError } = await supabase.from('chapters').select('*', { count: 'exact', head: true });
    if (chapterError) console.error('Chapter Error:', chapterError);
    console.log(`Chapters: ${chapterCount}`);

    const { count: shlokaCount, error: shlokaError } = await supabase.from('shlokas').select('*', { count: 'exact', head: true });
    if (shlokaError) console.error('Shloka Error:', shlokaError);
    console.log(`Shlokas: ${shlokaCount}`);

    // Check a sample shloka
    const { data: sample, error: sampleError } = await supabase.from('shlokas').select('sanskrit, transliteration, translation_english').limit(1).single();
    if (sample) {
        console.log('\nSample Shloka:');
        console.log('Sanskrit:', sample.sanskrit);
        console.log('Transliteration:', sample.transliteration);
        console.log('Meaning:', sample.translation_english);
    }
}

verifyData();
