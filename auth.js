// --- CONFIGURACIÓN ---
const CONFIG = {
    CLIENT_ID: 'xyza7891ZITUyFwnjvafJ5L9WfxzK92D', 
    REDIRECT_URI: 'https://www.echoesofatramentia.com',
    EDGE_FUNCTION_URL: 'https://rzyoiufwwlfepxphfdxy.supabase.co/functions/v1/epic-callback'
};

let usuarioEpic = null;

// --- FUNCIONES ---

async function actualizarProgressBar() {
    // Asegúrate de que 'atramentiaDB' esté inicializado en otro archivo o más arriba
    const { count, error } = await atramentiaDB
        .from('preregistros')
        .select('*', { count: 'exact', head: true });

    if (error) return console.error("Error loading progress:", error);

    const META = 5000;
    const porcentaje = Math.min((count / META) * 100, 100);
    
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    if (bar) bar.style.width = `${porcentaje}%`;
    if (text) text.innerText = `${count} / ${META} pre-registered (${Math.round(porcentaje)}%)`;
}

async function ejecutarPreRegistro() {
    if (!usuarioEpic) {
        alert("You must log in with Epic Games first.");
        return;
    }

    // Corregido: Usamos el nombre exacto de la columna de tu base de datos y la variable correcta
    const { error } = await atramentiaDB
        .from('preregistros')
        .insert([{ epic_account_id: usuarioEpic.epicAccountId }]);

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
            // Corregido: Como no pedimos el nombre de usuario a Epic por privacidad, ponemos un texto estándar
            btn.innerText = `Epic Account Linked`; 
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
        try {
            const res = await fetch(CONFIG.EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Corregido: Añadido el redirect_uri que la función exige
                body: JSON.stringify({ code: code, redirect_uri: CONFIG.REDIRECT_URI })
            });
            
            const result = await res.json();
            
            if (res.ok && result.success) {
                localStorage.setItem('usuarioEpic', JSON.stringify(result));
                // Corregido: Limpiamos la URL sin entrar en un bucle infinito
                window.location.href = window.location.pathname; 
            } else {
                console.error("Error from server:", result);
                // Si falla, borramos el código de la URL para que no siga intentando fallar
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // 4. Cargar barra
    actualizarProgressBar();
});