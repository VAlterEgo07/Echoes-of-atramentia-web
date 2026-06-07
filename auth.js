// auth.js

// 1. Inicialización ÚNICA de Supabase
const supabaseUrl = 'https://rzyoiufwwlfepxphfdxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eW9pdWZ3d2xmZXB4cGhmZHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0Njc4NzgsImV4cCI6MjA5NjA0Mzg3OH0.X8WUWHjwIxSYoAwPw_8CWJED3WTh-BtCBDwD7yxOs7E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Función para disparar el Login hacia Epic Games
const loginConEpic = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
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

// Asignar el login a los botones (asegurándonos de que existen en la página)
const btnLogin = document.getElementById('btn-login-epic');
const btnPreregistro = document.getElementById('btn-preregistro-epic');

if (btnLogin) btnLogin.addEventListener('click', loginConEpic);
if (btnPreregistro) btnPreregistro.addEventListener('click', loginConEpic);

// 3. Función para procesar el pre-registro cuando el usuario vuelve a la web
const procesarPreregistro = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (session) {
        const userId = session.user.id;

        const { error } = await supabase
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