

// Run this in browser console (F12) on your app page:
const checkMigration = async () => {
    const { data, error } = await supabase
        .from('approved_kids')
        .select('cartoon_id, generated_video_url')
        .limit(1);

    if (error) {
        if (error.code === 'PGRST204') {
            console.log('❌ MIGRATION NOT APPLIED - Columns do not exist');
            console.log('You need to run the SQL migration in Supabase dashboard');
        } else {
            console.log('❌ Error:', error);
        }
    } else {
        console.log('✅ MIGRATION APPLIED - Columns exist!');
        console.log('Data:', data);
    }
};

checkMigration();
