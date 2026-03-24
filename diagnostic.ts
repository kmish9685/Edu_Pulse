import { createClient } from './utils/supabase/server';

async function main() {
    const supabase = await createClient();
    console.log('--- SIGNALS TABLE ---');
    const { data: sData, error: sErr } = await supabase.from('signals').select('*').limit(1);
    if (sErr) console.log('Signals Error:', sErr.message);
    else if (sData && sData[0]) console.log('Signals Columns:', Object.keys(sData[0]));
    else console.log('Signals: No data to infer columns');

    console.log('\n--- ACTIVE_SESSIONS TABLE ---');
    const { data: aData, error: aErr } = await supabase.from('active_sessions').select('*').limit(1);
    if (aErr) console.log('Active Sessions Error:', aErr.message);
    else if (aData && aData[0]) console.log('Active Sessions Columns:', Object.keys(aData[0]));
    else console.log('Active Sessions: No data to infer columns');
}

main();
