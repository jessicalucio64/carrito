const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const total = document.querySelector('#total').textContent;
const precioTotal = document.querySelector('#precioTotal');
const input = document.querySelector('#buscador');
const columnas = document.querySelector('#columnas');

let articulosCarrito = [];
let calcularTotal = 0;

function cargarCursos() {
    console.log("CARGANDO");
    fetch("../js/cursos.json").then(curso => {
        return curso.json();
    }).then(data => {
        let datos = data.cursos;
        datos.forEach(cursito => {
            const dive = document.createElement('div');
            dive.innerHTML =
                `<div class="card card__custom">
            <img src="${cursito.imagen}" class="imagen-curso u-full-width">
            <div class="info-card info-card__custom">
                <h4 class="titulo-nuevo">${cursito.titulo}</h4>
                <p>${cursito.autor}</p>
                <img src="img/estrellas.png">
                <p class="precio">$200 <span class="u-pull-right ">$<span class="valor">${cursito.precio}</span></span></p>
                <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${cursito.id}">Agregar
                    Al Carrito</a>
            </div>`;
            columnas.appendChild(dive);
        })
        buscarDatos(datos);
    })
}

cargarListeners();
cargarCursos();

function cargarListeners() {
    // Presionamos boton para agregar cursos
    listaCursos.addEventListener('click', agregarCurso);

    // Presionamos para eliminar cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Presionamos para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        calcularTotal = 0;
        carritoHtml();
        mostrarTotal(calcularTotal);
    });

}

// Funciones
function agregarCurso(e) {
    e.preventDefault(); // Evita que el evento por defecto se ejecute
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSelect = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSelect);
    }
}

function eliminarIndividual(curso) {
    // Revisa si un elemento existe en el carrito
    const infoCurso = {
        precio: curso.querySelector('.press').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
    };
    const cursos = articulosCarrito.map(curso => {
        if (curso.id === infoCurso.id) {
            curso.cantidad--;
            if (curso.cantidad == 0) {
                articulosCarrito = articulosCarrito.filter(cursito => cursito.id !== curso.id);
            }
            return curso; // Retorna el objeto actualizado
        } else {
            return curso; // Retorna los objetos que no son duplicados
        }
    });
    calcularTotal -= parseInt(infoCurso.precio, 10);
    carritoHtml();
    mostrarTotal(calcularTotal);
}

function eliminarCurso(e) {
    e.preventDefault(); // Evita que el evento por defecto se ejecute
    if (e.target.classList.contains('borrar-curso')) {
        const cursoSelect = e.target.parentElement.parentElement;
        eliminarIndividual(cursoSelect);
    }
}

function leerDatosCurso(curso) {
    // Crea un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span .valor').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };
    calcularTotal += parseInt(infoCurso.precio, 10);

    // Revisa si un elemento existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

    if (existe) {
        // Actualizar cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos que no son duplicados
            }
        });

        articulosCarrito = [...cursos];
    } else {
        // Se agrega al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    carritoHtml();
    mostrarTotal(calcularTotal);
}

// Muestra el carrito de compras en el html (Llenarlo)
function carritoHtml() {
    LimpiarHtml();

    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, id, cantidad } = curso;
        const row = document.createElement('tr');

        // costos[i] = precio;
        // console.log("costos " + "[" + i + "]" + costos);
        // i++;

        row.innerHTML = `
            <td><img src="${imagen}"></td>
            <td>${titulo}</td>
            <td class="press">${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id=${id}>X</a></td>
        `;

        contenedorCarrito.appendChild(row);
    });
}

// Eliminar los cursos del tbody
function LimpiarHtml() {
    // Forma lenta
    /*contenedorCarrito.innerHTML = '';*/

    // Forma rapida y sencilla
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function mostrarTotal(calcularTotal) {
    precioTotal.innerHTML = `${calcularTotal}`;
}

// Buscador

function buscarDatos(datos) {
    input.addEventListener('keyup', e => {
        const newCursos = datos.filter(cursito =>
            `${cursito.titulo.toLowerCase()} ${cursito.autor.toLowerCase()} 
            ${cursito.precio} ${cursito.id}`.includes(input.value.toLowerCase()));
        LimpiarHtmlbody()
        renderUsers(newCursos);
    });
}

function renderUsers(newCursos) {
    console.log(newCursos);
    newCursos.forEach(cursito => {
        const dive = document.createElement('div');
        dive.innerHTML =
            `<div class="card card__custom">
            <img src="${cursito.imagen}" class="imagen-curso u-full-width">
            <div class="info-card info-card__custom">
                <h4 class="titulo-nuevo">${cursito.titulo}</h4>
                <p>${cursito.autor}</p>
                <img src="img/estrellas.png">
                <p class="precio">$200 <span class="u-pull-right ">$<span class="valor">${cursito.precio}</span></span></p>
                <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${cursito.id}">Agregar
                    Al Carrito</a>
            </div>`;
        columnas.append(dive);
    })
}

// Eliminar los cursos del body
function LimpiarHtmlbody() {
    // Forma lenta
    /*contenedorCarrito.innerHTML = '';*/

    // Forma rapida y sencilla
    while (columnas.firstChild) {
        columnas.removeChild(columnas.firstChild);
    }
}