// Déclaration de la constante API pour appeler l'API via l'URL
const API = "http://localhost:3000/api/products/";
// Déclaration de la constante ITEMS qui fait référence à un élément HTML dans la page
// Avec la méthode getElementById du document, on récupère l'élément ayant l'identifiant items.
const ITEMS = document.getElementById("items");

// Appel de la fonction display() pour afficher les données de l'API dans le DOM
display();

// Récupération produits de l'API
// Déclaration de la fonction asynchrone getArticles()
async function getArticles() {
    // Utilisation de la fonction fetch(), qui renvoie une promesse, pour envoyer une requête HTTP GET à l'URL stockée dans la constante API
    // Utilisation de await pour attendre la résolution de la promesse
    var response = await fetch(API);
    // Renvoie d'une autre promesse qui résout les données JSON renvoyées par l'API
    return await response.json();
}

// Répartition des données de l'API dans le DOM
// Déclaration de la fonction asynchrone display() 
async function display() {
    // Appel à la fonction getArticles() définie précédemment
    await getArticles ()
    // Une fois que la promesse retournée par getArticles est résolue, on utilise la méthode then() pour traiter la réponse renvoyée par la fonction getArticles(). Cette méthode prend en argument une fonction de rappel (appelée "callback") qui sera exécutée lorsque la promesse sera résolue avec succès.
    .then((response) => {
        // Création de la variable data ayant pour valeur response, variable contenant les données récupérées via l'API
        let data = response;

        // Boucle for of pour traiter chaque élément du tableau data
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
            productName.textContent = article.name; // ajoute de façon dynamique la valeur du nom de l'article

            // Création balise "p"
            let productDescription = document.createElement("p"); // création d'un élément "p" assigné a une variable
            productArticle.appendChild(productDescription); // ajoute l'élément créé en tant que premier enfant
            productDescription.classList.add("productDescription"); // ajoute un selecteur de type class a l'élément créé
            productDescription.textContent = article.description; // ajoute de façon dynamique la valeur de de la description de l'article
        }
    })
    // Utilisation de la méthode catch si la promesse est rejetée. "Error" contient les détails de l'erreur retournée par la promesse
    .catch ((error) => {
        // Affichage de l'erreur relevée dans la console du navigateur via le console.log
        console.log("Erreur " + error);
    });
}