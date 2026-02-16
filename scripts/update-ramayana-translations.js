const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Load environment variables ────────────────────────────────────────
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

const KANDA_MAP = {
    'Bala Kanda': 'rm-1',
    'Ayodhya Kanda': 'rm-2',
    'Aranya Kanda': 'rm-3',
    'Kishkindha Kanda': 'rm-4',
    'Sundara Kanda': 'rm-5',
    'Yuddha Kanda': 'rm-6',
    'Uttara Kanda': 'rm-7'
};

async function updateTranslations() {
    console.log('📥 Fetching Ramayana translations dataset...');
    const response = await fetch('https://raw.githubusercontent.com/Ashutosh-Vijay/Valmiki_Ramayan_Dataset/main/data/Valmiki_Ramayan_Shlokas.json');
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const dataset = await response.json();
    console.log(`✅ Loaded ${dataset.length} shlokas with translations.`);

    // Group updates to avoid too many requests
    const BATCH_SIZE = 50;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < dataset.length; i += BATCH_SIZE) {
        const batch = dataset.slice(i, i + BATCH_SIZE);

        const updatePromises = batch.map(async (item) => {
            const kandaCode = KANDA_MAP[item.kanda];
            if (!kandaCode) return;

            const code = `${kandaCode}-${item.sarga}-${item.shloka_number}`;

            // We use explanation as the primary translation, and can append commentary if present
            const translation = item.explanation || '';
            const commentary = item.comments || '';
            const wordMeaning = item.translation || '';

            const { error } = await supabase
                .from('shlokas')
                .update({
                    translation_english: translation,
                    commentary: (wordMeaning ? `**Word Meanings:**\n${wordMeaning}\n\n` : '') + (commentary ? `**Commentary:**\n${commentary}` : '')
                })
                .eq('code', code);

            if (error) {
                // Silently skip if the shloka doesn't exist in our DB (possible due to numbering variations)
                failCount++;
            } else {
                successCount++;
            }
        });

        await Promise.all(updatePromises);

        if (i % 500 === 0) {
            console.log(`⏳ Progress: Processed ${i}/${dataset.length} items...`);
        }
    }

    console.log(`\n🎉 Translation update completed.`);
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`ℹ️  Skipped/Failed: ${failCount} (likely shloka number mismatch)`);
}

updateTranslations().catch(console.error);
