const API = "http://localhost:3000/api/products/";
const ITEMS = document.getElementById("items");

// Appel fonction display
display();

// Récupération produits de l'API
async function getArticles() {
    var response = await fetch(API);
    return await response.json();
}

// Répartition données de l'API dans le DOM
async function display() {
    await getArticles ()
    .then((response) => {
        let data = response;

        // boucle for of pour traiter chaque élément du tableau data
        for (let article of data) {

            // Création balise "a"
            let productLink = document.createElement("a"); // création d'un élément "a" assigné a une variable
            ITEMS.appendChild(productLink); // ajoute l'élément créé en tant que premier enfant
            productLink.href = `product.html?id=${article._id}`;  // ajoute de façon dynamique la valeur de l'identifiant de l'article  

            // Création balise "article"
            let productArticle = document.createElement("article"); // création d'un élément "article" assigné a une variable
            productLink.appendChild(productArticle); // ajoute l'élément créé en tant que premier enfant

            // Création balise image
            let productImg = document.createElement("img"); // création d'un élément "img" assigné a une variable
            productArticle.appendChild(productImg); // ajoute l'élément créé en tant que premier enfant
            productImg.src = article.imageUrl; // ajoute de façon dynamique la valeur de l'adresse de l'image de l'article
            productImg.alt = article.altTxt; // ajoute de façon dynamique la valeur de la description de l'image de l'article

            // Création balise titre "h3"
            let productName = document.createElement("h3"); // création d'un élément "h3" assigné a une variable
            productArticle.appendChild(productName); // ajoute l'élément créé en tant que premier enfant
            productName.classList.add("productName"); // ajoute un selecteur de type class a l'élément créé
            productName.innerHTML = article.name; // ajoute de façon dynamique la valeur du nom de l'article

            // Création balise "p"
            let productDescription = document.createElement("p"); // création d'un élément "p" assigné a une variable
            productArticle.appendChild(productDescription); // ajoute l'élément créé en tant que premier enfant
            productDescription.classList.add("productDescription"); // ajoute un selecteur de type class a l'élément créé
            productDescription.innerHTML = article.description; // ajoute de façon dynamique la valeur de de la description de l'article
        }
    })
    .catch ((error) => {
        console.log("Erreur " + error);
    });
}