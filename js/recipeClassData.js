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
    // console.log("ingredientWithoutDuplicate:", ingredientWithoutDuplicate);
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
    // console.log("applianceWithoutDuplicate:", applianceWithoutDuplicate);
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
    // console.log("ustensilWithoutDuplicate:", ustensilWithoutDuplicate);
    this.ustensils = ustensilWithoutDuplicate;
    return ustensilWithoutDuplicate;
  }
  /**
   * Function to retrieve recipes according to the search word
   * If it appears in the Title, Ingredients and Description of the recipes
   * @param {string} inputWord
   */
  getSearchPrincipal(inputWord) {
    // console.log("Entre dans getSearchPrincipal");
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
    if (this.recipes.length == 0) {
      let containerNoRecipes = `<div class="no-recipes"> <p>Aucune recette ne correspond à votre critère</p><p>Vous pouvez
      chercher « tarte aux pommes », « poisson » etc...</p>
      </div>`;
      return containerNoRecipes;
    } else {
      // Création des éléments HTML
      let containerHTML;
      containerHTML = `<div class="container-articles">`;

      this.recipes.forEach((recipe) => {
        // HTML de chaque carte de recette
        containerHTML += `<button class="link-recipe" onclick="displayModal(${recipe.id})"><article class="article-recipe">
            <div class="article-picture"></div>
            <div class="article-header">
                <p class="title-recipe">${recipe.name}</p>
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
  }
  setDisplayListUnderAdvanceSearch() {
    // console.log("this.ingredient:", this.ingredients);
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

    // Management of the 3 Inputs on the 3 categories
    inputSearchElements.forEach((inputSearchElement) => {
      inputSearchElement.element.addEventListener("input", function (e) {
        const dropDown =
          inputSearchElement.element.parentNode.parentNode.querySelector(
            ".dropdown-list"
          );
        const chevron =
          inputSearchElement.element.parentNode.querySelector(
            ".fa-chevron-down"
          );
        console.log(chevron);
        chevron.classList.add("rotated");
        const placeHolder = inputSearchElement.element.placeholder;
        console.log("placeHolder:", placeHolder);
        console.log(dropDown);
        let newPlaceholder;
        if (dropDown.classList.contains("list-appliances")) {
          newPlaceholder = "Appareils";
        } else if (dropDown.classList.contains("list-ustensils")) {
          newPlaceholder = "Ustensils";
        } else {
          newPlaceholder = "Ingrédients";
        }
        const inputValue = removeAccentsUppercase(e.target.value);
        if (inputValue === "") {
          dropDown.style.display = "none";
          inputSearchElement.element.classList.remove(
            "open",
            "changePlaceholder"
          );
          inputSearchElement.element.classList.add("close");
          inputSearchElement.element.placeholder = newPlaceholder;
          chevron.classList.remove("rotated");
        } else {
          dropDown.style.display = "block";
          inputSearchElement.element.classList.add("open", "changePlaceholder");
          inputSearchElement.element.classList.remove("close");

          // inputSearchElement.element.nextSibling.classList.add("rotated");
        }
        const listButtonUnder = document.querySelectorAll(
          inputSearchElement.buttonClass
        );
        listButtonUnder.forEach((button) => {
          const buttonText = removeAccentsUppercase(button.textContent);
          button.style.display = buttonText.includes(inputValue)
            ? "block"
            : "none";
        });
      });
    });
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
    // Creation in the DOM of the tag
    const containerTags = document.querySelector(".container-tags");
    const spanTag = document.createElement("span");
    spanTag.style.backgroundColor = bgColor;
    spanTag.innerHTML = `${objectTag.word} &emsp;<i class="fa-regular fa-circle-xmark"></i>`;
    containerTags.appendChild(spanTag);
    //
    this.getSearchByTagList();

    // Management of the deletion of a tag
    const deleteTags = document.querySelectorAll(".fa-circle-xmark");
    deleteTags.forEach((element) => {
      element.addEventListener(
        "click",
        function (e) {
          // Icon parent node
          const spanOfTag = e.target.parentNode;
          const tagText = spanOfTag.textContent.trim();
          // Remove the tag from the "allTags" array
          allTags = allTags.filter((tag) => tag.word !== tagText);
          spanOfTag.remove();
          this.getSearchByTagList();
        }.bind(this)
      );
    });
  }
  getSearchByTagList() {
    // Check if there are already tags
    if (allTags.length == 0 && recipeAfterSearchPrincipal.length == 0) {
      displayAllRecipes(recipesOriginal);
    } else {
      // Create an array containing each word in the list of tags by raising its last letter
      // in order to manage singulars and plurals
      const singularAndPlural = [];
      allTags.forEach(({ word }) => {
        const words = word.split(",");
        words.forEach((mot) => {
          // To solve the problem of "Maïs" and "Maïzzena" -> "Maï", "mot" must be > 4
          if (mot.length > 4) {
            singularAndPlural.push(mot.slice(0, -1));
          } else {
            singularAndPlural.push(mot);
          }
        });
        console.log("singularAndPlural", singularAndPlural);
      });
      // console.log("singularAndPlural", singularAndPlural);
      // Definition of the list of current recipes generated or not by the main search
      const listRecipes =
        recipeAfterSearchPrincipal.length > 0
          ? recipeAfterSearchPrincipal
          : recipesOriginal;

      const recipesWithTag = listRecipes.filter((recipe) => {
        // Create an empty Set object, to add unduplicated recipes that meet the conditions
        const wordsFound = new Set();

        recipe.ingredients.forEach((ingredient) => {
          // console.log("ingredient:", ingredient.ingredient);
          // Lowercase the 1st letter of the words "ingredient" and "singularAndPlural" to handle words starting with a lowercase
          const ingredientFirstLowerCase =
            ingredient.ingredient.charAt(0).toLowerCase +
            ingredient.ingredient.slice(1);

          singularAndPlural.forEach((word) => {
            const singularAndPluralFirstLowerCase =
              word.charAt(0).toLowerCase + word.slice(1);
            if (
              ingredientFirstLowerCase.includes(singularAndPluralFirstLowerCase)
            ) {
              wordsFound.add(word);
            }
          });
        });
        // AND for in each Device
        singularAndPlural.forEach((word) => {
          if (recipe.appliance.includes(word)) {
            wordsFound.add(word);
          }
        });
        // And in the list of Utensils
        recipe.ustensils.forEach((ustensil) => {
          // console.log(ustensil);
          singularAndPlural.forEach((word) => {
            if (ustensil.toUpperCase().includes(word.toUpperCase())) {
              wordsFound.add(word);
            }
          });
        });
        // If all the words of "singularAndPlurial" were found in "wordsFound", return "true"
        // So keep the current recipe
        return singularAndPlural.every((word) => wordsFound.has(word));
      });

      // console.log(recipesWithTag);

      // Instantiating the class with "this.recipes=recipesWithTag" to generate the recipes display
      displayAllRecipes(recipesWithTag);
    }
  }
}
