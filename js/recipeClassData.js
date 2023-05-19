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
    // Retrieve all Ingrédients and passed in function "removeDuplicate"
    const ingredientWithoutDuplicate = removeDuplicate(
      this.recipes.reduce((acc, { ingredients }) => {
        return [...acc, ...ingredients.map(({ ingredient }) => ingredient)];
      }, [])
    );
    this.ingredients = ingredientWithoutDuplicate;
    return ingredientWithoutDuplicate;
  }
  /**
   * Function to retrieve all Appliances
   * Called by : displayListUnderSecondarySearch(recipes)
   * * @returns {array}
   */
  getAllAppliances() {
    // Retrieve all Appliances
    const applianceWithoutDuplicate = removeDuplicate(
      this.recipes.map(({ appliance }) => appliance)
    );
    this.appliances = applianceWithoutDuplicate;
    return applianceWithoutDuplicate;
  }

  /**
   * Function to retrieve all Ustensils
   * Called by : displayListUnderSecondarySearch(recipes)
   * @returns {array}
   */
  getAllUstensils() {
    // Retrieve all Ustensils
    const ustensilWithoutDuplicate = removeDuplicate(
      this.recipes.flatMap(({ ustensils }) => ustensils)
    );
    this.ustensils = ustensilWithoutDuplicate;
    return ustensilWithoutDuplicate;
  }
  /**
   * Function to retrieve recipes according to the search word
   * If it appears in the Title, Ingredients and Description of the recipes
   * Called by handlerPrincipalSearch(recipes)
   * @param {string} inputWord
   */
  getSearchPrincipal(inputWord) {
    let newRecipe = [];
    for (let i = 0; i < this.recipes.length; i++) {
      let recipeMatched = false;
      const recipe = this.recipes[i];

      if (removeAccentsUppercase(recipe.name).includes(inputWord)) {
        newRecipe.push(recipe);
        recipeMatched = true;
      }
      if (!recipeMatched) {
        if (removeAccentsUppercase(recipe.description).includes(inputWord)) {
          newRecipe.push(recipe);
          recipeMatched = true;
        }
      }
      if (!recipeMatched) {
        const ingredients = recipe.ingredients;
        for (let j = 0; j < ingredients.length; j++) {
          const ingredient = ingredients[j];
          if (
            removeAccentsUppercase(ingredient.ingredient).includes(inputWord)
          ) {
            newRecipe.push(recipe);
            recipeMatched = true;
            break;
          }
        }
      }
    }

    // Replacement of the list of recipes by the one resulting from the main search
    this.recipePrincipal = newRecipe;
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
      // Create HTML elements
      let containerHTML;
      containerHTML = `<div class="container-articles">`;

      this.recipes.forEach((recipe) => {
        // HTML of each recipe
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

      return containerHTML;
    }
  }
  /**
   * Function to build Html elements of all lists, event on all buttons
   * and behavior of DOM elements when user make an input
   * Called by displayListUnderSecondarySearch(recipes)
   */
  setDisplayListUnderAdvanceSearch() {
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
     * Function to initialize event of all buttons of the different lists
     * @param {string} classe
     * @param {string} categorie
     */
    const self = this;
    function eventsToButtons(classe, categorie) {
      const allButtons = document.querySelectorAll(classe);
      allButtons.forEach((element) => {
        if (element.style.display !== "none") {
          element.addEventListener("click", function (e) {
            const tag = { word: e.target.textContent, button: categorie };
            allTags.push(tag);
            // Called to create DOM "Tag"
            self.setDisplayTags(tag);
          });
        }
      });
    }
    eventsToButtons(".button-ingredient", "ingredient");
    eventsToButtons(".button-appliance", "appliance");
    eventsToButtons(".button-ustensil", "ustensil");

    //***********************************************************/
    // Manage the behavior of DOM elements when there is an input
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
        chevron.classList.add("rotated");

        // Change placeholder when lists closed
        let newPlaceholder;
        if (dropDown.classList.contains("list-appliances")) {
          newPlaceholder = "Appareils";
        } else if (dropDown.classList.contains("list-ustensils")) {
          newPlaceholder = "Ustensils";
        } else {
          newPlaceholder = "Ingrédients";
        }
        const inputValue = removeAccentsUppercase(e.target.value);
        // If no value in Input
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
        }
        const listButtonUnder = document.querySelectorAll(
          inputSearchElement.buttonClass
        );
        // Make appear or disappear the buttons
        listButtonUnder.forEach((button) => {
          const buttonText = removeAccentsUppercase(button.textContent);
          button.style.display = buttonText.includes(inputValue)
            ? "block"
            : "none";
        });
      });
    });
  }
  /**
   * Function to build HTML element "Tag"
   * Called by setDisplayListUnderAdvanceSearch()
   * @param {object} objectTag
   */
  setDisplayTags(objectTag) {
    // Receive selected tag
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
    // Creation DOM element "Tag"
    const containerTags = document.querySelector(".container-tags");
    const spanTag = document.createElement("span");
    spanTag.style.backgroundColor = bgColor;
    spanTag.innerHTML = `${objectTag.word} &emsp;<i class="fa-regular fa-circle-xmark"></i>`;
    containerTags.appendChild(spanTag);
    // Called to search and display the new recipes
    this.getSearchByTagList();

    ///////////////////////////////////////
    // Management of the deletion of a tag
    const deleteTags = document.querySelectorAll(".fa-circle-xmark");
    deleteTags.forEach((element) => {
      element.addEventListener(
        "click",
        function (e) {
          // Span "the parent node" of the "Icon"
          const spanOfTag = e.target.parentNode;
          const tagText = spanOfTag.textContent.trim();
          // Remove the tag from the "allTags" array
          allTags = allTags.filter((tag) => tag.word !== tagText);
          spanOfTag.remove();
          // Called to search and display the new recipes
          this.getSearchByTagList();
        }.bind(this)
      );
    });
  }
  /**
   * Function that displays new recipes corresponding to the chosen tags
   * Called by setDisplayTags(objectTag)
   */
  getSearchByTagList() {
    // Reinitialize list of recipes with tags
    recipesWithTagList = [];
    // Check if there are already tags
    if (allTags.length == 0 && recipeAfterSearchPrincipal.length == 0) {
      displayAllRecipes(recipesOriginal);
    } else {
      // Create an array containing each "word" and value of "button" in the list of tags by raising its last letter
      // in order to manage singulars and plurals
      const singularAndPlural = [];

      allTags.forEach(({ word, button }) => {
        const words = word.split(",");
        words.forEach((item) => {
          // To solve the problem of "Maïs" and "Maïzzena" -> "Maï", "item" must be > 4
          if (item.length > 4 && item.slice(-1) === "s") {
            singularAndPlural.push({ word: item.slice(0, -1), button });
          } else {
            singularAndPlural.push({ word: item, button });
          }
        });
      });
      // Definition of the list of current recipes generated or not by the main search
      const listRecipes =
        recipeAfterSearchPrincipal.length > 0
          ? recipeAfterSearchPrincipal
          : recipesOriginal;

      const recipesWithTag = listRecipes.filter((recipe) => {
        // Create an empty Set object, to add unduplicated recipes that meet the conditions
        const wordsFound = new Set();

        recipe.ingredients.forEach((ingredient) => {
          // Lowercase the 1st letter of the words "ingredient" and "singularAndPlural" to handle words starting with a lowercase
          const ingredientFirstLowerCase =
            ingredient.ingredient.charAt(0).toLowerCase() +
            ingredient.ingredient.slice(1);

          singularAndPlural.forEach(({ word, button }) => {
            if (button === "ingredient") {
              const singularAndPluralFirstLowerCase =
                word.charAt(0).toLowerCase() + word.slice(1);
              if (
                ingredientFirstLowerCase.includes(
                  singularAndPluralFirstLowerCase
                )
              ) {
                wordsFound.add(word);
              }
            }
          });
        });
        // AND for in each Device
        singularAndPlural.forEach(({ word, button }) => {
          if (button === "appliance") {
            if (
              recipe.appliance.includes(word) ||
              recipe.appliance.includes("Casserolle")
            ) {
              wordsFound.add(word);
            }
          }
        });
        // And in the list of Utensils
        recipe.ustensils.forEach((ustensil) => {
          singularAndPlural.map(({ word, button }, index) => {
            if (button === "ustensil") {
              if (word === "Casserole") {
                singularAndPlural[index].word = "Casserolle";
              }
              if (ustensil.toUpperCase().includes(word.toUpperCase())) {
                wordsFound.add(word);
              }
            }
          });
        });
        // If all the words of "singularAndPlurial" were found in "wordsFound", return "true"
        // So keep the current recipe
        return singularAndPlural.every(({ word }) => wordsFound.has(word));
      });
      //Retrieval all recipes with tags
      recipesWithTagList = recipesWithTag;
      //Instantiating the class with "this.recipes=recipesWithTag" to generate the recipes display
      displayAllRecipes(recipesWithTag);
    }
  }
}
