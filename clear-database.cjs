// Script to clear all birthday data from Supabase database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials in environment variables');
    console.error('SUPABASE_URL:', SUPABASE_URL);
    console.error('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Found' : 'Missing');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function clearAllData() {
    console.log('🗑️  Starting to clear all birthday data...\n');

    try {
        // Delete all approved kids
        console.log('Deleting all approved kids...');
        const { error: approvedError } = await supabase
            .from('approved_kids')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (approvedError) {
            console.error('Error deleting approved kids:', approvedError);
        } else {
            console.log(`✅ Deleted all approved kids`);
        }

        // Delete all submissions
        console.log('\nDeleting all submissions...');
        const { error: submissionsError } = await supabase
            .from('submissions')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (submissionsError) {
            console.error('Error deleting submissions:', submissionsError);
        } else {
            console.log(`✅ Deleted all submissions`);
        }

        // Verify tables are empty
        console.log('\n📊 Verifying data deletion...');

        const { count: remainingApproved } = await supabase
            .from('approved_kids')
            .select('*', { count: 'exact', head: true });

        const { count: remainingSubmissions } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true });

        console.log(`\nApproved kids remaining: ${remainingApproved || 0}`);
        console.log(`Submissions remaining: ${remainingSubmissions || 0}`);

        if ((remainingApproved || 0) === 0 && (remainingSubmissions || 0) === 0) {
            console.log('\n✨ All data successfully cleared!');
        } else {
            console.log('\n⚠️  Some data may still remain. Please check manually.');
        }

    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
}

// Run the script
clearAllData();
