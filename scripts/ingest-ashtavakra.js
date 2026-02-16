/**
 * Ashtavakra Gita Data Ingestion Script
 * 
 * Fetches Ashtavakra Gita verses from dhrmaorg/ashtavakra_gita GitHub repository
 * and populates the Supabase database.
 * 
 * Usage: node scripts/ingest-ashtavakra.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Load environment variables ────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found');
    process.exit(1);
}

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Metadata ─────────────────────────────────────────────────────────
const BOOK = {
    code: 'ag',
    name_english: 'Ashtavakra Gita',
    name_hindi: 'अष्टावक्र गीता',
    description: 'The Ashtavakra Gita is a classical Advaita Vedanta scripture presented as a dialogue between the sage Ashtavakra and King Janaka of Mithila. It emphasizes the unreality of the external world and the absolute oneness of existence.',
    total_shlokas: 298, // Approximately
    transliteration: 'Aṣṭāvakra Gītā',
    display_order: 5,
};

const CHAPTER_NAMES = {
    1: "The Witnessing Self",
    2: "The Marvel of the Infinite Self",
    3: "Self in All and All in Self",
    4: "The Knower and the Non-knower",
    5: "Four Stages of Dissolution",
    6: "The Higher Knowledge",
    7: "The Nature of Self-Realization",
    8: "Bondage and Liberation",
    9: "Detachment",
    10: "Quietude",
    11: "Wisdom",
    12: "Abiding in the Self",
    13: "Happiness",
    14: "Tranquility",
    15: "Knowledge of the Self",
    16: "Special Instruction",
    17: "The True Knower",
    18: "Peace",
    19: "Repose in the Self",
    20: "Liberation in Life"
};

const SA_URL = 'https://raw.githubusercontent.com/dhrmaorg/ashtavakra_gita/master/source/sa.json';
const EN_URL = 'https://raw.githubusercontent.com/dhrmaorg/ashtavakra_gita/master/translation/johnhenryrichards_en.json';

// ─── Helper: fetch JSON ────────────────────────────────────────────────
async function fetchJSON(url) {
    console.log(`📥 Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    return response.json();
}

// ─── Helper: delay ─────────────────────────────────────────────────────
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function startIngestion() {
    console.log(`🕉️  Starting Ingestion for: ${BOOK.name_english}`);

    // 1. Fetch data
    const saData = await fetchJSON(SA_URL);
    const enData = await fetchJSON(EN_URL);

    // 2. Ensure Book exists
    let { data: book, error: bookError } = await supabase
        .from('books')
        .select('id')
        .eq('code', BOOK.code)
        .single();

    if (bookError || !book) {
        const { data: newBook, error: createError } = await supabase
            .from('books')
            .insert(BOOK)
            .select('id')
            .single();
        if (createError) throw createError;
        book = newBook;
        console.log(`✅ Created Book: ${BOOK.name_english}`);
    } else {
        console.log(`ℹ️ Book already exists: ${BOOK.name_english}`);
    }

    // 3. Create Section
    let { data: section } = await supabase
        .from('sections')
        .select('id')
        .eq('book_id', book.id)
        .eq('code', 'ag-1')
        .single();

    if (!section) {
        const { data: newSection } = await supabase
            .from('sections')
            .insert({
                book_id: book.id,
                code: 'ag-1',
                name_english: 'Ashtavakra Gita',
                name_hindi: 'अष्टावक्र गीता',
                section_number: 1,
                display_order: 1
            })
            .select('id')
            .single();
        section = newSection;
        console.log(`✅ Created Section`);
    }

    // 4. Process Shlokas and Chapters
    const verseKeys = Object.keys(saData).sort((a, b) => {
        const [chA, vsA] = a.split('.').map(Number);
        const [chB, vsB] = b.split('.').map(Number);
        if (chA !== chB) return chA - chB;
        return vsA - vsB;
    });

    let currentChapterNum = -1;
    let currentChapterId = null;

    for (const key of verseKeys) {
        const [chapterNum, verseNum] = key.split('.').map(Number);

        // a. Ensure Chapter exists
        if (chapterNum !== currentChapterNum) {
            let { data: chapter } = await supabase
                .from('chapters')
                .select('id')
                .eq('section_id', section.id)
                .eq('chapter_number', chapterNum)
                .single();

            if (!chapter) {
                const { data: newChapter } = await supabase
                    .from('chapters')
                    .insert({
                        section_id: section.id,
                        chapter_number: chapterNum,
                        name_english: CHAPTER_NAMES[chapterNum] || `Chapter ${chapterNum}`,
                        display_order: chapterNum
                    })
                    .select('id')
                    .single();
                chapter = newChapter;
                console.log(`   ✅ Created Chapter ${chapterNum}`);
            }
            currentChapterNum = chapterNum;
            currentChapterId = chapter.id;
        }

        // b. Insert Shloka
        const sanskrit = saData[key];
        const translation = enData[key];
        const code = `ag-1-${chapterNum}-${verseNum}`;

        const { data: existing } = await supabase
            .from('shlokas')
            .select('id')
            .eq('code', code)
            .single();

        if (!existing) {
            const { error: iError } = await supabase
                .from('shlokas')
                .insert({
                    chapter_id: currentChapterId,
                    code: code,
                    shloka_number: verseNum,
                    sanskrit: sanskrit,
                    translation_english: translation,
                    display_order: verseNum
                });

            if (iError) {
                console.error(`      ❌ Error inserting ${key}:`, iError.message);
            } else {
                process.stdout.write('.');
            }
        }
    }

    console.log(`\n🎉 Ingestion completed for: ${BOOK.name_english}`);
}

startIngestion().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
