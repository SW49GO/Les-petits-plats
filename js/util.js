/* eslint-disable no-unused-vars */
/**
 * Function to remove accents and capitalize the searched word
 * @param {string} word
 * @returns
 */
const removeAccentsUppercase = (word) => {
  const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
  // Utilisation de la méthode "reduce" pour ne parcourir qu'une seule fois le tableau
  // et renvoi le résulat du tableau "original"
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

  // Tri par ordre alphabétique selon la norme française
  unique.sort((a, b) => a.localeCompare(b, "fr"));
  // console.log("unique:", unique);

  // Nouveau tableau avec les modifications à apporter aux mots à remplacer de façon unique
  const uniqueTransformed = unique.reduce((acc, word) => {
    const transformedWord = word
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
