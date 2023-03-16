// la fonction main récupère l'id de commande passée en paramètre
// et l'injecte dans la page
function main(){
    const orderId = document.getElementById("orderId");
    orderId.innerText = localStorage.getItem("orderId");
    console.log(localStorage.getItem("orderId"))
    localStorage.clear();
}
main();