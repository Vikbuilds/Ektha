/**
 * Universal Scripture Ingestion Script
 * 
 * Fetches JSON datasets from various sources and populates the Supabase database.
 * Supports: Rigveda, Mahabharata, Ramayana, Srimad Bhagavatam.
 * 
 * Usage: node scripts/ingest-scriptures.js [scripture_key]
 * Example: node scripts/ingest-scriptures.js rigveda
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const Sanscript = require('@indic-transliteration/sanscript');

// ─── Resolve scripture data from command line ──────────────────────────
const scriptureKey = process.argv[2];
if (!scriptureKey) {
    console.error('❌ Please specify a scripture key (e.g., rigveda, mahabharata, ramayana, bhagavatam)');
    process.exit(1);
}

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

// ─── Configuration for different scriptures ─────────────────────────────
const CONFIG = {
    rigveda: {
        book: {
            code: 'rv',
            name_english: 'Rigveda',
            name_hindi: 'ऋग्वेद',
            description: 'The Rigveda is the oldest of the four Vedas and among humanity\'s earliest religious texts.',
            total_shlokas: 10552,
            transliteration: 'Ṛgveda',
            display_order: 2,
        },
        source_base: 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Rigveda/',
        files: Array.from({ length: 10 }, (_, i) => `rigveda_mandala_${i + 1}.json`),
        mapping: {
            section: (item) => ({
                code: `rv-${item.mandala}`,
                name_english: `Mandala ${item.mandala}`,
                name_hindi: `मण्डल ${item.mandala}`,
                section_number: item.mandala,
                display_order: item.mandala
            }),
            chapter: (item) => ({
                chapter_number: item.sukta,
                name_english: `Sukta ${item.sukta}`,
                name_hindi: `सूक्त ${item.sukta}`,
                display_order: item.sukta
            }),
            shlokas: (item) => {
                const content = item.text || '';

                // Sanskrit numerals conversion mapping
                const snumMap = { '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9 };
                const toInt = (s) => [...s].reduce((acc, char) => acc * 10 + (snumMap[char] || 0), 0);

                // Matches ॥ followed by Sanskrit numerals and ॥
                // Example: अ॒ग्निमी॑ळे...॥१॥
                const matches = [...content.matchAll(/([^॥]+)॥([०-९]+)॥/g)];
                const results = [];

                if (matches.length > 0) {
                    matches.forEach(m => {
                        const text = m[1].trim().replace(/^\d+\s*/, ''); // Remove leading western numbers if present
                        const snum = m[2];
                        const num = toInt(snum);

                        if (!isNaN(num) && num > 0) {
                            const translit = Sanscript.t(text, 'devanagari', 'iast');
                            results.push({
                                shloka_number: num,
                                sanskrit: text,
                                transliteration: translit,
                                code: `rv-${item.mandala}-${item.sukta}-${num}`,
                                display_order: num
                            });
                        }
                    });
                } else {
                    console.log(`      DEBUG: Still no matches for Sukta ${item.sukta}. Text start: "${content.substring(0, 30)}..."`);
                }

                const uniqueResults = [];
                const seen = new Set();
                results.forEach(r => {
                    if (!seen.has(r.code)) {
                        uniqueResults.push(r);
                        seen.add(r.code);
                    }
                });

                return uniqueResults;
            }
        }
    },
    mahabharata: {
        book: {
            code: 'mabh',
            name_english: 'Mahabharata',
            name_hindi: 'महाभारत',
            description: 'The Mahabharata is one of the two major Sanskrit epics of ancient India, the other being the Ramayana. It narrates the struggle between two groups of cousins in the Kurukshetra War.',
            total_shlokas: 100000,
            transliteration: 'Mahābhārata',
            display_order: 4,
        },
        source_base: 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Mahabharata/',
        files: Array.from({ length: 18 }, (_, i) => `mahabharata_book_${i + 1}.json`),
        parvaNames: ["Adi Parva", "Sabha Parva", "Vana Parva", "Virata Parva", "Udyoga Parva", "Bhishma Parva", "Drona Parva", "Karna Parva", "Shalya Parva", "Sauptika Parva", "Stri Parva", "Shanti Parva", "Anushasana Parva", "Ashvamedhika Parva", "Ashramavasika Parva", "Mausala Parva", "Mahaprasthanika Parva", "Svargarohana Parva"],
        mapping: {
            section: (item, index) => ({
                code: `mabh-${index + 1}`,
                name_english: CONFIG.mahabharata.parvaNames[index],
                name_hindi: '',
                section_number: index + 1,
                display_order: index + 1
            }),
            chapter: (item) => ({
                chapter_number: item.chapter,
                name_english: `Chapter ${item.chapter}`,
                name_hindi: `अध्याय ${item.chapter}`,
                display_order: item.chapter
            }),
            shlokas: (item) => {
                const text = (item.text || '').trim();
                if (!text) return [];
                const translit = Sanscript.t(text, 'devanagari', 'iast');
                return [{
                    shloka_number: item.shloka,
                    sanskrit: text,
                    transliteration: translit,
                    code: `mabh-${item.book}-${item.chapter}-${item.shloka}`,
                    display_order: item.shloka
                }];
            }
        }
    },
    ramayana: {
        book: {
            code: 'rm',
            name_english: 'Valmiki Ramayana',
            name_hindi: 'वाल्मीकि रामायण',
            description: 'The Valmiki Ramayana is an ancient Indian epic, attributed to the sage Valmiki.',
            total_shlokas: 24000,
            transliteration: 'Vālmīki Rāmāyaṇa',
            display_order: 3,
        },
        source_base: 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/ValmikiRamayana/',
        files: [
            '1_balakanda.json',
            '2_ayodhyakanda.json',
            '3_aranyakanda.json',
            '4_kishkindhakanda.json',
            '5_sundarakanda.json',
            '6_yudhhakanda.json',
            '7_uttarakanda.json'
        ],
        kandaHindiNames: [
            'बालकाण्ड',
            'अयोध्याकाण्ड',
            'अरण्यकाण्ड',
            'किष्किन्धाकाण्ड',
            'सुन्दरकाण्ड',
            'युद्धकाण्ड',
            'उत्तरकाण्ड'
        ],
        mapping: {
            section: (item, index) => ({
                code: `rm-${index + 1}`,
                name_english: CONFIG.ramayana.files[index].split('_')[1].replace('.json', '').replace(/^\w/, c => c.toUpperCase()) + ' Kanda',
                name_hindi: CONFIG.ramayana.kandaHindiNames[index],
                section_number: index + 1,
                display_order: index + 1
            }),
            chapter: (item) => ({
                chapter_number: item.sarg,
                name_english: `Sarga ${item.sarg}`,
                name_hindi: `सर्ग ${item.sarg}`,
                display_order: item.sarg
            }),
            shlokas: (item, sectionCode) => {
                const num = item.shloka;
                let content = item.text.trim();

                // Remove trailing verse markers like ॥१-१-१॥ or ॥१॥
                content = content.replace(/॥[०-९\d\-\s]+॥$/, '').trim();

                if (!content || isNaN(num)) return [];

                const translit = Sanscript.t(content, 'devanagari', 'iast');
                return [{
                    shloka_number: num,
                    sanskrit: content,
                    transliteration: translit,
                    code: `${sectionCode}-${item.sarg}-${num}`,
                    display_order: num
                }];
            }
        }
    }
    // Add more configurations as needed
};

const config = CONFIG[scriptureKey];
if (!config) {
    console.error(`❌ No configuration found for scripture: ${scriptureKey}`);
    process.exit(1);
}

// ─── Helper: fetch JSON ────────────────────────────────────────────────
async function fetchJSON(url) {
    console.log(`📥 Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    return response.json();
}

// ─── Helper: delay ─────────────────────────────────────────────────────
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ─── Main Ingestion ────────────────────────────────────────────────────
async function startIngestion() {
    console.log(`🕉️  Starting Ingestion for: ${config.book.name_english}`);

    // 1. Ensure Book exists
    let { data: book, error: bookError } = await supabase
        .from('books')
        .select('id')
        .eq('code', config.book.code)
        .single();

    if (bookError || !book) {
        const { data: newBook, error: createError } = await supabase
            .from('books')
            .insert(config.book)
            .select('id')
            .single();
        if (createError) throw createError;
        book = newBook;
        console.log(`✅ Created Book: ${config.book.name_english}`);
    } else {
        console.log(`ℹ️ Book already exists: ${config.book.name_english}`);
    }

    // 2. Process Files
    for (let fileIdx = 0; fileIdx < config.files.length; fileIdx++) {
        const fileName = config.files[fileIdx];
        const data = await fetchJSON(config.source_base + fileName);

        console.log(`📄 Processing: ${fileName} (${data.length} items)`);

        // a. Ensure Section exists
        const firstItem = data[0];
        const sectionData = config.mapping.section(firstItem, fileIdx);
        let { data: section } = await supabase
            .from('sections')
            .select('id')
            .eq('book_id', book.id)
            .eq('code', sectionData.code)
            .single();

        if (!section) {
            const { data: newSection } = await supabase
                .from('sections')
                .insert({ ...sectionData, book_id: book.id })
                .select('id')
                .single();
            section = newSection;
            console.log(`✅ Created Section: ${sectionData.name_english}`);
        }

        // Group shlokas by chapter
        const chaptersMap = new Map();
        for (const item of data) {
            const chapData = config.mapping.chapter(item);
            const chapNum = chapData.chapter_number;
            if (!chaptersMap.has(chapNum)) {
                chaptersMap.set(chapNum, {
                    data: chapData,
                    shlokas: []
                });
            }
            const itemShlokas = config.mapping.shlokas(item, sectionData.code);
            chaptersMap.get(chapNum).shlokas.push(...itemShlokas);
        }

        console.log(`📦 Grouped into ${chaptersMap.size} chapters. Starting batch inserts...`);

        // b. Process Chapters and their Shlokas
        for (const [chapNum, group] of chaptersMap) {
            let { data: chapter } = await supabase
                .from('chapters')
                .select('id')
                .eq('section_id', section.id)
                .eq('chapter_number', chapNum)
                .single();

            if (!chapter) {
                const { data: newChapter } = await supabase
                    .from('chapters')
                    .insert({ ...group.data, section_id: section.id })
                    .select('id')
                    .single();
                chapter = newChapter;
            }

            // Batch insert shlokas for this chapter
            if (group.shlokas.length > 0) {
                const { data: existing } = await supabase
                    .from('shlokas')
                    .select('shloka_number')
                    .eq('chapter_id', chapter.id);

                const existingNums = new Set(existing ? existing.map(s => s.shloka_number) : []);
                const toInsert = group.shlokas
                    .filter(s => !existingNums.has(s.shloka_number))
                    .map(s => ({ ...s, chapter_id: chapter.id }));

                if (toInsert.length > 0) {
                    process.stdout.write(`  Inserting ${toInsert.length} shlokas for Ch ${chapNum}... `);
                    const { error: iError } = await supabase
                        .from('shlokas')
                        .insert(toInsert);

                    if (iError) {
                        console.error(`❌ Error in Ch ${chapNum}:`, iError.message);
                    } else {
                        console.log('✅');
                    }
                }
            }
            await delay(20);
        }
    }

    console.log(`🎉 Ingestion completed for: ${config.book.name_english}`);
}

startIngestion().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
