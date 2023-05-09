/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Array to storage the differents datas
let recipesOriginal = [];
let recipeAfterSearchPrincipal = [];

/**
 * Function to retrieve data from recipes.json file
 * @returns all the recipes
 */
async function getJsonDataRecipes() {
  return await fetch("./data/recipes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
/**
 * Function to retrieve recipe display
 * @param {object} recipes
 */
async function displayAllRecipes(recipes) {
  //   console.log("recipes:", recipes);
  //   console.log("displayAllRecipes:", displayAllRecipes);
  const recipesData = new RecipeData(recipes);
  const displayRecipes = recipesData.setDisplayRecipes();
  const container = document.querySelector(".container-recipes");
  container.innerHTML = "";
  // Retrieval and insertion of HTML elements generated by the "setDisplayRecipes" method of the "RecipeData" class
  container.innerHTML = displayRecipes;
  // Display of the list of Ingredients, Appliances and Ustensils
  displayListUnderSecondarySearch(recipes);
}
/**
 * Function to display the different lists (Ingredients, Appliances and Utensils)
 * @param {object} recipes
 */
async function displayListUnderSecondarySearch(recipes) {
  // Retrieval of different lists
  const listUnderSearch = new RecipeData(recipes);
  listUnderSearch.getAllIngredients();
  listUnderSearch.getAllAppliances();
  listUnderSearch.getAllUstensils();
  // Display the different lists
  listUnderSearch.setDisplayListUnderAdvanceSearch();
}
async function handlerPrincipalSearch(recipes) {
  searchPrincipal.addEventListener("input", (e) => {
    let inputWord = e.target.value;
    inputWord = removeAccentsUppercase(inputWord);
    console.log("inputWord:", inputWord);
    if (inputWord.length >= 3) {
      const newDisplay = new RecipeData(recipes);
      newDisplay.getSearchPrincipal(inputWord);
      const newArray = newDisplay.recipePrincipal;
      // Storage in an array with Main search result
      recipeAfterSearchPrincipal = newArray;
      // console.log("recipeAfterSearchPrincipal:", recipeAfterSearchPrincipal);
      // Revival of the display of recipes and updates of lists
      displayAllRecipes(newArray);
    } else {
      // Empty the Main search table (in case of a previous search)
      recipeAfterSearchPrincipal = [];
      displayAllRecipes(recipes);
    }
  });
}
/**
 * Initialization function and table
 * To display all the Recipes :  displayAllRecipes(recipes);
 * To display all the Lists : displayListUnderSecondarySearch(recipes);
 * To handle principal search :  handlerPrincipalSearch(recipes);
 * To initialize tab "recipesOriginal", contain all recipes
 */
async function init() {
  const { recipes } = await getJsonDataRecipes();
  //   console.log("recipes:", recipes);
  recipesOriginal = recipes;
  displayAllRecipes(recipes);
  //   displayListUnderSecondarySearch(recipes);
  handlerPrincipalSearch(recipes);
}
init();
