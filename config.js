// 1. Inicialización de Supabase a prueba de duplicados
const supabaseUrl = 'https://rzyoiufwwlfepxphfdxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eW9pdWZ3d2xmZXB4cGhmZHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0Njc4NzgsImV4cCI6MjA5NjA0Mzg3OH0.X8WUWHjwIxSYoAwPw_8CWJED3WTh-BtCBDwD7yxOs7E';

// Si no existe, la creamos y la guardamos en global (window)
if (!window.miSupabase) {
    window.miSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);
}

// Usamos la instancia global
const supabase = window.miSupabase;