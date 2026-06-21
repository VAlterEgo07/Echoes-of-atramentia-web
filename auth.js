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
    const btnPromo = document.getElementById('btn-preregistro');
    const btnNav = document.getElementById('btn-login-epic');

    const { error } = await atramentiaDB
        .from('preregistros')
        .insert([{ epic_id: usuarioEpic.sub }]); // Usamos .sub

    if (error) {
        if (error.code === '23505') {
            alert("You are already pre-registered!");
            if (btnPromo) {
                btnPromo.innerText = "Already Pre-registered!";
                btnPromo.style.backgroundColor = "#4CAF50";
                btnPromo.disabled = true;
            }
        } else {
            console.error("Technical error:", error);
            alert("Error: " + error.message);
        }
    } else {
        alert("Pre-registration successful!");
        if (btnPromo) {
            btnPromo.innerText = "Already Pre-registered!";
            btnPromo.style.backgroundColor = "#4CAF50";
            btnPromo.disabled = true;
        }
        actualizarProgressBar();
    }
}

// --- LÓGICA PRINCIPAL AL CARGAR ---
window.addEventListener('load', async () => {
    const btnNav = document.getElementById('btn-login-epic');
    const btnPromo = document.getElementById('btn-preregistro');

    // 1. Cargar estado de Login y comprobar registro
    const sesion = localStorage.getItem('usuarioEpic');
    if (sesion) {
        usuarioEpic = JSON.parse(sesion);
        
        const { count, error } = await atramentiaDB
            .from('preregistros')
            .select('*', { count: 'exact', head: true })
            .eq('epic_id', usuarioEpic.sub);
            
        if (btnNav) {
            btnNav.disabled = true;
            if (count > 0) {
                // Ya está en la base de datos
                btnNav.innerText = `Welcome, ${usuarioEpic.preferred_username}!`;
                if (btnPromo) {
                    btnPromo.innerText = "Already Pre-registered!";
                    btnPromo.style.backgroundColor = "#4CAF50";
                    btnPromo.disabled = true;
                }
            } else {
                // Logueado, pero falta darle al botón
                btnNav.innerText = `Welcome, ${usuarioEpic.preferred_username}!`; 
                if (btnPromo) {
                    btnPromo.innerText = "Complete Pre-registration";
                }
            }
        }
    }

    // 2. Eventos de los botones
    const iniciarSesionEpic = () => {
        // Redirigimos a Epic con el prompt=consent
        window.location.href = `https://www.epicgames.com/id/authorize?client_id=${CONFIG.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&scope=&%20presence&prompt=consent`;
    };

    btnNav?.addEventListener('click', () => {
        if (!usuarioEpic) iniciarSesionEpic();
    });
    
    btnPromo?.addEventListener('click', () => {
        if (!usuarioEpic) {
            iniciarSesionEpic();
        } else {
            ejecutarPreRegistro();
        }
    });

    // 3. Procesar el retorno de la pasarela de Epic Games
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && !usuarioEpic) {
        try {
            const res = await fetch(CONFIG.EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code, redirect_uri: CONFIG.REDIRECT_URI })
            });
            
            const result = await res.json();
            
            // Comprobamos que el servidor haya devuelto el ID (sub)
            if (res.ok && result.sub) {
                localStorage.setItem('usuarioEpic', JSON.stringify(result));
                window.location.href = window.location.pathname; // Escoba activada
            } else {
                console.error("Error from server:", result);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // 4. Cargar datos de la barra al entrar
    actualizarProgressBar();
});