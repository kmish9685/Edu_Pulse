const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ccyohleyosxyzgrhszlu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeW9obGV5b3N4eXpncmhzemx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjEyNzYsImV4cCI6MjA4MzE5NzI3Nn0.YvH8FTIml-dhoN0A23jXwhTD9tF-WRbku24r3xpRiog';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    try {
        console.log('--- SIGNALS ---');
        const { data: sData, error: sErr } = await supabase.from('signals').select('*').limit(1);
        if (sData && sData.length > 0) console.log('Signals Columns:', Object.keys(sData[0]));
        else if (sErr) console.log('Signals Err:', sErr.message);
        else console.log('Signals: No data to infer columns');

        console.log('\n--- ACTIVE_SESSIONS ---');
        const { data: aData, error: aErr } = await supabase.from('active_sessions').select('*').limit(1);
        if (aData && aData.length > 0) console.log('Active Sessions Columns:', Object.keys(aData[0]));
        else if (aErr) console.log('Active Sessions Err:', aErr.message);
        else console.log('Active Sessions: No data to infer columns');
    } catch (e) {
        console.log('Script Error:', e.message);
    }
}

main();
