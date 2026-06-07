let usuarioEpic = null;

// --- FUNCIONES LÓGICAS ---

async function ejecutarPreRegistro() {
    if (!usuarioEpic) {
        alert("Primero debes iniciar sesión con Epic Games para pre-registrarte.");
        return;
    }
    
    console.log("Procesando pre-registro para:", usuarioEpic.preferred_username);
    
    // Aquí insertarías la lógica para guardar en Supabase
    // const { error } = await supabase.from('pre_registros').insert(...)
    
    alert(`¡Gracias, ${usuarioEpic.preferred_username}! Te has pre-registrado correctamente en Echoes of Atramentia.`);
}

function iniciarLoginEpic() {
    const url = `https://www.epicgames.com/id/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=basic_profile`;
    window.location.href = url;
}

// --- EVENTOS DE CARGA ---

window.addEventListener('load', async () => {
    // 1. Vincular botones
    const btnLogin = document.getElementById('btn-login-epic');
    const btnPreregistro = document.getElementById('btn-preregistro');

    if (btnLogin) btnLogin.addEventListener('click', iniciarLoginEpic);
    if (btnPreregistro) btnPreregistro.addEventListener('click', ejecutarPreRegistro);

    // 2. Procesar retorno de Epic (si existe ?code= en la URL)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
            });
            
            const result = await response.json();

            if (response.ok) {
                usuarioEpic = result;
                console.log("Login exitoso. Perfil:", usuarioEpic);
                
                // Limpiar URL para higiene de navegación
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Disparar el pre-registro automáticamente al volver logueado
                ejecutarPreRegistro();
            } else {
                throw new Error(result.error || "Error en la autenticación");
            }
        } catch (err) {
            console.error("Error crítico:", err.message);
            alert("Error al vincular tu cuenta: " + err.message);
        }
    }
});