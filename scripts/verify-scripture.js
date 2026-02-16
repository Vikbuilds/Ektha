/**
 * Scripture Verification Script
 */

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

async function verify() {
    console.log('🔍 Verifying Data...');

    // Check Rigveda
    const { data: book } = await supabase.from('books').select('id').eq('code', 'rv').single();
    if (!book) {
        console.log('❌ Rigveda book not found');
        return;
    }

    const { data: shlokas, error } = await supabase
        .from('shlokas')
        .select(`id, code, sanskrit, transliteration, translation_english`)
        .ilike('code', 'rv-%')
        .limit(10);

    if (error) {
        console.error('❌ Error fetching shlokas:', error.message);
        return;
    }

    if (!shlokas || shlokas.length === 0) {
        console.log('❌ No shlokas found with code starting with "rv-"');
        // Let's check what's in there at all
        const { data: allShlokas } = await supabase.from('shlokas').select('code').limit(5);
        console.log('Sample shlokas in DB:', allShlokas.map(s => s.code));
        return;
    }

    console.log(`✅ Found ${shlokas.length} test shlokas in Rigveda`);
    shlokas.forEach((s, i) => {
        console.log(`\n--- Verse ${s.code} ---`);
        console.log(`Sanskrit: ${s.sanskrit.substring(0, 50)}...`);
        console.log(`Transliteration: ${s.transliteration ? 'PRESENT' : 'MISSING'}`);
        console.log(`Translation: ${s.translation_english ? 'PRESENT' : 'MISSING'}`);
    });
}

verify();
