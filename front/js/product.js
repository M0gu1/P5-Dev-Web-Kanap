const API = "http://localhost:3000/api/products/";

// Récupération URL page courante
let url = new URL(window.location.href);

// Récupération ID présent dans URL page courante
let id = url.searchParams.get("id");


let article = "";
const COLORS = document. querySelector("#colors");
let quantity = document.querySelector("#quantity");

getArticle(API, id);

// Récupération des données de article via l'API
function getArticle(api, id) {
    fetch(api+id)
    .then((res) => {
        return res.json();
    })

    /* assigne les données de l'API dans la variable article et
    fait appel a la fonction displayArticle pour l'affichage*/
    .then(async (resApi) => {
        article = await resApi;
        if (article){
            displayArticle(article);
        }
    })
    .catch((error) => {
        console.log("Erreur " + error);
    })
}

// Fonction de création éléments du DOM
function displayArticle(article){
    // Insertion de l'image
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Modification du titre "h1"
    let productName = document.getElementById('title');
    productName.innerText = article.name;

    // Modification du prix
    let productPrice = document.getElementById('price');
    productPrice.innerText = article.price;

    // Modification de la description
    let productDescription = document.getElementById('description');
    productDescription.innerText = article.description;

    // Insertion des options de couleurs
    let colors = document.querySelector("#colors")
    for (let color of article.colors){
        let productColors = document.createElement("option");
        colors.appendChild(productColors);
        productColors.value = color;
        productColors.innerText = color;
    }
    addToCart(article);
}

// Gestion du panier
function addToCart(article) {
    const btn_envoyerPanier = document.getElementById("addToCart");

    //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
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
                quantity: parseInt(choixQuantite),
                /* name: article.name,
                imgUrl: article.imageUrl,
                altImg: article.altTxt */
            };

            addPanier(product);
            document.location.href = "cart.html";
        }else{
            alert("Veuillez sélectionner une couleur ainsi qu'une quantité entre 1 et 100.");
        }
    });
}

// Ajout d'un article
function addPanier(product) {
    let panier = getPanier();
    let foundProduct = panier.find(panier => panier.id == product.id && panier.color === product.color);
    if (foundProduct != undefined){
        foundProduct.quantity = parseInt(foundProduct.quantity)+ parseInt(product.quantity) ;
    } else {
        panier.push(product)
    }
    savePanier(panier);
}

// Consultation du local storage existant
function getPanier() {
    let panier = localStorage.getItem("panier");
    if (panier == null) {
        return [];
    } else {
        return JSON.parse(panier);
    }
}

// Enregistrement du contenu dans le localstorage
function savePanier(article){
    localStorage.setItem("panier", JSON.stringify(article));
}