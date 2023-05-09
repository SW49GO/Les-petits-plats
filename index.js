/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Array to storage the differents datas
let recipesOriginal = [];

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
  console.log("recipes:", recipes);
  console.log("displayAllRecipes:", displayAllRecipes);
  const recipesData = new RecipeData(recipes);
  const displayRecipes = recipesData.getDisplayRecipes();
  const container = document.querySelector(".container-recipes");
  container.innerHTML = "";
  // Récupération et insertion des éléments HTML générés par la class "RecipeData"
  container.innerHTML = displayRecipes;
}
/**
 * Initialization function
 */
async function init() {
  const { recipes } = await getJsonDataRecipes();
  console.log("recipes:", recipes);
  recipesOriginal = recipes;
  displayAllRecipes(recipes);
}
init();
