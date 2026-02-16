
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
    console.log('Checking connection to:', supabaseUrl);

    // Try to fetch a single row from 'books' table as a test
    const { data, error } = await supabase.from('books').select('id').limit(1);

    if (error) {
        if (error.code === '42P01') {
            console.log('SUCCESS: Connected, but "books" table does not exist yet (expected).');
        } else {
            console.error('ERROR connecting to Supabase:', error.message);
            process.exit(1);
        }
    } else {
        console.log('SUCCESS: Connected and "books" table exists.');
        console.log('Sample data:', data);
    }

    // Check if other tables exist
    const tables = ['sections', 'chapters', 'shlokas'];
    for (const table of tables) {
        const { error: tableError } = await supabase.from(table).select('id').limit(1);
        if (tableError) {
            if (tableError.code === '42P01') {
                console.log(`Table "${table}" does not exist.`);
            } else {
                console.error(`Error checking table "${table}":`, tableError.message);
            }
        } else {
            console.log(`Table "${table}" exists.`);
        }
    }
}

checkConnection();
