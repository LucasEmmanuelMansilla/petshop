fetch('/scripts/api.json')
    .then(res => res.json())
    .then(data => filtraArticulos(data))

function filtraArticulos(data) {
    var filtro = {}
    filtro.juguetes = data.response.filter(articulo => articulo.tipo == "Juguete")
    filtro.medicamentos = data.response.filter(articulo => articulo.tipo == "Medicamento")

    selectora(filtro)
}

function selectora(filtro) {
    if (document.querySelector('#secFarm')) {
        var ruta = filtro.medicamentos
    } else if (document.querySelector('#secJug')) {
        var ruta = filtro.juguetes
    } else {
        var ruta = ""
    }
    creaItems(ruta)
}

function creaItems(ruta) {
    //CAPTURA EL ELEMENTO DESDE EL HTML EN UNA VARIABLE
    var cajas = document.querySelector('#contenedor')
    cajas.classList.add('justify-content-center')

    for (var i = 0; i < ruta.length; i++) {
        //CREA LA CARD COMPLETA Y LE AGREGA SUS CLASES
        var cajaGrande = document.createElement('div')
        cajaGrande.classList.add('card')
        cajaGrande.classList.add('anchoCajas')
        if (ruta[i].stock <= 5) {
            var stock = document.createElement('p')
            stock.innerHTML = "¡ÚLTIMAS UNIDADES!"
            stock.classList.add('ultimasUnidades')
            cajaGrande.appendChild(stock)
        }
        //CREA LA CAJA QUE CONTIENE EL NOMBRE, EL PRECIO Y EL BOTÓN
        var caja = document.createElement('div')
            //CREA EL BOTÓN Y EL TEXTO
        caja.innerHTML = `
            <div class="margenText">
                <h5 class="nombre">${ruta[i].nombre}</h5>
                <h6 class="precio">$${ruta[i].precio}</h6>
            </div>
            <a type="button" class="btn boton" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${ruta[i]._id}"">
                Más Información
            </a>       
            `
            //CREA EL ELEMENTO IMG Y SUS CLASES
        var cajaImg = document.createElement('div')
        cajaImg.classList.add('card-body')
        var etiquetaImg = document.createElement('div')
        etiquetaImg.innerHTML =
            `<div>
                <img src="${ruta[i].imagen}" alt="" class="w-100">
            </div>`
        cajaImg.appendChild(etiquetaImg)
            //A LA CAJA COMPLETA LE APPENDEA LAS DOS MÁS CHICAS QUE COMPLETAN EL 100%
        cajaGrande.appendChild(cajaImg)
        cajaGrande.appendChild(caja)
            //APPENDEA AL CONTENEDOR DEL DOM LA CAJA YA CON SU CONTENIDO
        cajas.appendChild(cajaGrande)

    }

    creaModal(ruta)
}




function creaModal(ruta) {
    var botonModal = document.querySelectorAll('.boton')

    for (var i = 0; i < botonModal.length; i++) {
        botonModal[i].addEventListener('click', function() {
            for (var i = 0; i < botonModal.length; i++) {
                var prueba = this.id
                ruta.map(modal => {
                    prueba == modal._id ?
                        document.querySelector('.cajasModal').innerHTML = `
                    <div>
                        <img src="${modal.imagen}" alt="" class="w-100 imgModalCarrito">
                        <h5>${modal.descripcion}</h5>
                        <h5 class="ocultarContenido nombreModalCarrito">${modal.nombre}</h5>
                        <h5 class="ocultarContenido precioModalCarrito">${modal.precio}</h5>
                     </div>` : null
                })
            }
        })
    }

    // //CREA EL CONTENIDO DEL MODAL Y LO APPENDEA AL DOM
    // for (var i = 0; i < ruta.length; i++) {
    //     cajas.addEventListener('click', (e) => {
    //         var idImg = e.target.id
    //         ruta.map(modal => {
    //             modal._id == idImg ? document.querySelector('.cajasModal').innerHTML = `
    //                 <div>
    //                     <img src="${modal.imagen}" alt="" class="w-100 imgModalCarrito">
    //                     <h5>${modal.descripcion}</h5>
    //                     <h5 class="ocultarContenido nombreModalCarrito">${modal.nombre}</h5>
    //                     <h5 class="ocultarContenido precioModalCarrito">${modal.precio}</h5>
    //                 </div>

    //                 ` : null
    //         })
    //     })
    // }
}

//CREACIÓN DEL CARRO DE COMPRAS
//VARIABLE GLOBAL QUE CAPTURA LA CAJA DONDE VA A IR EL CARRO, DEBE SER GLOBAL PORQUE LA USAN VARIAS FUNCIONES
var carro = document.querySelector('.carro')

//CAPTURA EL BOTÓN DE AGREGAR AL CARRO
var carrito = document.querySelectorAll('.agregarCarrito')
    //PARA CADA BOTÓN, LE AGREGA UN EVENTO Y EJECUTA LA FUNCIÓN QUE CREA LOS ITEMS DEL CARRO
carrito.forEach((agregarAlCarrito) => {
        agregarAlCarrito.addEventListener('click', crearCarrito)

    })
    //VARIABLE GLOBAL QUE CAPTURA EL BOTÓN DE COMPRAR Y LE AGREGA EL EVENTO
var botonComprar = document.querySelector('.botonComprar')
botonComprar.addEventListener('click', clickBotonComprar)

//CAPTURA DE DATOS PARA ENVIAR AL CARRO
function crearCarrito() {
    var botonAgregarItem = this
    var capturaItemsCarrito = botonAgregarItem.closest('.cajaPrincipal')
    var prodCarroTitulo = capturaItemsCarrito.querySelector('.nombreModalCarrito').textContent
    var prodCarroPrecio = capturaItemsCarrito.querySelector('.precioModalCarrito').textContent
    var prodCarroImg = capturaItemsCarrito.querySelector('.imgModalCarrito').src
    appendearCarrito(prodCarroTitulo, prodCarroPrecio, prodCarroImg)

}

//APPENDEA EL CARRO AL DOM SIN REPETIR LOS ELEMENTOS IGUALES
function appendearCarrito(prodCarroTitulo, prodCarroPrecio, prodCarroImg) {
    //CAPTURA EL ELEMENTO
    var itemsDuplicados = carro.getElementsByClassName('tituloCarro')
        //SI EL INNERTEXT DEL ELEMENTO CAPTURADO ES IGUAL AL TEXTO QUE YA ESTÁ EN EL CARRO, SUMA EL VALUE EN VEZ DE VOLVER A INSERTAR UN ELEMENTO IDÉNTICO   
    for (var i = 0; i < itemsDuplicados.length; i++) {
        if (itemsDuplicados[i].innerText === prodCarroTitulo) {
            var inputCantidad = itemsDuplicados[i].parentElement.parentElement.parentElement.querySelector('.cantidadContador')
            inputCantidad.value++
                sumaTotal()
            return

        }
    }
    var crearItemsCarrito = document.createElement('div')
    crearItemsCarrito.innerHTML = `
    <div class="itemsCarrito d-flex">
        <div class="col-6">
            <div class=" d-flex align-items-center w-100 pb-2 pt-3">
                <img src=${prodCarroImg} class="w-25">
                <h6 class="tituloCarro text-truncate ml-3 mb-0">${prodCarroTitulo}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="d-flex align-items-center h-100 pb-2 pt-3">
                <p class="precioCarro mb-0">${prodCarroPrecio}</p>
            </div>
        </div>
        <div class="col-4">
            <div class=" d-flex justify-content-between align-items-center h-100 pb-2 pt-3">
                <input class="cantidadContador" type="number" value="1">
                <button class="btn btn-danger botonBorrar" type="button">X</button>
            </div>
        </div>
     </div>
    `
        //AGREGA LA FUNCIÓN DE BORRAR EL ITEM AL CLICKEAR
    crearItemsCarrito.querySelector('.botonBorrar').addEventListener('click', borrarItem)

    carro.appendChild(crearItemsCarrito)
        //CAMBIA LA CANTIDAD DEL INPUT DE TIPO NUMBER Y MULTIPLICA EL PRECIO PARA ACTUALIZAR EL PRECIO TOTAL
    crearItemsCarrito.querySelector('.cantidadContador').addEventListener('change', cambiarCantidad)
        //EL APPEND NO PUEDE IR DEBAJO DE LA FUNCIÓN QUE SUMA EL TOTAL, PORQUE O SINO SE INICIALIZA EN CERO CON EL PRIMER CLICK
    carro.appendChild(crearItemsCarrito)
    sumaTotal()

}

//SUMA EL MONTO DE LOS ARTÍCULOS QUE SE AGREGAN AL CARRO
function sumaTotal() {
    var total = 0
    var totalSuma = document.querySelector('.total')
    var itemsCarrito = document.querySelectorAll('.itemsCarrito')
    itemsCarrito.forEach(itemCarrito => {
        var precioItemCarro = Number(itemCarrito.querySelector('.precioCarro').textContent.replace('$', ''))
        var cantidadItems = itemCarrito.querySelector('.cantidadContador')
        var cantidadItemsNumero = Number(cantidadItems.value)
        total = total + precioItemCarro * cantidadItemsNumero
    })

    totalSuma.innerHTML = `$${total.toFixed(2)}`
}

//BORRA LOS ITEMS AGREGADOS AL CARRO Y RESTA SU VALOR AL TOTAL
function borrarItem(e) {
    var botonClickeado = e.target
    botonClickeado.closest('.itemsCarrito').remove()
        //AL REMOVER EL ITEM, AGREGANDO LA FUNCIÓN DE SUMA, SE ACTUALIZA EL TOTAL
    sumaTotal()
}
//NO PERMITE QUE EL USUARIO PONGA NUMEROS MENORES A 1
function cambiarCantidad(e) {
    var cantidadProductos = e.target
    cantidadProductos.value <= 0 ? cantidadProductos.value = 1 : null
        //SI EL USIARIO AGREGA LA CANTIDAD MANUALMENTE, TAMBIÉN SUMA SU CANTIDAD Y SU PRECIO
    sumaTotal()
}

//CAPTURA EL EVENTO AL BOTÓN DE COMPRAR QUE LIMPIA EL CARRITO
function clickBotonComprar() {
    carro.innerHTML = ""
    sumaTotal()

}

/* function ocultarCarrito() {
    var prueba = document.querySelector('#prueba')
    prueba.addEventListener('click', () => {
        if (document.querySelector('#contenidoOculto').childElementCount == true) {
            var capturaPrueba = document.querySelector('#contenidoOculto')
            capturaPrueba.classList.add('d-flex')
        }
    })
} */