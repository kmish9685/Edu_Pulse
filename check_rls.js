const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ccyohleyosxyzgrhszlu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeW9obGV5b3N4eXpncmhzemx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjEyNzYsImV4cCI6MjA4MzE5NzI3Nn0.YvH8FTIml-dhoN0A23jXwhTD9tF-WRbku24r3xpRiog';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function checkRLS() {
    console.log('--- RLS CHECK START ---');
    
    // Try to fetch signals for a known block_room (from diagnostic)
    const knownRoom = 'WA95'; 
    const { data: signals, error: signalError } = await supabase
        .from('signals')
        .select('*')
        .eq('block_room', knownRoom);
    
    if (signalError) {
        console.error('Signal Error (ANON):', signalError.message);
    } else {
        console.log(`Signals found with ANON key for ${knownRoom}:`, signals.length);
    }
    
    console.log('--- RLS CHECK END ---');
}

checkRLS();
