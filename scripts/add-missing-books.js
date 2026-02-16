
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

const supabase = createClient(supabaseUrl, supabaseKey);

const BOOKS_TO_ADD = [
    {
        code: 'rm',
        name_english: 'Ramayana',
        name_hindi: 'रामायण',
        description: 'The Ramayana is one of the two major Sanskrit epics of ancient India. It narrates the life of Rama, a legendary prince of the Kosala Kingdom.',
        transliteration: 'Rāmāyaṇa',
        display_order: 3
    },
    {
        code: 'mb',
        name_english: 'Mahabharata',
        name_hindi: 'महाभारत',
        description: 'The Mahabharata is an epic narrative of the Kurukshetra War and the fates of the Kaurava and the Pandava princes.',
        transliteration: 'Mahābhārata',
        display_order: 4
    },
    {
        code: 'sbp',
        name_english: 'Srimad Bhagavatam',
        name_hindi: 'श्रीमद्भागवतम्',
        description: 'The Bhagavata Purana, also known as Srimad Bhagavatam, is one of the 18 major Puranas that focuses on bhakti to Krishna.',
        transliteration: 'Śrīmad Bhāgavatam',
        display_order: 5
    },
    {
        code: 'dm',
        name_english: 'Devi Mahatmyam',
        name_hindi: 'देवीमाहात्म्यम्',
        description: 'The Devi Mahatmyam describes the victory of the Goddess Durga over the demon Mahishasura.',
        transliteration: 'Devī Māhātmyam',
        display_order: 6
    },
    {
        code: 'ms',
        name_english: 'Manu Smriti',
        name_hindi: 'मनुस्मृति',
        description: 'The Laws of Manu, an ancient legal text providing guidelines for dharma and social conduct.',
        transliteration: 'Manusmṛti',
        display_order: 7
    },
    {
        code: 'yv',
        name_english: 'Yoga Vasishtha',
        name_hindi: 'योगवासिष्ठ',
        description: 'A philosophical text attributed to Maharishi Valmiki, depicting a dialogue between Prince Rama and Sage Vasishtha.',
        transliteration: 'Yoga Vāsiṣṭha',
        display_order: 8
    },
    {
        code: 'mp',
        name_english: 'Markandeya Purana',
        name_hindi: 'मार्कण्डेय पुराण',
        description: 'One of the major Puranas, containing a dialogue between Sage Markandeya and Jaimini.',
        transliteration: 'Mārkaṇḍeya Purāṇa',
        display_order: 9
    },
    {
        code: 'ro',
        name_english: 'Ramopakyana',
        name_hindi: 'रामोपाख्यान',
        description: 'The summary of Ramayana found within the Vana Parva of its epic sibling, Mahabharata.',
        transliteration: 'Rāmopākhyāna',
        display_order: 10
    },
    {
        code: 'ph',
        name_english: 'Parashara Smriti',
        name_hindi: 'पराशर स्मृति',
        description: 'A code of laws for the Kali Yuga attributed to the sage Parashara.',
        transliteration: 'Parāśara Smṛti',
        display_order: 11
    }
];

async function addMissingBooks() {
    console.log('Adding missing books to database...');
    for (const book of BOOKS_TO_ADD) {
        const { data, error: checkError } = await supabase
            .from('books')
            .select('id')
            .eq('code', book.code)
            .single();

        if (checkError || !data) {
            const { error: insertError } = await supabase
                .from('books')
                .insert(book);

            if (insertError) {
                console.error(`Error adding ${book.name_english}:`, insertError.message);
            } else {
                console.log(`✅ Added ${book.name_english}`);
            }
        } else {
            console.log(`ℹ️ ${book.name_english} already exists.`);
        }
    }
}

addMissingBooks();
