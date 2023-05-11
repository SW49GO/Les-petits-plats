/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Declare DOM Elements
// Containers of each List
const containerIngredient = document.querySelector(".list-ingredients");
const containerAppliance = document.querySelector(".list-appliances");
const containerUstensil = document.querySelector(".list-ustensils");
// Input principal search
const searchPrincipal = document.querySelector(".search");
// Container modal
const modal = document.querySelector(".container-modal");
// Container all recipes
const containerRecipes = document.querySelector(".container-recipes");
// Input selector for "Ingredients, Appliances and Ustensls"
const inputSearchElements = [
  {
    element: document
      .querySelector(".input-ingredient")
      .getElementsByTagName("input")[0],
    buttonClass: ".button-ingredient",
  },
  {
    element: document
      .querySelector(".input-appliance")
      .getElementsByTagName("input")[0],
    buttonClass: ".button-appliance",
  },
  {
    element: document
      .querySelector(".input-ustensil")
      .getElementsByTagName("input")[0],
    buttonClass: ".button-ustensil",
  },
];
// Chevrons of each list
const chevronIngredient = document
  .querySelector(".input-ingredient")
  .getElementsByTagName("i")[0];
const chevronAppliance = document
  .querySelector(".input-appliance")
  .getElementsByTagName("i")[0];
const chevronUstensil = document
  .querySelector(".input-ustensil")
  .getElementsByTagName("i")[0];

/**
 * Function to remove accents and capitalize the searched word
 * @param {string} inputWord
 * @returns
 */
const removeAccentsUppercase = (inputWord) => {
  const normalizedWord = inputWord
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return normalizedWord.toUpperCase();
};

/**
 * Function that removes duplicate words, adds a capital letter to the first letter
 * sorted alphabetically, and corrected some mistakes
 * @param {array} array
 * @returns {array}
 */
function removeDuplicate(array) {
  // console.log("array:", array);
  // Use the "reduce" method to traverse the array only once
  // and returns the result of the "original" array
  const unique = array.reduce(
    (acc, curr) => {
      const normalizedCurr = removeAccentsUppercase(curr);
      // console.log("normalizedCurr:", normalizedCurr);
      if (!acc.normalized.includes(normalizedCurr)) {
        acc.normalized.push(normalizedCurr);
        acc.original.push(curr.charAt(0).toUpperCase() + curr.slice(1));
      }
      return acc; // ex: {normalizes=['POMME'], original=['Pomme']}
    },
    { normalized: [], original: [] }
  ).original; //-> return original=['Pomme']

  // Sorting in alphabetical order according to the French standard
  unique.sort((a, b) => a.localeCompare(b, "fr"));
  // console.log("unique:", unique);

  // New table with changes to words to be uniquely replaced
  const uniqueTransformed = unique.reduce((acc, inputWord) => {
    const transformedWord = inputWord
      .replace("Casserolle", "Casserole")
      .replace(/\bPomme\b/gi, "Pommes")
      .replace(/\bKiwi\b/gi, "Kiwis")
      .replace(/\bHuile d'olive\b/gi, "Huile d'olives")
      .replace(/\bBanane\b/gi, "Bananes")
      .replace(/\bCoulis de tomate\b/gi, "Coulis de tomates");

    if (!acc.includes(transformedWord)) {
      acc.push(transformedWord);
    }

    return acc;
  }, []);

  return uniqueTransformed;
}

/**
 *Function to change chevrons, change (text, width and disabled) input button
 * @param {string} inputSearchElement -> HTML element
 * @param {string*} chevronElement -> HTML element
 * @param {string} containerElement -> HTML element
 */

function setupInputSearchElements(
  inputSearchElement,
  chevronElement,
  containerElement
) {
  chevronElement.addEventListener("click", function () {
    console.log("click");

    const inputSearch = inputSearchElement.element;
    chevronElement.classList.toggle("rotated");
    if (!chevronElement.classList.contains("rotated")) {
      inputSearch.value = "";

      console.log("original", recipesOriginal);
      console.log("recettePrincipe", recipeAfterSearchPrincipal);
      console.log("recipeWithTag", recipesWithTagList);
      if (
        recipeAfterSearchPrincipal.length === 0 &&
        recipesWithTagList.length !== 0
      ) {
        displayAllRecipes(recipesWithTagList);
      } else if (recipeAfterSearchPrincipal.length !== 0) {
        displayAllRecipes(recipeAfterSearchPrincipal);
      } else {
        displayAllRecipes(recipesOriginal);
      }

      console.log("original", recipesOriginal);
      console.log("recettePrincipe", recipeAfterSearchPrincipal);
    }

    const buttonClass = inputSearchElement.buttonClass.slice(8);
    const isIngredient = buttonClass.startsWith("i");
    const isAppareil = buttonClass.startsWith("a");
    const placeholder = isIngredient
      ? "Ingrédients"
      : isAppareil
      ? "Appareils"
      : "Ustensiles";

    inputSearch.placeholder = chevronElement.classList.contains("rotated")
      ? `Rechercher un ${placeholder}`
      : placeholder;

    inputSearch.classList.toggle("open");
    containerElement.style.display = inputSearch.classList.contains("open")
      ? "block"
      : "none";
    inputSearch.classList.remove(
      inputSearch.classList.contains("open") ? "close" : "changePlaceholder"
    );
    inputSearch.classList.add(
      inputSearch.classList.contains("open") ? "changePlaceholder" : "close"
    );
  });
}

inputSearchElements.forEach(function (inputSearchElement, index) {
  const chevronElement = document.querySelectorAll(".fa-chevron-down")[index];
  const containerElement = document.querySelectorAll(".dropdown-list")[index];
  console.log("containerElement:", containerElement);

  setupInputSearchElements(
    inputSearchElement,
    chevronElement,
    containerElement
  );
});

async function displayModal(id) {
  const recipes = await getJsonDataRecipes();
  // Trouver la recette correspondante
  const theRecipe = recipes.recipes.find((recipe) => recipe.id === id);

  containerRecipes.style.display = "none";
  modal.classList.toggle("hidden");

  let article = `<h1>${theRecipe.name}<i class="fa-solid fa-xmark" onclick="closeModal()"></i></h1><article class="modal-article"><div class="recipe-picture"></div><p class="serving">${theRecipe.name} pour ${theRecipe.servings} personne(s)</p><p>Temps de préparation : ${theRecipe.time} mn</p><div class="theIngredients"><h2>Liste des ingrédients :</h2>`;
  theRecipe.ingredients.forEach((ingredient) => {
    const unit = ingredient.unit || "";
    article += `<p>${ingredient.ingredient} : ${ingredient.quantity} ${unit}</p>`;
  });
  article += `</div><div class="theAppliances"><h2>Liste des appareils et ustensiles nécessaire</h2><p>Appareil(s) : ${theRecipe.appliance}</p><p>Ustensile(s) : ${theRecipe.ustensils}</p></div><div class="theDescription"><h2>Description :</h2>`;
  const descriptionTab = theRecipe.description.split(".");
  for (const description of descriptionTab) {
    article += `<p>- ${description}</p><br>`;
  }
  article += `</div></article>`;
  modal.innerHTML = article;
}
function closeModal() {
  modal.classList.toggle("hidden");
  containerRecipes.style.display = "block";
}
