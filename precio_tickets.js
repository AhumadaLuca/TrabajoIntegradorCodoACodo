document.getElementById('resumen').addEventListener('click', calcular);
document.getElementById('obtenerCompradores').addEventListener('click', listarCompradores);
document.getElementById('finalizarCompra').addEventListener('click', crearComprador);

let page = 1;
let total;

function calcular(){

    document.getElementById('confirmarDatos').innerHTML = '';

    let cantidad = Number(document.getElementById('cantidad').value);

    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let email = document.getElementById('email').value;
    let categoria = Number(document.getElementById('categoria').value);


    if(cantidad != null && nombre != null && apellido != null && email != null){
        if(cantidad > 0){
            if(categoria == 1){
                total = (cantidad * 200) * 0.2;
                categoria = "Estudiante";
            }
            if(categoria == 2){
                total = (cantidad * 200) * 0.5;
                categoria = "Trainee";
            }
            if(categoria == 3){
                total = (cantidad * 200) * 0.85;
                categoria = "Junior";
            }
    
            document.getElementById('confirmarDatos').innerHTML =
            `
                <img class="mb-3" src="imagenes_integrador_front/usuarioCompra.png" style="width: 100px">
                <h6>NOMBRE Y APELLIDO</h6>
               <p>${nombre} ${apellido}</p>
               <h6>CORREO</h6>
               <p>${email}</p>
               <h6>CANTIDAD Y TIPO DE TICKET</h6>
               <p>${cantidad} X ${categoria}</p>
               <h6>VALOR TOTAL</h6>
               <p>$${total}</p>
               
            `;
            document.getElementById('botonesModal').innerHTML = 
             `
             <div>
             <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Volver</button>
           </div>
           <div>
             <button style="background-color: #97c93f; border-color: #97c93f;" 
             type="submit" 
             class="btn btn-primary"
             data-bs-target="#finalizadoModal" data-bs-toggle="modal"
             onclick="crearComprador();">Finalizar</button>
           </div>
        `;
        }else{
            document.getElementById('confirmarDatos').innerHTML =
            `
            <img src="imagenes_integrador_front/usuarioError.png" style="width: 100px">
               <h5 class="mt-3">¡Hay datos faltantes y/o incorrectos!</h5>
               <h6>Por favor, corrobore la información</h6>
            `;
            document.getElementById('botonesModal').innerHTML = 
            `
            <div>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Volver</button>
            </div>
            `;
    }
    }
}

function crearComprador() {

    limpiarModalFinal();

    let cantidad = document.getElementById("cantidad").value;
    let categoria = Number(document.getElementById('categoria').value);

    if(categoria == 1){
        total = (cantidad * 200) * 0.2;
        categoria = "Estudiante";
    }
    if(categoria == 2){
        total = (cantidad * 200) * 0.5;
        categoria = "Trainee";
    }
    if(categoria == 3){
        total = (cantidad * 200) * 0.85;
        categoria = "Junior";
    }

    const comprador = {

         nombre: document.getElementById("nombre").value,
         apellido: document.getElementById("apellido").value,
         email: document.getElementById("email").value,
         cantidad,
         categoria: categoria,
         precioTotal: total
    }

    console.log(comprador);
    //debo enviar los datos al servidor
    //usaremos fetch con post

    //1 preparo la peticion
    fetch('http://localhost:8080/web-app-23544/api/comprador', {
    method: "POST",
    body: JSON.stringify(comprador),
    })
    //2 intento resolver la promesa
    .then(response => response.json()) 
    .then(json => {
        //actualizar el div del html con la informacion
        document.getElementById('finalizarModal').innerHTML = 
                `
                <img src="imagenes_integrador_front/usuarioOkey.png" style="width: 100px">
                <h5 class="mt-3">¡Compra finalizada!</h5>
                <h6>ID de Compra: ${json.id}</h6>
                `;
    })

    .catch(err => console.log(err));

}

function listarCompradores(){ /*Cambiar nombre en todos lados: F2*/

    //Paso 1: preparar el API FETCH
    const respuesta = fetch(`http://localhost:8080/web-app-23544/api/comprador`);

    //Paso 2: invocar la promesa
    respuesta
        .then(response => response.json())
        .then(data => procesarListado(data)) //fulfilled
        .catch(error => dibujarError(error)) //rejected
}

function procesarListado(data){

    //Guardo los compradores en el localStorage
    saveCompradoresInLocal('compradores', data);
    //dato: podemos desestructurar
    const listarCompradores = data;
    let rows = '';
    for(let comprador of listarCompradores){
        rows += `
        <tr>
        <th scope="row">${comprador.id}</th>
        <td>${comprador.nombre}</td>
        <td>${comprador.apellido}</td>
        <td>${comprador.email}</td>
        <td>${comprador.cantidad}</td>
        <td>${comprador.categoria}</td>
        <td>${comprador.precioTotal}</td>
        <td>${comprador.fechaCompra}</td>
        <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editarModal" onclick="editarComprador(${comprador.id})">Editar</button>
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="eliminarComprador(${comprador.id})">Eliminar</button>
        </td>
        </tr>
        
        `
    }
    document.getElementById('titleRows').innerHTML = 
    `
    <tr>
    <th scope="col">ID de Compra</th>
    <th scope="col">Nombre</th>
    <th scope="col">Apellido</th>
    <th scope="col">Email</th>
    <th scope="col">Cantidad Tickets</th>
    <th scope="col">Tipo Tickets</th>
    <th scope="col">Precio total</th>
    <th scope="col">Fecha de Compra</th>
    </tr>
    `
    document.getElementById('usersRows').innerHTML = rows;
}

const getCompradoresFromLocal = () => {
    const compradores = localStorage.getItem('compradores');
    if(compradores){
        return JSON.parse(compradores);
    }
    return [];
    
}
const getCompradorSeleccionado = () => {
    const obj = localStorage.getItem('compradorBuscado');
    if(obj){
        return JSON.parse(obj);
    }
    return [];
    
}

const removeCompradorSeleccionado = () => {
    localStorage.removeItem('compradorBuscado')
}

const saveCompradoresInLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data)); //Como texto
}

const editarComprador = (id) => {
    //Me traigo lo que se guardo
    const compradores = getCompradoresFromLocal(); //Devuelve array
    const compradorBuscado = compradores.find(o => o.id === id);

    document.getElementById('nombreActualizar').value = compradorBuscado.nombre;
    document.getElementById('apellidoActualizar').value = compradorBuscado.apellido;
    document.getElementById('emailActualizar').value = compradorBuscado.email;
    document.getElementById('cantidadActualizar').value = compradorBuscado.cantidad;
    let categoria = document.getElementById('categoriaActualizar').value = compradorBuscado.categoria;

    if(categoria === "Estudiante"){
        document.getElementById('categoriaActualizar').innerHTML = 
        `
            <option selected value="1">Estudiante</option>
              <option value="2">Trainee</option>
              <option value="3">Junior</option>
        `;
    }
    if(categoria === "Trainee"){
        document.getElementById('categoriaActualizar').innerHTML = 
        `
            <option  value="1">Estudiante</option>
              <option selected value="2">Trainee</option>
              <option value="3">Junior</option>
        `;
    }
    if(categoria === "Junior"){
        document.getElementById('categoriaActualizar').innerHTML = 
        `
            <option value="1">Estudiante</option>
              <option value="2">Trainee</option>
              <option selected value="3">Junior</option>
        `;
    }
    

    //guardo el id/orador del orador que se quiere actualizar
    saveCompradoresInLocal('compradorBuscado', compradorBuscado);
}

const actualizarComprador = () => {

    limpiarModalFinal();

    const compradorSeleccionado = getCompradorSeleccionado();
    if(!compradorSeleccionado){
        return;
    }
        //obtengo los datos del formulario que esta en el modal
        const nombre = document.getElementById('nombreActualizar').value;
        const apellido = document.getElementById('apellidoActualizar').value;
        const email = document.getElementById('emailActualizar').value;
        const cantidad = document.getElementById('cantidadActualizar').value;
        let categoria = document.getElementById('categoriaActualizar').value;
        let total;

        if(categoria == 1){
            total = (cantidad * 200) * 0.2;
            categoria = "Estudiante";
        }
        if(categoria == 2){
            total = (cantidad * 200) * 0.5;
            categoria = "Trainee";
        }
        if(categoria == 3){
            total = (cantidad * 200) * 0.85;
            categoria = "Junior";
        }

        const comprador = {
            nombre, apellido, email, cantidad, categoria, precioTotal: total
        };

        //Ahora envio al backend para actualizar
        fetch(`http://localhost:8080/web-app-23544/api/comprador?id=${compradorSeleccionado.id}`, {
            method: "PUT",
            body: JSON.stringify(comprador),
            })
            //2 intento resolver la promesa
            .then(response => response) //devolvemos status code 200
            .then(json => {
                //actualizar el div del html con la informacion
                document.getElementById('finalizarModal').innerHTML = 
                `
                <img src="imagenes_integrador_front/usuarioGuardado.png" style="width: 100px">
                <h5 class="mt-3">¡Compra editada y guardada!</h5>
                `;
                //Cargamos la lista denuevo
                listarCompradores();
                removeCompradorSeleccionado();
            })

            .catch(err => console.log(err));
    
}

function dibujarError(error){
    //Capturamos el HTML
    const alerta = `<div class="alert alert-danger" role="alert">
    <span>${JSON.stringify(error.toString())}</span> 
    </div>`
    document.getElementById('msj').innerHTML = alerta;
}

function eliminarComprador(id){

    const compradores = getCompradoresFromLocal(); //Devuelve array
    const compradorBuscado = compradores.find(o => o.id === id);

    document.getElementById('botonesEliminar').innerHTML =
    `
    <div>
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Volver</button>
    </div>
    <div>
    <button type="submit" class="btn btn-danger" 
    data-bs-target="#finalizadoModal" 
    data-bs-toggle="modal" 
    onclick="confirmarEliminar(${compradorBuscado.id})">Eliminar</button>
    </div>
    `;

}

function confirmarEliminar(id){

            limpiarModalFinal();

            fetch(`http://localhost:8080/web-app-23544/api/comprador?id=${id}`, {
            method: "DELETE",
            })
            //2 intento resolver la promesa
            .then(response => response) 
            .then(json => {
                //actualizar el div del html con la informacion
                document.getElementById('finalizarModal').innerHTML = 
                `
                <img src="imagenes_integrador_front/usuarioEliminado.png" style="width: 100px">
                <h5 class="mt-3">¡Compra eliminada!</h5>
                `;
                listarCompradores();
            })

            .catch(err => console.log(err));

}

function limpiarModalFinal(){
            document.getElementById('finalizarModal').innerHTML = '';
}
