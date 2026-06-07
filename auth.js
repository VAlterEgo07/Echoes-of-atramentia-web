// --- CONFIGURACIÓN ---
const CONFIG = {
    CLIENT_ID: 'xyza7891ZITUyFwnjvafJ5L9WfxzK92D',
    REDIRECT_URI: 'https://www.echoesofatramentia.com',
    EDGE_FUNCTION_URL: 'https://rzyoiufwwlfepxphfdxy.supabase.co/functions/v1/epic-callback'
};

let usuarioEpic = null;

// --- FUNCIONES ---

async function actualizarProgressBar() {
    const { count, error } = await atramentiaDB
        .from('prerregistros')
        .select('*', { count: 'exact', head: true });

    if (error) return console.error("Error loading progress:", error);

    const META = 5000;
    const porcentaje = Math.min((count / META) * 100, 100);
    
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    if (bar) bar.style.width = `${porcentaje}%`;
    if (text) text.innerText = `${count} / ${META} pre-registered (${Math.round(porcentaje)}%)`;
}

// En auth.js, cambia la función a esta versión simple:
async function ejecutarPreRegistro() {
    if (!usuarioEpic) {
        alert("You must log in with Epic Games first.");
        return;
    }

    // Usamos .insert simple. Si da error de llave duplicada, 
    // significa que ya está registrado.
    const { error } = await atramentiaDB
        .from('prerregistros')
        .insert([{ epic_id: usuarioEpic.sub }]);

    if (error) {
        if (error.code === '23505') {
            alert("You are already pre-registered!");
        } else {
            console.error("Technical error:", error);
            alert("Error: " + error.message);
        }
    } else {
        alert("Pre-registration successful!");
        actualizarProgressBar();
    }
}

// --- INICIALIZACIÓN ---
window.addEventListener('load', async () => {
    // 1. Cargar estado de Login
    const sesion = localStorage.getItem('usuarioEpic');
    if (sesion) {
        usuarioEpic = JSON.parse(sesion);
        const btn = document.getElementById('btn-login-epic');
        if (btn) {
            btn.disabled = true;
            btn.innerText = `Hello, ${usuarioEpic.preferred_username}`;
        }
    }

    // 2. Eventos
    document.getElementById('btn-login-epic')?.addEventListener('click', () => {
        window.location.href = `https://www.epicgames.com/id/authorize?client_id=${CONFIG.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&scope=basic_profile`;
    });
    
    document.getElementById('btn-preregistro')?.addEventListener('click', ejecutarPreRegistro);

    // 3. Procesar retorno de Epic
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && !usuarioEpic) {
        const res = await fetch(CONFIG.EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const result = await res.json();
        if (res.ok) {
            localStorage.setItem('usuarioEpic', JSON.stringify(result));
            location.reload(); // Recargamos para limpiar URL y aplicar estado
        }
    }

    // 4. Cargar barra
    actualizarProgressBar();
});