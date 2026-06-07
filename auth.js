// --- CONFIGURACIÓN ---
const CONFIG = {
    CLIENT_ID: 'xyza7891ZITUyFwnjvafJ5L9WfxzK92D',
    REDIRECT_URI: 'https://www.echoesofatramentia.com',
    EDGE_FUNCTION_URL: 'https://rzyoiufwwlfepxphfdxy.supabase.co/functions/v1/epic-callback'
};

let usuarioEpic = null;

// --- FUNCIONES ---

function actualizarInterfazLogueado(nombre) {
    const btnLogin = document.getElementById('btn-login-epic');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.innerText = `Hola, ${nombre}`;
        btnLogin.style.opacity = "0.7";
        btnLogin.style.cursor = "default";
    }
}

async function ejecutarPreRegistro() {
    if (!usuarioEpic) {
        alert("Debes iniciar sesión con Epic Games primero.");
        return;
    }

    // 1. Comprobar si ya existe
    const { data: existente } = await atramentiaDB
        .from('preregistros')
        .select('id')
        .eq('id', usuarioEpic.sub)
        .single();

    if (existente) {
        alert("¡Ya estás pre-registrado en Echoes of Atramentia!");
        return;
    }

    // 2. Insertar si no existe
    const { error } = await atramentiaDB
        .from('preregistros')
        .insert([{ id: usuarioEpic.sub }]);

    if (error) {
        console.error("Error:", error);
        alert("Error al intentar el pre-registro.");
    } else {
        alert("¡Pre-registro realizado con éxito!");
    }
}

function iniciarLoginEpic() {
    const url = `https://www.epicgames.com/id/authorize?client_id=${CONFIG.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&scope=basic_profile`;
    window.location.href = url;
}

// --- INICIALIZACIÓN ---
window.addEventListener('load', async () => {
    const btnLogin = document.getElementById('btn-login-epic');
    const btnPreregistro = document.getElementById('btn-preregistro');

    // Recuperar sesión previa si existe
    const sesionGuardada = localStorage.getItem('usuarioEpic');
    if (sesionGuardada) {
        usuarioEpic = JSON.parse(sesionGuardada);
        actualizarInterfazLogueado(usuarioEpic.preferred_username);
    }

    if (btnLogin) btnLogin.addEventListener('click', iniciarLoginEpic);
    if (btnPreregistro) btnPreregistro.addEventListener('click', ejecutarPreRegistro);

    // Procesar retorno de Epic
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && !usuarioEpic) { // Solo si no tenemos usuario ya
        try {
            const response = await fetch(CONFIG.EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
            });
            const result = await response.json();
            
            if (response.ok) {
                usuarioEpic = result;
                localStorage.setItem('usuarioEpic', JSON.stringify(result));
                actualizarInterfazLogueado(result.preferred_username);
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                throw new Error(result.error || "Error");
            }
        } catch (err) {
            console.error("Error:", err.message);
        }
    }
});