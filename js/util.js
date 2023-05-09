/* eslint-disable no-unused-vars */
// Declare DOM Elements
// Containers of each List
const containerIngredient = document.querySelector(".list-ingredients");
const containerAppliance = document.querySelector(".list-appliances");
const containerUstensil = document.querySelector(".list-ustensils");
// Input principal search
const searchPrincipal = document.querySelector(".search");

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
