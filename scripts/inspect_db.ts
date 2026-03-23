import { createClient } from '@supabase/supabase-js';

const url = 'https://ccyohleyosxyzgrhszlu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeW9obGV5b3N4eXpncmhzemx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyMTI3NiwiZXhwIjoyMDgzMTk3Mjc2fQ.JTQ805F5n2PSRSPQVwd8N0xo-zv1tNW8hJV0BtJaq88';

const supabase = createClient(url, key);

async function inspect() {
  const { data: signals, error: sigError } = await supabase.from('signals').select('*').limit(1);
  if (sigError) console.error('Sig Error:', sigError);
  else console.log('Signals columns:', Object.keys(signals[0] || {}));

  const { data: sessions, error: sessError } = await supabase.from('active_sessions').select('*').limit(1);
  if (sessError) console.error('Sess Error:', sessError);
  else console.log('Session columns:', Object.keys(sessions[0] || {}));
}

inspect();
