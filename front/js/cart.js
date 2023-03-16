const API = "http://localhost:3000/api/products/";

// Configuration des regexp permettant de contrôler la saisie des utilisateurs dans le formulaire
let emailRegExp = new RegExp('^[A-Za-z0-9.-_]+[@]{1}[A-Za-z0-9.-_]+[.]{1}[a-z]{2,}$');
let caractRegExp = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç'-]+$");
let cityRegExp = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç '-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-A-Za-zàâäéèêëïîôöùûüç]+)+");

// bouton commander et lancement de la fonction de contrôle du formulaire
const btn_commander = document.getElementById("order");
btn_commander.addEventListener("click", (event) => submitForm(event));

// Appel API
async function getApi(){
    let response = await fetch(API)
    return await response.json();
}

// lecture du local storage
let panier = getPanier();

function getPanier() {
    let panier = localStorage.getItem("panier");
    if (panier == null) {
        return [];
    } else {
        return JSON.parse(panier);
    }
}
getApi().then((data) =>{
    const positionEmptyCart = document.querySelector("#cart__items");
        
        // Si le panier est vide
        if (panier === null || panier == 0) {
            positionEmptyCart.innerHTML = `<p>Votre panier est vide</p>`;
        } else {
            let totalPrice = 0;

            // Récupération des infos des produits dans le panier via l'API
            for (let produit of panier){

                // Appel des infos de l'API pour chaque article
                let article = "";

                // Récupération des données de l'article via l'API
                function getArticle(api, id) {
                    fetch(api+id)
                    .then((res) => {
                        return res.json();
                    })
                
                    // Assigne les données de l'API dans la variable article et fait appel a la fonction displayArticle pour l'affichage 
                    .then(async (resApi) => {
                        article = await resApi;
                        displayArticle(article);    
                    })
                    .catch((error) => {
                        console.log("Erreur " + error);
                    })
                }
                
                // Appel de la fonction
                getArticle(API, produit.id);

                // Insertion de l'élément "article"
                function displayArticle(article) {
                let productArticle = document.createElement("article");
                positionEmptyCart.appendChild(productArticle);
                productArticle.className = "cart__item";
                productArticle.setAttribute('data-id', produit.id);
                productArticle.setAttribute('data-color', produit.color);
    
                // Insertion de l'élément "div"
                let productDivImg = document.createElement("div");
                productArticle.appendChild(productDivImg);
                productDivImg.className = "cart__item__img";
    
                // Insertion de l'image
                let productImg = document.createElement("img");
                productDivImg.appendChild(productImg);
                productImg.src = article.imageUrl;
                productImg.alt = article.altTxt;
                                
                // Insertion de l'élément "div"
                let productItemContent = document.createElement("div");
                productArticle.appendChild(productItemContent);
                productItemContent.className = "cart__item__content";
    
                // Insertion de l'élément "div"
                let productItemContentTitlePrice = document.createElement("div");
                productItemContent.appendChild(productItemContentTitlePrice);
                productItemContentTitlePrice.className = "cart__item__content__titlePrice";
                
                // Insertion du titre h2
                let productTitle = document.createElement("h2");
                productItemContentTitlePrice.appendChild(productTitle);
                productTitle.innerText = article.name;
                console.log(article.name);
    
                // Insertion de la couleur
                let productColor = document.createElement("p");
                productTitle.appendChild(productColor);
                productColor.innerText = produit.color;
    
                // Insertion du prix
                let productPrice = document.createElement("p");
                productItemContentTitlePrice.appendChild(productPrice);
    
                // boucle permettant d'associer le prix au bon article
                for (const dataArticle of data) {
                    if(produit.id === dataArticle._id){
                        productPrice.innerText = dataArticle.price + " €";
                        totalPrice += (dataArticle.price * produit.quantity)
                    }
                }

                // Insertion de l'élément "div"
                let productItemContentSettings = document.createElement("div");
                productItemContent.appendChild(productItemContentSettings);
                productItemContentSettings.className = "cart__item__content__settings";
    
                // Insertion de l'élément "div"
                let productItemContentSettingsQuantity = document.createElement("div");
                productItemContentSettings.appendChild(productItemContentSettingsQuantity);
                productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
                
                // Insertion de "Qté : "
                let productQte = document.createElement("p");
                productItemContentSettingsQuantity.appendChild(productQte);
                productQte.innerText = "Qté : ";
    
                // Insertion de la quantité
                let productQuantity = document.createElement("input");
                productItemContentSettingsQuantity.appendChild(productQuantity);
                productQuantity.value = produit.quantity;
                productQuantity.className = "itemQuantity";
                productQuantity.setAttribute("type", "number");
                productQuantity.setAttribute("min", "1");
                productQuantity.setAttribute("max", "100");
                productQuantity.setAttribute("name", "itemQuantity");
    
                // Insertion de l'élément "div"
                let productItemContentSettingsDelete = document.createElement("div");
                productItemContentSettings.appendChild(productItemContentSettingsDelete);
                productItemContentSettingsDelete.className = "cart__item__content__settings__delete";
    
                // Insertion de "p" supprimer
                let productSupprimer = document.createElement("p");
                productItemContentSettingsDelete.appendChild(productSupprimer);
                productSupprimer.className = "deleteItem";
                productSupprimer.innerHTML = "Supprimer";
            
            totalQuantity();
            displayTotalPrice(totalPrice);
                }
            }   
        }
        modifQuantity();
        deleteArticle();
    })

// fonction de calcul de la quantité totale 
function totalQuantity(){
    let quantity = document.querySelectorAll('.itemQuantity');
    let totalQuantity = document.getElementById('totalQuantity');
    totalQuant = 0;
    for (let i = 0; i < quantity.length; ++i) {
        totalQuant += quantity[i].valueAsNumber;
    }
    totalQuantity.innerText = totalQuant;
}

// fonction display affichant le prix total
function displayTotalPrice(totalPrices){
    let totalPrice = document.getElementById('totalPrice');
    totalPrice.innerText = totalPrices;
}

// Modification de la quantité d'un produit
function modifQuantity() {
    let quantity = document.querySelectorAll(".itemQuantity");
    quantity.forEach((target) => {
        let article = target.closest("article");
        let id = article.dataset.id;
        let color = article.dataset.color;
        target.addEventListener("change" , () => {
            let index = panier.findIndex((element) => element.id == id && element.color == color );
            let quantityCart = panier.quantity;
            let modifQuantity = target.valueAsNumber;
            if (quantityCart != modifQuantity && modifQuantity > 0){
                panier[index].quantity = modifQuantity
                localStorage.setItem("panier", JSON.stringify(panier));
                document.location.reload();
            }else if (modifQuantity <= 0){
                alert("veuillez entrer une valeur supérieur à 0 ou cliquer sur supprimer afin de retirer l'article du panier");
                document.location.reload();
            }
        })
    })
}

// Suppression d'un produit
function deleteArticle() {
    let btnDelete = document.querySelectorAll(".deleteItem");
    btnDelete.forEach((target) => {
        let article = target.closest("article");
        let id = article.dataset.id;
        let color = article.dataset.color;
        target.addEventListener("click" , () => {

            //Selection de l'element à supprimer en fonction de son id ET sa couleur
            panier = panier.filter((element) => element.id !== id || element.color !== color );

            // mise à jour du localstorage
            localStorage.setItem("panier", JSON.stringify(panier));
            
            //Alerte produit supprimé
            alert("Ce produit a bien été supprimé du panier");
            document.location.reload();
        })
    })
}

// Formulaire : validation du prénom
// déclaration de la fonction pour vérifier la validité de la donnée
function validFirstName(inputFirstName) {
    // déclaration de la variable qui va retourner une erreur
    let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");

    // déclaration de la condition
    // on va vérifier les RegExp vis à vis de cette valeur. Si la valeur respecte les REGexp, on n'affiche pas d'erreur
    if (caractRegExp.test(inputFirstName.value)) {
        firstNameErrorMsg.innerHTML = '';
        // et on retourne true
        return true
    // sinon, on affiche le message d'erreur
    } else {
        firstNameErrorMsg.innerHTML = 'Veuillez utiliser un tiret pour remplacer un espace. Par ex: Mon-prénom.';
        // et on retourne false
        return false
    }
};

//validation du nom
function validLastName(inputLastName) {
    let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");

    if (caractRegExp.test(inputLastName.value)) {
        lastNameErrorMsg.innerHTML = '';
        return true
    } else {
        lastNameErrorMsg.innerHTML = 'Veuillez utiliser un tiret pour remplacer un espace. Par ex: Mon-nom.';
        return false
    }
};

//validation de l'adresse postale
function validAddress(inputAddress) {
    let addressErrorMsg = document.querySelector("#addressErrorMsg");

    if (addressRegExp.test(inputAddress.value)) {
        addressErrorMsg.innerHTML = '';
        return true
    } else {
        addressErrorMsg.innerHTML = 'Veuillez saisir une adresse avec un numéro. Par ex: 10 quai de la charente.';
        return false
    }
};

//validation de la ville
function validCity(inputCity) {
    let cityErrorMsg = document.querySelector("#cityErrorMsg");

    if (cityRegExp.test(inputCity.value)) {
        cityErrorMsg.innerHTML = '';
        return true
    } else {
        cityErrorMsg.innerHTML = "Veuillez saisir le nom d'une ville sans chiffres ni caractères spéciaux. Par ex : Paris.";
        return false

    }
};

//validation de l'adresse mail
function validEmail(inputEmail) {
    let emailErrorMsg = document.querySelector("#emailErrorMsg");

    if (emailRegExp.test(inputEmail.value)) {
        emailErrorMsg.innerHTML = '';
        return true
    } else {
        emailErrorMsg.innerHTML = "Veuillez saisir une adresse mail valide. Par exemple : support@name.com.";
        return false
    }
};

//Envoi des informations client au localstorage après validation
function submitForm(event){
    event.preventDefault();
    
    //Récupération des coordonnées du formulaire client
    let inputName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');

    // récupération de la validité des informations.
    let resFirstName = validFirstName(inputName);
    let resLastName = validLastName(inputLastName);
    let resAdress = validAddress(inputAdress);
    let resCity = validCity(inputCity);
    let resMail = validEmail(inputMail);

    // si toutes les validations sont à true on fait la requète au serveur
    if (panier == "") {
        alert("Votre panier ne contient aucun article.")
    }else if (resFirstName && resLastName && resAdress && resCity && resMail && panier != "" ) {
            
        // Construction d'un tableau depuis le local storage
        let idPanier = [];
        for (let i = 0; i<panier.length;i++) {
            idPanier.push(panier[i].id);
        }
            
        // création de l'objet que doit recevoir le back
        const order = {
            contact : {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: idPanier,
        } 
    
        // Option de configuration de la requete post
        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json', 
                "Content-Type": "application/json" 
            },
        };
            
        fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);
            document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
            alert ("Problème avec fetch : " + err.message);
        });
    }else{
        alert("Veuillez consulter le formulaire et corriger les champs comportant des erreurs.");
    }
}







    