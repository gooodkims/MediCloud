const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTable() {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    console.log('Error:', error);
}
checkTable();
