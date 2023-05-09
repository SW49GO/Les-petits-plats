/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class RecipeData {
  constructor(data) {
    this.recipes = data;
  }
  /**
   * Function to retrieve all Ingredients
   * Called by : displayListUnderSecondarySearch(recipes)
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
    return ingredientWithoutDuplicate;
  }
  /**
   * Function to retrieve all Appliances
   * Called by : displayListUnderSecondarySearch(recipes)
   */
  getAllAppliances() {
    const applianceData = this.recipes.map(({ appliance }) => appliance);
    const applianceWithoutDuplicate = removeDuplicate(applianceData);
    console.log("applianceWithoutDuplicate:", applianceWithoutDuplicate);
    return applianceWithoutDuplicate;
  }
  /**
   * Function to retrieve all Ustensils
   * Called by : displayListUnderSecondarySearch(recipes)
   */
  getAllUstensils() {
    const ustensilData = this.recipes.map(({ ustensils }) => ustensils);
    // La méthode flat() permet de créer un nouveau tableau contenant les éléments
    // des sous-tableaux du tableau passé en argument, qui sont concaténés récursivement
    const listUstensilDatas = ustensilData.flat();
    const ustensilWithoutDuplicate = removeDuplicate(listUstensilDatas);
    console.log("ustensilWithoutDuplicate:", ustensilWithoutDuplicate);
    return ustensilWithoutDuplicate;
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
}
