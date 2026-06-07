// auth.js

const loginConEpic = async () => {
    const { data, error } = await atramentiaDB.auth.signInWithOAuth({
        provider: 'epicgames', // <-- Así de simple
        options: {
            redirectTo: 'https://www.echoesofatramentia.com',
            scopes: 'openid basic_profile presence' // Separados por espacio
        }
    });

    if (error) {
        console.error("Error al iniciar sesión:", error.message);
        alert("Hubo un problema al conectar con Epic Games.");
    }
};

// 2. Variables de la interfaz
const btnLogin = document.getElementById('btn-login-epic');
const btnPreregistro = document.getElementById('btn-preregistro-epic');
const userInfoDiv = document.getElementById('user-info');
const epicNameSpan = document.getElementById('epic-name');
const btnLogout = document.getElementById('btn-logout');

// Asignar el login a los botones
if (btnLogin) btnLogin.addEventListener('click', loginConEpic);
if (btnPreregistro) btnPreregistro.addEventListener('click', loginConEpic);

// Asignar el logout (Cerrar sesión)
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        await atramentiaDB.auth.signOut();
        window.location.reload(); // Recargamos la página para resetear la vista
    });
}

// 3. Función principal para procesar sesión y pre-registro
const procesarPreregistro = async () => {
    const { data: { session }, error: sessionError } = await atramentiaDB.auth.getSession();

    // Si el usuario tiene una sesión activa...
    if (session) {
        // --- A. ACTUALIZAR LA INTERFAZ CON EL NOMBRE DE EPIC ---
        
        const metadata = session.user.user_metadata;
        // Epic Games suele devolver el nombre bajo 'preferred_username', 'name' o 'full_name'
        const nombreEpic = metadata.preferred_username || metadata.name || metadata.full_name || 'Pionero/a';

        // Ocultar el botón de login y mostrar el nombre
        if (btnLogin) btnLogin.style.display = 'none';
        if (userInfoDiv) userInfoDiv.style.display = 'flex';
        if (epicNameSpan) epicNameSpan.textContent = nombreEpic;

        // Cambiar el botón principal de la página para que sepa que ya está listo
        if (btnPreregistro) {
            btnPreregistro.textContent = '¡Pre-registro Completado!';
            btnPreregistro.style.pointerEvents = 'none'; // Desactiva el clic
            btnPreregistro.style.opacity = '0.7';
        }

        // --- B. LÓGICA DE BASE DE DATOS (Pre-registro) ---
        
        const userId = session.user.id;
        const { error } = await atramentiaDB
            .from('preregistros')
            .insert([
                { id: userId, recompensa_reclamada: true }
            ]);

        if (error) {
            if (error.code === '23505') {
                console.log("El jugador ya estaba pre-registrado. Todo correcto.");
            } else {
                console.error("Error al registrar en la BD:", error.message);
            }
        } else {
            // Solo salta la alerta si es la PRIMERA vez que se registra
            alert(`¡Bienvenido/a ${nombreEpic}! Tu pre-registro se ha completado con éxito. Tus recompensas te esperan.`);
        }
    }
};

// Ejecutar la comprobación nada más cargar la página
document.addEventListener('DOMContentLoaded', procesarPreregistro);