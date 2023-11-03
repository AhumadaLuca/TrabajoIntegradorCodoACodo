document.getElementById('resumen').addEventListener('click', calcular);
document.getElementById('borrar').addEventListener('click', borrar);


let mensaje = 'Total a pagar: $';

function calcular(){
    borrar();

    let total;
    let cantidad = Number(getValueById('cantidad'));
    let categoria = Number(getValueById('categoria'));

    if(cantidad > 0){
        if(categoria === 1){
            total = (cantidad * 200) * 0.2;
        }
        if(categoria === 2){
            total = (cantidad * 200) * 0.5;
        }
        if(categoria === 3){
            total = (cantidad * 200) * 0.85;
        }
        updateHtmlById('mensaje', mensaje + total);
    }else{
        alert("Ingrese una cantidad válida de Tickets a comprar");
    }

    

}
function borrar(){
    updateHtmlById('mensaje', mensaje);
}

function getValueById(id) {
    return document.getElementById(id).value;
}
function getId(id) {
    return document.getElementById(id);
}
function updateHtmlById(id,value) {
    //actualizar por medio del D.O.M el html
    document.getElementById(id).innerHTML = value;
}
