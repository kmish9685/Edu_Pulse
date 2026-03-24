const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- SIGNALS ---');
    const { data: sData, error: sErr } = await supabase.from('signals').select('*').limit(1);
    if (sData && sData[0]) console.log('Signals Columns:', Object.keys(sData[0]));
    else console.log('Signals Err/Empty:', sErr?.message);

    console.log('\n--- ACTIVE_SESSIONS ---');
    const { data: aData, error: aErr } = await supabase.from('active_sessions').select('*').limit(1);
    if (aData && aData[0]) console.log('Active Sessions Columns:', Object.keys(aData[0]));
    else console.log('Active Sessions Err/Empty:', aErr?.message);
}

main();
