const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

function loadEnv(path) {
  const s = fs.readFileSync(path, 'utf8');
  const lines = s.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) {
      env[m[1]] = m[2].replace(/^"|"$/g, '');
    }
  }
  return env;
}

const env = loadEnv('.env.local');
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing keys in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);
(async () => {
  const { data, error } = await supabase.from('services').select('*').ilike('name', '%Automation Test Service%');
  if (error) {
    console.error('Supabase error:', error);
    process.exit(2);
  }
  console.log('matched services count:', data.length);
  console.log(data.slice(0, 20));
})();
