// auth.js

// 2. Función para disparar el Login hacia Epic Games
const loginConEpic = async () => {
    // Usamos nuestra nueva constante atramentiaDB
    const { data, error } = await atramentiaDB.auth.signInWithOAuth({
        provider: 'custom:epic-games', 
        options: {
            redirectTo: 'https://www.echoesofatramentia.com' 
        }
    });

    if (error) {
        console.error("Error al iniciar sesión:", error.message);
        alert("Hubo un problema al conectar con Epic Games.");
    }
};

// Asignar el login a los botones
const btnLogin = document.getElementById('btn-login-epic');
const btnPreregistro = document.getElementById('btn-preregistro-epic');

if (btnLogin) btnLogin.addEventListener('click', loginConEpic);
if (btnPreregistro) btnPreregistro.addEventListener('click', loginConEpic);

// 3. Función para procesar el pre-registro
const procesarPreregistro = async () => {
    // Usamos atramentiaDB para obtener la sesión
    const { data: { session }, error: sessionError } = await atramentiaDB.auth.getSession();

    if (session) {
        const userId = session.user.id;

        // Usamos atramentiaDB para insertar los datos
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
            alert("¡Pre-registro completado con éxito! Tus recompensas están aseguradas para el lanzamiento.");
        }
    }
};

// Ejecutar la comprobación nada más cargar la página
document.addEventListener('DOMContentLoaded', procesarPreregistro);