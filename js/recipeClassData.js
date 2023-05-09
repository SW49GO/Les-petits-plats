/* eslint-disable no-unused-vars */
class RecipeData {
  constructor(data) {
    this.recipes = data;
  }
  /**
   * Function to build Html elements of all recipes
   */
  getDisplayRecipes() {
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
