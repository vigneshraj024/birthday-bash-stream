// Run Migration Script
// This script applies the migration to your Supabase database
// Run with: node apply-migration.js

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function applyMigration() {
    console.log('🚀 Starting migration...');

    try {
        // Read the migration file
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20251206192351_add_video_generation_columns.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Migration file loaded');
        console.log('📝 SQL:', sql);

        // Note: Supabase JS client doesn't support raw SQL execution
        // You need to use the Supabase SQL Editor or REST API
        console.log('\n⚠️  IMPORTANT:');
        console.log('The Supabase JavaScript client cannot execute raw SQL.');
        console.log('You must run this SQL in the Supabase dashboard:');
        console.log('\n📍 Go to: https://supabase.com/dashboard/project/pufvhbxblotdedjxbzsa/sql/new');
        console.log('\n📋 Copy and paste this SQL:\n');
        console.log('─'.repeat(60));
        console.log(sql);
        console.log('─'.repeat(60));
        console.log('\n✅ Then click "Run"');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

applyMigration();
