const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ccyohleyosxyzgrhszlu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeW9obGV5b3N4eXpncmhzemx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyMTI3NiwiZXhwIjoyMDgzMTk3Mjc2fQ.JTQ805F5n2PSRSPQVwd8N0xo-zv1tNW8hJV0BtJaq88';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnostic() {
    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_KEY;

    console.log('--- DIAGNOSTIC START ---');
    
    // 1. Check active sessions
    const { data: sessions, error: sessionError } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('is_active', true)
        .limit(5);
    
    if (sessionError) {
        console.error('Session Error:', sessionError.message);
    } else {
        console.log('Recent active sessions:', sessions.map(s => ({ id: s.id, join_code: s.join_code, is_active: s.is_active })));
    }

    // 2. Check signals
    const { data: signals, error: signalError } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (signalError) {
        console.error('Signal Error:', signalError.message);
    } else {
        console.log('Recent signals:', signals.map(s => ({ id: s.id, type: s.type, block_room: s.block_room, created_at: s.created_at })));
    }
    
    console.log('--- DIAGNOSTIC END ---');
}

diagnostic();
