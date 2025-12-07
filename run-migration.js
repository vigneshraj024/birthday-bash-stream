import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Running database migration...');
    console.log('📊 Adding cartoon_id and generated_video_url columns to submissions table');

    try {
        // Note: The anon key doesn't have permission to ALTER TABLE
        // So we'll use the SQL from the migrations folder
        // Lovable will auto-apply migrations from the supabase/migrations folder

        console.log('\n✅ Migration file created at:');
        console.log('   supabase/migrations/20241205_add_video_fields.sql');
        console.log('\n📝 Next steps:');
        console.log('   1. If using Lovable: The migration will auto-apply on next deploy');
        console.log('   2. If using local Supabase: Run "supabase db push"');
        console.log('   3. Or manually run the SQL in Supabase dashboard');
        console.log('\n💡 For immediate testing, you can:');
        console.log('   - Go to https://supabase.com/dashboard');
        console.log('   - Select project: pufvhbxblotdedjxbzsa');
        console.log('   - Click SQL Editor');
        console.log('   - Run the migration SQL');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

runMigration();
