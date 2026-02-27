const { createClient } = require('@supabase/supabase-js');

// Must pass URL and Key as arguments or env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncAdmin() {
    const email = 'admin@edupulse.com';
    console.log(`Checking admin account: ${email}...`);

    // 1. Create or get user
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users', listError.message);
        process.exit(1);
    }

    let user = usersData.users.find(u => u.email === email);
    if (!user) {
        console.log('User not found. Creating admin user...');
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: 'adminpassword123',
            email_confirm: true
        });
        if (createError) {
            console.error('Error creating user', createError.message);
            process.exit(1);
        }
        user = createData.user;
        console.log('Admin user created Auth UUID:', user.id);
    } else {
        console.log('Admin user exists. Auth UUID:', user.id);
        // Reset password just in case
        await supabase.auth.admin.updateUserById(user.id, { password: 'adminpassword123' });
        console.log('Admin password reset to: adminpassword123');
    }

    // 2. Ensure profile exists and role is admin
    console.log('Ensuring profile is admin...');
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, role: 'admin' }, { onConflict: 'id' });

    if (profileError) {
        console.error('Error updating profile role:', profileError.message);
        process.exit(1);
    }

    // Verify
    const { data: finalProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log('Verification DB Profile:', finalProfile);
    console.log('DONE. Please log in with admin@edupulse.com / adminpassword123');
}

syncAdmin();
