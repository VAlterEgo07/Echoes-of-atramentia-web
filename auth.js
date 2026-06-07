// auth.js
const loginConEpic = () => {
    // Redirigir al usuario a Epic Games sin pasar por Supabase
    const clientId = 'xyza7891ZITUyFwnjvafJ5L9WfxzK92D';
    const redirectUri = encodeURIComponent('https://www.echoesofatramentia.com');
    window.location.href = `https://www.epicgames.com/id/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=basic_profile`;
};

// Al cargar, si vemos un ?code= en la URL, lo procesamos
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        // AQUÍ ESTÁ EL TRUCO:
        // En lugar de llamar a Supabase, llamamos a un servicio que tú controles 
        // o directamente guardamos el ID de Epic en Supabase 
        // una vez que confirmamos que el login fue exitoso.
        console.log("¡Código recibido de Epic:", code);
        // Aquí llamarías a una función tuya que valide el código
    }
});