// Déclaration de la constante API pour appeler l'API via son l'URL
const API = "http://localhost:3000/api/products/";

// Déclaration de la variable let URL pour récupérer l'URL de la page courante
let url = new URL(window.location.href);

// Déclaration de la variable let id pour récupérer l'ID présent dans l'URL de la page courante
let id = url.searchParams.get("id");

// Déclaration de 3 variables :
// Celle ci est unitialisée avec un chaine vide pour y stocker des informations sur un article
let article = "";
// Utilisation de la méthode "document.querySelector()" récupérant l'élément HTML ayant l'ID "colors"
const COLORS = document. querySelector("#colors");
// Utilisation de la méthode "document.querySelector()" récupérant l'élément HTML ayant l'ID "quantity"
let quantity = document.querySelector("#quantity");

// Appel de la fonction getArticle avec les arguments API et id pour récupérer les informations sur un article à partir de l'API en utilisant l'id
getArticle(API, id);

// Récupération des données de article via l'API
// Déclaration de la fonction getArticle avec les arguments api et id
function getArticle(api, id) {
    // Utilisation de la méthode fetch pour envoyer une requête l'API via l'URL et l'id
    fetch(api+id)
    // Utilisation de then une première fois pour convertir la réponse reçue en un objet JavaScript
    .then((res) => {
        return res.json();
    })

    // Assignation des données de l'API dans la variable article et appel à la fonction displayArticle pour l'affichage avec la variable resApi utilisée dans la première promesse
    .then(async (resApi) => {
        // Stockage de la réponse dans la variable article en utilisant await resApi
        // Await permet d'attendre la résolution de la promesse avant de passer à la suite
        article = await resApi;
        if (article){ // Si la réponse de l'API contient des données pour l'article correspondant à l'ID fourni
            displayArticle(article); // On appelle la fonction "displayArticle()" pour afficher les données sur la page

        }
    })
    // Méthode catch affichant l'erreur dans la console du navigateur si la promesse est rejetée
    .catch((error) => {
        console.log("Erreur " + error);
    })
}

// Fonction de création des éléments du DOM
// Appel de la fonction desiplayArticle avec l'argument article
function displayArticle(article){
    // Insertion de l'image
    let productImg = document.createElement("img"); // Création de la balise img avec la méthode "document.createElement()" prenant comme argument le nom de l'élément à créer
    document.querySelector(".item__img").appendChild(productImg); // Utilisation de la méthode "appendChild()" pour ajouter l'élément image créé au DOM dans la classe ".item__img"
    productImg.src = article.imageUrl; // Récupération de la source de l'image via l'API
    productImg.alt = article.altTxt; // Récupération du Text alt de l'image via l'API

    // Insertion du titre "h1"
    let productName = document.getElementById('title'); // Stockage de l'élément HTML ayant l'ayant title, dans la variable productName
    productName.innerText = article.name; // Renvoie le nom de l'article via les infos de l'API grâce à la propriété "innerText" qui définit le texte à afficher à l'intérieur de l'élément HTML

    // Insertion du prix
    let productPrice = document.getElementById('price');
    productPrice.innerText = article.price;

    // Insertion de la description
    let productDescription = document.getElementById('description');
    productDescription.innerText = article.description;

    // Insertion des options de couleurs
    let colors = document.querySelector("#colors") // Récupération de l'élément HTML ayant l'ID "colors" et stockage dans la variable "colors" à l'aide de la méthode "document.querySelector()"
    for (let color of article.colors){ // On va chercher dans la liste des couleurs de l'objet "article"
        let productColors = document.createElement("option"); // On créé un élément option pour chaque couleur à l'aide de la méthode document.createElement
        colors.appendChild(productColors); // On associe ensuite la couleur à l'élément sélectionné avec la méthode appendChild
        productColors.value = color; // La propriété "value" de l'élément "option" est définie sur la valeur de la couleur
        productColors.innerText = color; // La propriété "innerText" de l'élément "option" est définie sur la valeur de la couleur
    } // Ce qui crée une liste déroulante d'option de couleurs
    addToCart(article); // Appel à la fonction addToCart avec article pour argument permettant d'ajouter l'article dans le panier
}

// Gestion du panier
function addToCart() { // Appel à la fonction addToCart
    const btn_envoyerPanier = document.getElementById("addToCart"); // Récupération du bouton d'ajout au panier via l'HTML

    //Ecoute au clic avec 2 conditions : couleur non nulle et quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", ()=>{
        
        if (quantity.value >= 1 && quantity.value <=100 && COLORS.value != "" ){

            //Recupération du choix de la couleur
            let choixCouleur = COLORS.value;
                        
            //Recupération du choix de la quantité
            let choixQuantite = quantity.value;

            //Récupération des options de l'article à ajouter au panier
            let product = {
                id: id,
                color: choixCouleur,
                quantity: parseInt(choixQuantite), // Utilisation de parseInt pour convertir en nombre entier
            };

            addPanier(product); // Appel à la fonction addPanier avec l'argument product pour ajouter le produit dans le panier
            document.location.href = "cart.html"; // Si la condition est réalisée avec succès, on renvoie sur la page cart.html
        }else{
            // Si la condition n'est pas satisfaite on renvoie un message d'erreur sur la page
            alert("Veuillez sélectionner une couleur ainsi qu'une quantité entre 1 et 100.");
        }
    });
}

// Ajout d'un article
// Déclaration de la fonction addPanier avec pour argument product
function addPanier(product) {
    let panier = getPanier(); // Récupération du tableau contenant tous les articles ajoutés au panier
    let foundProduct = panier.find(panier => panier.id == product.id && panier.color === product.color); // On regarde si l'article a déjà une quantité dans le panier et sa couleur
    if (foundProduct != undefined){ // On regarde si le produit trouvé contient une valeur différente de undefined
        foundProduct.quantity = parseInt(foundProduct.quantity)+ parseInt(product.quantity) ; // Si c'est le cas on incrémente la quantité du produit trouvé avec celui du nouvel ajouté
    } else {
        panier.push(product) // On ajoute l'article dans le panier après avoir vérifié qu'il n'y était pas déjà
    }
    savePanier(panier); // Appel à la fonction savePanier pour sauvegarder les informations et les modifications du panier
}

// Consultation du local storage existant
function getPanier() { // Déclaration de la fonction getPanier 
    let panier = localStorage.getItem("panier"); // On récupère les articles du panier enregistrés dans le stockage local du navigateur en utilisant la méthode "getItem()"
    if (panier == null) { // On vérifie d'abord si la variable "panier" est nulle ou non 
        return []; // Si "panier" est null, cela signifie qu'il n'y a aucun article dans le panier donc la fonction renvoie un tableau vide
    } else {
        return JSON.parse(panier); // Si "panier" n'est pas null, la fonction convertit la chaîne JSON en tableau en utilisant la méthode "JSON.parse()" et renvoie le tableau résultant
    }
}

// Enregistrement du contenu dans le localstorage
function savePanier(article){ // Déclaration de la fonction savePanier avec l'argument article
    localStorage.setItem("panier", JSON.stringify(article)); // Utilisation de la méthode "setItem()" du localStorage pour stocker les articles du panier sous forme de chaîne JSON via la méthode "JSON.stringify()" pour convertir le tableau des articles en chaîne JSON. On stocke ensuite tout ça dans la clé "panier" du stockage local du navigateur.
}