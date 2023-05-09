/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class RecipeData {
  constructor(data) {
    this.recipes = data;
    this.ingredients = this.getAllIngredients;
    this.appliances = this.getAllAppliances;
    this.ustensils = this.getAllUstensils;
    this.recipePrincipal = this.getSearchPrincipal;
  }
  /**
   * Function to retrieve all Ingredients
   * Called by : displayListUnderSecondarySearch(recipes)
   * * @returns {array}
   */
  getAllIngredients() {
    // Retrieve without duplicate (except for differences in accent and spelling mistakes)
    const listIngredientsData = this.recipes.reduce((acc, { ingredients }) => {
      return [...acc, ...ingredients.map(({ ingredient }) => ingredient)];
    }, []);
    // console.log("listIngredientData", listIngredientsData);
    // Retrieve data after passed in function "removeDuplicate"
    const ingredientWithoutDuplicate = removeDuplicate(listIngredientsData);
    console.log("ingredientWithoutDuplicate:", ingredientWithoutDuplicate);
    this.ingredients = ingredientWithoutDuplicate;
    return ingredientWithoutDuplicate;
  }
  /**
   * Function to retrieve all Appliances
   * Called by : displayListUnderSecondarySearch(recipes)
   * * @returns {array}
   */
  getAllAppliances() {
    const applianceData = this.recipes.map(({ appliance }) => appliance);
    const applianceWithoutDuplicate = removeDuplicate(applianceData);
    console.log("applianceWithoutDuplicate:", applianceWithoutDuplicate);
    this.appliances = applianceWithoutDuplicate;
    return applianceWithoutDuplicate;
  }

  /**
   * Function to retrieve all Ustensils
   * Called by : displayListUnderSecondarySearch(recipes)
   * @returns {array}
   */
  getAllUstensils() {
    const ustensilData = this.recipes.map(({ ustensils }) => ustensils);
    // La méthode flat() permet de créer un nouveau tableau contenant les éléments
    // des sous-tableaux du tableau passé en argument, qui sont concaténés récursivement
    const listUstensilDatas = ustensilData.flat();
    const ustensilWithoutDuplicate = removeDuplicate(listUstensilDatas);
    console.log("ustensilWithoutDuplicate:", ustensilWithoutDuplicate);
    this.ustensils = ustensilWithoutDuplicate;
    return ustensilWithoutDuplicate;
  }
  /**
   * Function to retrieve recipes according to the search word
   * If it appears in the Title, Ingredients and Description of the recipes
   * @param {string} inputWord
   */
  getSearchPrincipal(inputWord) {
    console.log("Entre dans getSearchPrincipal");
    // console.log("getSearch", word);
    // console.log("recipes=", this.recipes);
    // La méthode some() teste si au moins un élément du tableau passe le test implémenté par la fonction fournie.
    // Elle renvoie un booléen indiquant le résultat du test.
    const newRecipe = this.recipes.filter(
      (recipe) =>
        removeAccentsUppercase(recipe.name).includes(inputWord) ||
        removeAccentsUppercase(recipe.description).includes(inputWord) ||
        recipe.ingredients.some((ingredient) =>
          removeAccentsUppercase(ingredient.ingredient).includes(inputWord)
        )
    );

    // Remplacement de la liste des recettes par celle qui découle de la recherche principal
    this.recipePrincipal = newRecipe;
    // console.log("newRecipe:", newRecipe);
    if (newRecipe) {
      this.recipes = newRecipe;
    }
  }
  /**
   * Function to build Html elements of all recipes
   * Called by : displayAllRecipes(recipes)
   */
  setDisplayRecipes() {
    // Création des éléments HTML
    let containerHTML;
    containerHTML = `<div class="container-articles">`;

    this.recipes.forEach((recipe) => {
      // HTML de chaque carte de recette
      containerHTML += `<button class="link-recipe" onclick="displayModal(${recipe.id})"><article class="article-recipe">
            <div class="article-picture"></div>
            <div class="article-header">
                <p>${recipe.name}</p>
                <p><i class="fa-regular fa-clock"></i> ${recipe.time} mn</p>
            </div><div class="article-description">
            <div class="composition"><p>`;

      recipe.ingredients.forEach((ingredient) => {
        let quantity = ingredient.quantity ? ingredient.quantity : "";
        let unit = ingredient.unit || "";
        if (unit === "grammes") {
          unit = "gr";
        }
        containerHTML += `${ingredient.ingredient}: ${quantity} ${unit}<br>`;
      });

      containerHTML += `</p></div>
                         <div class="description">
                            <p >${recipe.description}</p>
                        </div>
                    </div>
                </article></button>`;
    });

    containerHTML += `</div>`;

    // console.log("recette après le displayRecipe", this.recipes);
    return containerHTML;
  }
  setDisplayListUnderAdvanceSearch() {
    console.log("this.ingredient:", this.ingredients);
    containerIngredient.innerHTML = "";
    this.ingredients.forEach((ingredient) => {
      containerIngredient.innerHTML += `<button class="button-ingredient">${ingredient}</button>`;
    });
    containerAppliance.innerHTML = "";
    this.appliances.forEach((appliance) => {
      containerAppliance.innerHTML += `<button class="button-appliance">${appliance}</button>`;
    });
    containerUstensil.innerHTML = "";
    this.ustensils.forEach((ustensil) => {
      containerUstensil.innerHTML += `<button class="button-ustensil">${ustensil}</button>`;
    });

    /**
     * Function
     * @param {string} classe
     * @param {string} categorie
     */
    const self = this;
    function eventsToButtons(classe, categorie) {
      const allButtons = document.querySelectorAll(classe);
      allButtons.forEach((element) => {
        if (element.style.display !== "none") {
          element.addEventListener("click", function (e) {
            console.log("element:", element);
            const tag = { word: e.target.textContent, button: categorie };
            allTags.push(tag);
            self.setDisplayTags(tag);
          });
        }
      });
    }
    eventsToButtons(".button-ingredient", "ingredient");
    eventsToButtons(".button-appliance", "appliance");
    eventsToButtons(".button-ustensil", "ustensil");
  }
  setDisplayTags(objectTag) {
    // Reception de l'objet séléctionné
    // console.log(objectTag);
    // Création du tag
    let bgColor;

    switch (objectTag.button) {
      case "ingredient":
        bgColor = "#3282f7";
        break;
      case "ustensil":
        bgColor = "#ed6454";
        break;
      default:
        bgColor = "#68d9a4";
    }
    // Création dans le DOM du tag
    const containerTags = document.querySelector(".container-tags");
    const spanTag = document.createElement("span");
    spanTag.style.backgroundColor = bgColor;
    spanTag.innerHTML = `${objectTag.word} &emsp;<i class="fa-regular fa-circle-xmark"></i>`;
    containerTags.appendChild(spanTag);
    //
    this.getSearchByTagList();

    // Gestion de la suppression d'un tag
    const deleteTags = document.querySelectorAll(".fa-circle-xmark");
    deleteTags.forEach((element) => {
      element.addEventListener(
        "click",
        function (e) {
          // Noeud parent de l'icône
          const spanOfTag = e.target.parentNode;
          //Texte du span sans espace, ni saut de lignes
          const tagText = spanOfTag.textContent.trim();
          // Enlever le tag dans le tableau "allTags"
          allTags = allTags.filter((tag) => tag.word !== tagText);
          // Supression du Tag
          spanOfTag.remove();
          this.getSearchByTagList();
        }.bind(this)
      );
    });
  }
  getSearchByTagList() {
    // Vérification si il y'a des tags
    if (allTags.length == 0 && recipeAfterSearchPrincipal.length == 0) {
      displayAllRecipes(recipesOriginal);
    } else {
      // Création d'un tableau contenant chaque mot de la liste de tags en elevant sa dernière lettre
      // afin de gérer les singuliers et pluriels
      const singularAndPlural = [];
      allTags.forEach(({ word }) => {
        // Division da chaine de mot par une ","
        const words = word.split(",");
        words.forEach((mot) => {
          // Pour résoudre le problème de "Maïs" et "Maïzzena" -> "Maï"
          if (mot.length > 4) {
            // slice(début,fin) ->supprime le dernier caractère
            singularAndPlural.push(mot.slice(0, -1));
          } else {
            singularAndPlural.push(mot);
          }
        });
        console.log("singularAndPlural", singularAndPlural);
      });
      // console.log("singularAndPlural", singularAndPlural);
      // Définition de la liste des recettes de départ généré ou pas par la recherche principal
      const listRecipes =
        recipeAfterSearchPrincipal.length > 0
          ? recipeAfterSearchPrincipal
          : recipesOriginal;

      const recipesWithTag = listRecipes.filter((recipe) => {
        // Création d'un objet Set vide, pour y ajouter les recettes non doublées qui remplissent les conditions
        const wordsFound = new Set();
        // Pour chaque Ingrédients
        recipe.ingredients.forEach((ingredient) => {
          // console.log("ingredient:", ingredient.ingredient);
          // 1er lettre en minuscule de la liste des ingrédients pour les mots qui commence par une minuscule
          const ingredientString =
            ingredient.ingredient.charAt(0).toLowerCase +
            ingredient.ingredient.slice(1);
          console.log("ingredientString:", ingredientString);
          singularAndPlural.forEach((word) => {
            // Chaque mot 1ere lettre en minuscule
            const wordLowerCase = word.charAt(0).toLowerCase + word.slice(1);
            if (ingredientString.includes(wordLowerCase)) {
              wordsFound.add(word);
            }
          });
        });
        // ET pour dans chaque Appareil
        singularAndPlural.forEach((word) => {
          if (recipe.appliance.includes(word)) {
            wordsFound.add(word);
          }
        });
        // Et dans la liste des Ustensiles
        recipe.ustensils.forEach((ustensil) => {
          // console.log(ustensil);
          singularAndPlural.forEach((word) => {
            if (ustensil.toUpperCase().includes(word.toUpperCase())) {
              wordsFound.add(word);
            }
          });
        });
        // Si tout les mots de singularAndPlurial ont été trouvé dans wordsFound, retourne "true"
        // Donc garde la recette en cours
        return singularAndPlural.every((word) => wordsFound.has(word));
      });

      // console.log(recipesWithTag);

      // Instanciation de la classe avec this.recipes=recipesWithTag pour l'affichage des recettes
      displayAllRecipes(recipesWithTag);
    }
  }
}
