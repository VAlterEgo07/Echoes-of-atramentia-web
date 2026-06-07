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