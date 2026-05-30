const personajesDatos = [
    {
        nombre: "Destrucción",
        imagen: "Assets/destruccion.png",
        descripcion: "Estos personajes tienen una mentalidad muy hiperactiva, es decir, siempre necesitan estar haciendo algo. A nivel de combate, son los más veloces lanzando hechizos, aunque estos no suelen estar tan bien dibujados, por lo que su daño por hechizo suele ser más mediocre."
    },
    {
        nombre: "Concentración",
        imagen: "Assets/concentracion.png",
        descripcion: "Son los más perfeccionistas a la hora de realizar hechizos. Estos personajes suelen tardar más en lanzar hechizos y en recargarlos pero suelen hacer mucho daño debido a su perfección."
    },
    {
        nombre: "Equilibrio",
        imagen: "Assets/equilibrio.png",
        descripcion: "Estos son todos aquellos personajes que no buscan perfección absoluta sino un buen resultado, aunque sus hechizos no son tan potentes como los de los personajes de Concentración, siguen teniendo bastante daño. Además, tienen más velocidad a la hora de lanzar hechizos y recargar habilidades."
    },
    {
        nombre: "Soporte",
        imagen: "Assets/soporte.png",
        descripcion: "Estos personajes son mediocres y hacen poco daño en combate, pero se especializan en sanar y apoyar a todos los miembros del equipo."
    }
];

let indiceActual = 0;
const contenedorContenido = document.getElementById('character-content');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

// Función para pintar el HTML del personaje actual en el visor interactivo
function renderizarPersonaje(indice) {
    const personaje = personajesDatos[indice];
    
    // Pequeño efecto de fundido para que el cambio de página sea suave
    contenedorContenido.style.opacity = 0;
    
    setTimeout(() => {
        contenedorContenido.innerHTML = `
            <div class="active-character">
                <img src="${personaje.imagen}" alt="${personaje.nombre}" onerror="this.src='https://via.placeholder.com/80?text=?'">
                <div class="active-character-info">
                    <h3>${personaje.nombre}</h3>
                    <p>${personaje.descripcion}</p>
                    <span style="font-size: 0.85rem; opacity: 0.6;">(Página ${indice + 1} de ${personajesDatos.length})</span>
                </div>
            </div>
        `;
        contenedorContenido.style.opacity = 1;
    }, 150); // El tiempo coincide con la transición en CSS
}

// Inicializar el primer personaje al cargar la web
document.addEventListener('DOMContentLoaded', () => {
    if(contenedorContenido) {
        renderizarPersonaje(indiceActual);
    }
});

// Asignar los eventos a los botones de navegación
if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
        indiceActual++;
        if (indiceActual >= personajesDatos.length) {
            indiceActual = 0; // Vuelve al principio si llega al final
        }
        renderizarPersonaje(indiceActual);
    });

    btnPrev.addEventListener('click', () => {
        indiceActual--;
        if (indiceActual < 0) {
            indiceActual = personajesDatos.length - 1; // Va al final si estás en el principio
        }
        renderizarPersonaje(indiceActual);
    });
}