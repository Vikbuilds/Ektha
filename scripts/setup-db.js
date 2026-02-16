/**
 * Database Setup Script
 * 
 * Creates the required tables (books, sections, chapters, shlokas) in Supabase
 * using the REST API to execute SQL via the Supabase Management API.
 * 
 * Since we're using the anon key (not service_role), we'll create tables
 * via individual insert operations after running the SQL in Supabase Dashboard.
 * 
 * This script generates the SQL you need to run in the Supabase SQL Editor.
 * 
 * Usage: node scripts/setup-db.js
 */

const sql = `
-- ═══════════════════════════════════════════════════════════════
-- Tatva Database Schema
-- Ancient Hindu Scriptures Digital Library
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Books Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL,
  name_hindi TEXT NOT NULL,
  description TEXT,
  total_shlokas INTEGER,
  transliteration TEXT,
  display_order INTEGER,
  has_translation_english BOOLEAN DEFAULT true,
  content_format TEXT DEFAULT 'verse',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Sections Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  section_number INTEGER DEFAULT 1,
  name_english TEXT NOT NULL,
  name_hindi TEXT NOT NULL,
  description TEXT,
  transliteration TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Chapters Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  name_english TEXT,
  name_hindi TEXT,
  description TEXT,
  total_shlokas INTEGER,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Shlokas Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shlokas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  shloka_number INTEGER NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT,
  translation_english TEXT,
  translation_hindi TEXT,
  commentary TEXT,
  is_highlighted BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sections_book_id ON public.sections(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_section_id ON public.chapters(section_id);
CREATE INDEX IF NOT EXISTS idx_shlokas_chapter_id ON public.shlokas(chapter_id);
CREATE INDEX IF NOT EXISTS idx_shlokas_code ON public.shlokas(code);
CREATE INDEX IF NOT EXISTS idx_books_code ON public.books(code);

-- ─── Row Level Security ───────────────────────────────────────
-- Enable RLS but allow public read access (this is public content)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shlokas ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY IF NOT EXISTS "Allow public read access on books"
  ON public.books FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on sections"
  ON public.sections FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on chapters"
  ON public.chapters FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on shlokas"
  ON public.shlokas FOR SELECT USING (true);

-- Public insert access (for ingestion scripts using anon key)
CREATE POLICY IF NOT EXISTS "Allow public insert on books"
  ON public.books FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on sections"
  ON public.sections FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on chapters"
  ON public.chapters FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on shlokas"
  ON public.shlokas FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- Schema created successfully!
-- ═══════════════════════════════════════════════════════════════
`;

console.log('═'.repeat(60));
console.log('📋 TATVA DATABASE SETUP SQL');
console.log('═'.repeat(60));
console.log('');
console.log('Please copy the SQL below and run it in your Supabase');
console.log('SQL Editor at:');
console.log('');
console.log('  https://kwwgdxadrsynpidefscf.supabase.co');
console.log('  → SQL Editor → New query → Paste & Run');
console.log('');
console.log('═'.repeat(60));
console.log(sql);
console.log('═'.repeat(60));
console.log('');
console.log('After running the SQL above, execute the ingestion script:');
console.log('  node scripts/ingest-gita.js');
console.log('');
