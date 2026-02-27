export default function EnvTest() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Env Var Test</h1>
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'UNDEFINED'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (Hidden)' : 'UNDEFINED'}</p>
        </div>
    )
}
