// auth.js
console.log("Cargando script de auth...");

const btnLogin = document.getElementById('btn-login-epic');

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        console.log("¡Clic detectado! Redirigiendo a Epic...");
        
        // Datos directos para evitar fallos de configuración
        const clientId = 'xyza7891ZITUyFwnjvafJ5L9WfxzK92D';
        const redirectUri = encodeURIComponent('https://www.echoesofatramentia.com');
        const url = `https://www.epicgames.com/id/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=basic_profile`;
        
        window.location.href = url;
    });
} else {
    console.error("¡No se encontró el botón btn-login-epic en la página!");
}

// auth.js

// Al cargar la página, comprueba si volvemos de Epic con un código
window.addEventListener('load', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        console.log("¡Código capturado!: ", code);
        
        try {
            const response = await fetch('https://TU_SUPABASE_ID.supabase.co/functions/v1/epic-callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
            });
            const data = await response.json();
            console.log("Perfil del usuario recibido:", data);
            
            // Aquí ya tienes el nombre de Epic, puedes actualizar tu web:
            document.getElementById('epic-name').textContent = data.displayName;
        } catch (err) {
            console.error("Error al obtener el perfil:", err);
        }
    }
});