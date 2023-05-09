/* eslint-disable no-unused-vars */
// Declare DOM Elements
// Containers of each List
const containerIngredient = document.querySelector(".list-ingredients");
const containerAppliance = document.querySelector(".list-appliances");
const containerUstensil = document.querySelector(".list-ustensils");
// Input principal search
const searchPrincipal = document.querySelector(".search");
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
  console.log("unique:", unique);

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
  // Chevron in its normal, "unreturned" state
  let isRotated = false;

  chevronElement.addEventListener("click", function () {
    const inputSearch = inputSearchElement.element;
    console.log(`inputSearch ${inputSearchElement}:`, inputSearch);
    // Inversion of the original state
    isRotated = !isRotated;
    if (isRotated) {
      chevronElement.style.transform = "rotate(180deg)";
      inputSearch.placeholder = `Rechercher un ${inputSearchElement.buttonClass.slice(
        8
      )}`;
      inputSearch.style.width = "100%";
      inputSearch.style.borderRadius = "0.5rem 0.5rem 0 0";
      inputSearch.disabled = true;
    } else {
      let namePlaceholder;
      if (inputSearchElement.buttonClass.slice(8).charAt(0) === "i") {
        namePlaceholder = "Ingrédients";
      } else if (inputSearchElement.buttonClass.slice(8).charAt(0) === "a") {
        namePlaceholder = "Appareils";
      } else {
        namePlaceholder = "Ustensiles";
      }
      chevronElement.style.transform = "rotate(0deg)";
      inputSearch.placeholder = namePlaceholder;
      inputSearch.style.width = "10rem";
      inputSearch.style.borderRadius = "0.5rem";
      inputSearch.disabled = false;
    }
    containerElement.classList.toggle("hidden");
  });
}

inputSearchElements.forEach(function (inputSearchElement, index) {
  const chevronElement = document.querySelectorAll(".fa-chevron-down")[index];
  const containerElement = document.querySelectorAll(".dropdown-list")[index];

  setupInputSearchElements(
    inputSearchElement,
    chevronElement,
    containerElement
  );
});

inputSearchElements.forEach((inputSearchElement) => {
  const inputElement = inputSearchElement.element;
  inputElement.addEventListener("focus", function () {
    inputElement.placeholder = "";
    // const dropDownList =
    //   inputSearchElement.element.parentNode.parentNode.querySelector(
    //     ".dropdown-list"
    //   );
    // dropDownList.classList.toggle("hidden");
  });
});
inputSearchElements.forEach((inputSearchElement) => {
  const inputElement = inputSearchElement.element;
  inputElement.addEventListener("blur", function () {
    // const dropDownList =
    //   inputSearchElement.element.parentNode.parentNode.querySelector(
    //     ".dropdown-list"
    //   );
    // dropDownList.classList.toggle("hidden");

    if (inputSearchElement.buttonClass.slice(8) == "ingredient") {
      inputElement.placeholder = "Ingrédients";
    } else if (inputSearchElement.buttonClass.slice(8) == "appliance") {
      inputElement.placeholder = "Appareils";
    } else {
      inputElement.placeholder = "Ustensiles";
    }
  });
});
