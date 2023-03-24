// Déclaration de la fonction main qui récupère l'id de la commande passée en paramètre et l'injecte dans la page 
function main(){
    // Récupération de l'URL de la page courante
    let url = new URL(document.location.href);

// Récupération ID présent dans URL page courante
// création fonction dans URL page web
// Récupération de l'éléement id dans l'URL avec get
    let id = url.searchParams.get("id");
    // récupération élément du span orderId dans la page HTML
    const orderId = document.getElementById("orderId");
    // Ajout du text correspondant à l'id au span du HTML
    orderId.innerText = id;
    localStorage.clear();
}
main();