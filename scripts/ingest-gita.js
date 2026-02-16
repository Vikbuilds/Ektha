/**
 * Bhagavad Gita Data Ingestion Script
 * 
 * Fetches all 700 verses of the Bhagavad Gita from the gita/gita GitHub repository
 * and populates the Supabase database with structured data including:
 * - Sanskrit text (original Devanagari)
 * - Transliteration (romanized pronunciation)
 * - English translation (word-by-word meanings)
 * 
 * Usage: node scripts/ingest-gita.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Load environment variables ────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
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

// ─── Bhagavad Gita Chapter Metadata ────────────────────────────────────
const GITA_CHAPTERS = [
    { num: 1, nameEn: "Arjuna Vishada Yoga", nameHi: "अर्जुनविषादयोग", description: "The Yoga of Arjuna's Dejection" },
    { num: 2, nameEn: "Sankhya Yoga", nameHi: "सांख्ययोग", description: "The Yoga of Knowledge" },
    { num: 3, nameEn: "Karma Yoga", nameHi: "कर्मयोग", description: "The Yoga of Action" },
    { num: 4, nameEn: "Jnana Karma Sanyasa Yoga", nameHi: "ज्ञानकर्मसन्न्यासयोग", description: "The Yoga of Knowledge and Renunciation of Action" },
    { num: 5, nameEn: "Karma Sanyasa Yoga", nameHi: "कर्मसन्न्यासयोग", description: "The Yoga of Renunciation of Action" },
    { num: 6, nameEn: "Dhyana Yoga", nameHi: "ध्यानयोग", description: "The Yoga of Meditation" },
    { num: 7, nameEn: "Jnana Vijnana Yoga", nameHi: "ज्ञानविज्ञानयोग", description: "The Yoga of Knowledge and Wisdom" },
    { num: 8, nameEn: "Aksara Brahma Yoga", nameHi: "अक्षरब्रह्मयोग", description: "The Yoga of the Imperishable Brahman" },
    { num: 9, nameEn: "Raja Vidya Raja Guhya Yoga", nameHi: "राजविद्याराजगुह्ययोग", description: "The Yoga of Royal Knowledge and Royal Secret" },
    { num: 10, nameEn: "Vibhuti Yoga", nameHi: "विभूतियोग", description: "The Yoga of Divine Glories" },
    { num: 11, nameEn: "Vishwarupa Darshana Yoga", nameHi: "विश्वरूपदर्शनयोग", description: "The Yoga of the Vision of the Universal Form" },
    { num: 12, nameEn: "Bhakti Yoga", nameHi: "भक्तियोग", description: "The Yoga of Devotion" },
    { num: 13, nameEn: "Kshetra Kshetrajna Vibhaga Yoga", nameHi: "क्षेत्रक्षेत्रज्ञविभागयोग", description: "The Yoga of the Field and the Knower of the Field" },
    { num: 14, nameEn: "Gunatraya Vibhaga Yoga", nameHi: "गुणत्रयविभागयोग", description: "The Yoga of the Division of the Three Gunas" },
    { num: 15, nameEn: "Purushottama Yoga", nameHi: "पुरुषोत्तमयोग", description: "The Yoga of the Supreme Person" },
    { num: 16, nameEn: "Daivasura Sampad Vibhaga Yoga", nameHi: "दैवासुरसम्पद्विभागयोग", description: "The Yoga of the Division of Divine and Demoniac Qualities" },
    { num: 17, nameEn: "Shraddhatraya Vibhaga Yoga", nameHi: "श्रद्धात्रयविभागयोग", description: "The Yoga of the Division of the Threefold Faith" },
    { num: 18, nameEn: "Moksha Sanyasa Yoga", nameHi: "मोक्षसन्न्यासयोग", description: "The Yoga of Liberation through Renunciation" },
];

// ─── Data source URL ──────────────────────────────────────────────────
const VERSE_DATA_URL = 'https://raw.githubusercontent.com/gita/gita/master/data/verse.json';

// ─── Helper: fetch JSON from URL ──────────────────────────────────────
async function fetchJSON(url) {
    console.log(`📥 Fetching data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

// ─── Helper: delay ────────────────────────────────────────────────────
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ingestion function ──────────────────────────────────────────
async function ingestBhagavadGita() {
    console.log('🕉️  Bhagavad Gita Data Ingestion');
    console.log('═'.repeat(50));

    // Step 1: Fetch verse data from GitHub
    let verses;
    try {
        verses = await fetchJSON(VERSE_DATA_URL);
        console.log(`✅ Fetched ${verses.length} verses from GitHub\n`);
    } catch (err) {
        console.error('❌ Failed to fetch verse data:', err.message);
        process.exit(1);
    }

    // Step 2: Create or find the book entry
    console.log('📖 Step 1: Creating book entry...');
    let book;
    const { data: existingBook } = await supabase
        .from('books')
        .select('id')
        .eq('code', 'bg')
        .single();

    if (existingBook) {
        book = existingBook;
        console.log(`   Book already exists (id: ${book.id})`);
    } else {
        const { data: newBook, error: bookError } = await supabase
            .from('books')
            .insert({
                code: 'bg',
                name_english: 'Bhagavad Gita',
                name_hindi: 'श्रीमद्भगवद्गीता',
                description: 'The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the epic Mahabharata. It contains a conversation between prince Arjuna and his guide and charioteer Lord Krishna on a variety of theological and philosophical issues.',
                total_shlokas: 700,
                transliteration: 'Śrīmad Bhagavad Gītā',
                display_order: 1,
            })
            .select('id')
            .single();

        if (bookError) {
            console.error('❌ Failed to create book:', bookError.message);
            process.exit(1);
        }
        book = newBook;
        console.log(`   ✅ Created book (id: ${book.id})`);
    }

    // Step 3: Create a single section for Bhagavad Gita
    // (Gita is a single book with 18 chapters, so we use 1 section)
    console.log('\n📑 Step 2: Creating section...');
    let section;
    const { data: existingSection } = await supabase
        .from('sections')
        .select('id')
        .eq('book_id', book.id)
        .eq('code', 'bg-1')
        .single();

    if (existingSection) {
        section = existingSection;
        console.log(`   Section already exists (id: ${section.id})`);
    } else {
        const { data: newSection, error: sectionError } = await supabase
            .from('sections')
            .insert({
                book_id: book.id,
                code: 'bg-1',
                name_english: 'Bhagavad Gita',
                name_hindi: 'श्रीमद्भगवद्गीता',
                transliteration: 'Śrīmad Bhagavad Gītā',
                display_order: 1,
            })
            .select('id')
            .single();

        if (sectionError) {
            console.error('❌ Failed to create section:', sectionError.message);
            process.exit(1);
        }
        section = newSection;
        console.log(`   ✅ Created section (id: ${section.id})`);
    }

    // Step 4: Create chapters
    console.log('\n📚 Step 3: Creating chapters...');
    const chapterMap = {}; // chapter_number -> chapter_id

    for (const ch of GITA_CHAPTERS) {
        const { data: existingChapter } = await supabase
            .from('chapters')
            .select('id')
            .eq('section_id', section.id)
            .eq('chapter_number', ch.num)
            .single();

        if (existingChapter) {
            chapterMap[ch.num] = existingChapter.id;
            console.log(`   Chapter ${ch.num} already exists`);
        } else {
            // Count shlokas for this chapter
            const chapterVerseCount = verses.filter(v => v.chapter_number === ch.num).length;

            const { data: newChapter, error: chapterError } = await supabase
                .from('chapters')
                .insert({
                    section_id: section.id,
                    chapter_number: ch.num,
                    name_english: ch.nameEn,
                    name_hindi: ch.nameHi,
                    description: ch.description,
                    total_shlokas: chapterVerseCount,
                    display_order: ch.num,
                })
                .select('id')
                .single();

            if (chapterError) {
                console.error(`❌ Failed to create chapter ${ch.num}:`, chapterError.message);
                continue;
            }
            chapterMap[ch.num] = newChapter.id;
            console.log(`   ✅ Chapter ${ch.num}: ${ch.nameEn} (${chapterVerseCount} verses)`);
        }
    }

    // Step 5: Insert shlokas in batches
    console.log('\n🔤 Step 4: Inserting shlokas...');
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Group verses by chapter for batch processing
    const versesByChapter = {};
    for (const verse of verses) {
        if (!versesByChapter[verse.chapter_number]) {
            versesByChapter[verse.chapter_number] = [];
        }
        versesByChapter[verse.chapter_number].push(verse);
    }

    for (const [chapterNum, chapterVerses] of Object.entries(versesByChapter)) {
        const chapterId = chapterMap[parseInt(chapterNum)];
        if (!chapterId) {
            console.error(`   ⚠️ No chapter ID for chapter ${chapterNum}, skipping...`);
            continue;
        }

        console.log(`\n   📖 Chapter ${chapterNum} (${chapterVerses.length} verses):`);

        // Check existing shlokas in this chapter
        const { data: existingShlokas } = await supabase
            .from('shlokas')
            .select('shloka_number')
            .eq('chapter_id', chapterId);

        const existingNumbers = new Set(
            (existingShlokas || []).map(s => s.shloka_number)
        );

        // Prepare batch of new shlokas
        const newShlokas = [];
        for (const verse of chapterVerses) {
            if (existingNumbers.has(verse.verse_number)) {
                skippedCount++;
                continue;
            }

            // Clean up Sanskrit text (remove verse numbering from end)
            let sanskritText = (verse.text || '').trim();

            // Build shloka code: bg-{section}-{chapter}-{verse}
            const shlokaCode = `bg-1-${chapterNum}-${verse.verse_number}`;

            // Build translation from word_meanings
            const wordMeanings = (verse.word_meanings || '').trim();

            // Use transliteration from the data
            const transliteration = (verse.transliteration || '').trim();

            newShlokas.push({
                chapter_id: chapterId,
                code: shlokaCode,
                shloka_number: verse.verse_number,
                sanskrit: sanskritText,
                transliteration: transliteration || null,
                translation_english: wordMeanings || null,
                translation_hindi: null,
                commentary: null,
                is_highlighted: false,
                display_order: verse.verse_number,
            });
        }

        if (newShlokas.length === 0) {
            console.log(`      ⏭️ All verses already exist, skipping...`);
            continue;
        }

        // Insert in batches of 50 to avoid payload limits
        const BATCH_SIZE = 50;
        for (let i = 0; i < newShlokas.length; i += BATCH_SIZE) {
            const batch = newShlokas.slice(i, i + BATCH_SIZE);
            const { error: insertError } = await supabase
                .from('shlokas')
                .insert(batch);

            if (insertError) {
                console.error(`      ❌ Batch insert error:`, insertError.message);
                errorCount += batch.length;
            } else {
                insertedCount += batch.length;
                console.log(`      ✅ Inserted ${batch.length} verses (${i + batch.length}/${newShlokas.length})`);
            }

            // Small delay between batches
            await delay(200);
        }
    }

    // ─── Summary ────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🕉️  Ingestion Complete!');
    console.log(`   ✅ Inserted: ${insertedCount} shlokas`);
    console.log(`   ⏭️ Skipped:  ${skippedCount} (already existed)`);
    console.log(`   ❌ Errors:   ${errorCount}`);
    console.log(`   📊 Total:    ${verses.length} verses processed`);
    console.log('═'.repeat(50));
}

// Run
ingestBhagavadGita().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
