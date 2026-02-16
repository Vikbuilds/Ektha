/**
 * Bhagavad Gita Translation Update Script
 * 
 * Replaces word-by-word meanings with full English translations from Swami Sivananda.
 * 
 * Usage: node scripts/update-gita-translations.js
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

// ─── Data source URLs ──────────────────────────────────────────────────
const VERSE_DATA_URL = 'https://raw.githubusercontent.com/gita/gita/master/data/verse.json';
const TRANSLATION_DATA_URL = 'https://raw.githubusercontent.com/gita/gita/master/data/translation.json';

// Author ID 16 is Swami Sivananda
const TARGET_AUTHOR_ID = 16;

async function fetchJSON(url) {
    console.log(`📥 Fetching data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateTranslations() {
    console.log('🕉️  Bhagavad Gita Translation Update');
    console.log('═'.repeat(50));

    // 1. Fetch data
    let verses, translations;
    try {
        verses = await fetchJSON(VERSE_DATA_URL);
        translations = await fetchJSON(TRANSLATION_DATA_URL);
        console.log(`✅ Fetched ${verses.length} verses and ${translations.length} translations\n`);
    } catch (err) {
        console.error('❌ Failed to fetch data:', err.message);
        process.exit(1);
    }

    // 2. Map verse_id to chapter/verse in verse.json
    const verseMap = {}; // verse_id -> { chapter, verse }
    verses.forEach(v => {
        verseMap[v.id] = {
            chapter: v.chapter_number,
            verse: v.verse_number
        };
    });

    // 3. Filter translations for Sivananda and map to shloka code
    const updatePayloads = [];
    translations.forEach(t => {
        if (t.author_id === TARGET_AUTHOR_ID) {
            const vInfo = verseMap[t.verse_id];
            if (vInfo) {
                // Shloka code format: bg-1-{chapter}-{verse}
                const shlokaCode = `bg-1-${vInfo.chapter}-${vInfo.verse}`;
                updatePayloads.push({
                    code: shlokaCode,
                    translation: t.description.trim()
                });
            }
        }
    });

    console.log(`📊 Prepared ${updatePayloads.length} updates for Swami Sivananda's translations.`);

    // 4. Perform updates in batches
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < updatePayloads.length; i++) {
        const payload = updatePayloads[i];

        const { error } = await supabase
            .from('shlokas')
            .update({ translation_english: payload.translation })
            .eq('code', payload.code);

        if (error) {
            console.error(`   ❌ Failed to update ${payload.code}:`, error.message);
            failCount++;
        } else {
            successCount++;
            if (successCount % 50 === 0) {
                console.log(`   ✅ Progress: ${successCount}/${updatePayloads.length} updated...`);
            }
        }

        // Small delay to prevent rate limits
        if (i % 20 === 0) await delay(100);
    }

    console.log('\n' + '═'.repeat(50));
    console.log('🕉️  Update Complete!');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed:  ${failCount}`);
    console.log('═'.repeat(50));
}

updateTranslations().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
