// IMPORTANT We are ceating a state object that keep the current state of the application containg other app objects which do various things like seach and bookmarks etc... this will called my the controller, which will call a view eventually to render the state. We must export and import into the controller so we can use it.
('use strict');

import { async } from 'regenerator-runtime';
// NS IMPORTS
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { AJAX } from './helpers.js';
// import { sendJSON } from './helpers.js';

import { AJAX } from './helpers';
//  NS STATE OBJECT

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

//  NS  LOADING THE RECIPE

// this is an async function as its will be a promise feting data from the web.

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    //temp handling
    throw err; // from AJAX(), now we want to render it ont he UX, fist we must throw the error down to controller.
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // returning a new array with a new object we where we have replaced some of key names and attached it to the original value pair.

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; // resets the page to 1, after new live searches
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // take the page number and multiply by the amount of results you want to see on the page.

  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; // 9

  // the slice method does not include the las number we pass in, so state.search.resultsPerPage becomes 9. so it works. as arrays are 0 based.

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // new quantity = old quantity * new servings / old servings
    // 2 * 8 / 4 = 4 ( so if w double the servings, we double the quantity) multiplying the original quantity by a ratio.
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  ///// add bookmark
  state.bookmarks.push(recipe);

  ///// mark current recipe as bookmark

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  ///// delete bookmark

  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  ///// mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

/// pushes local storage saved bookmarks into the state object so we can render it when the page loads
const initBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

initBookmarks();

//IMPORTANT CLEAR BOOKSMARKS
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    //IMPORTANT this is the original object we downloaded from the user form inputs, we will transform this object into one, our application can understand and send back to the API to be stored in the application.

    // console.log(newRecipe);

    /// we need to fix the ingredients section in the object by putting them in a format our application can understand. firstly we need to convert the obeject back into an array

    // console.log(Object.entries(newRecipe));

    /// we use thr filter to find entry with ingredients and that it should have a value (the 2nd element in the array) (in other words not have an empty string), then using MAP we need to take the long string with the quantity, unit, food and put that into an object.
    const ingredientsStage1 = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );

    // console.log(ingredientsStage1);

    /// replace al needs a string, so we deconstruct the array into a long string to make it possible

    const ingredients = ingredientsStage1.map(ing => {
      /// this converts the whole array on entry0 into a long string
      // console.log(`Ⓜ️ ing: ${ing}`); // an array

      /// only converts entry1 into a string
      // console.log(`❎ ing 2nd entry: ${ing[1]}`); // taking the string out the array

      /// deconstructing the string, breaks the string up base on the "," which mean there will be 3 separate strings and sets them to keys in a specific order!

      // const ingArr = ing[1].replaceAll(' ', '').split(',');

      /// splits each element by string first, hen loops over and removes white space.
      const ingArr = ing[1].split(',').map(el => el.trim());
      // console.log(ingArr);

      /// if a user does not input 3 items separated by comers, it throws an error.
      if (ingArr.length !== 3)
        throw new Error('Wrong ingredient format, Please use correct format.');

      const [quantity, unit, description] = ingArr;

      // console.log(quantity);
      // console.log(unit);
      // console.log(description);

      /// consoling each string, this will only print them if they exist! some of these keys don't exist on the string.

      // console.log(
      //   `🛑 the final string, some keys do not exist: "${quantity}, ${unit}, ${description}"`
      // );

      /// converts it an object we can use, we can edit the object also to a format the application understands. We also want to make sure if quantity does exist it should be a numbers if not it should be null.
      return { quantity: quantity ? +quantity : null, unit, description };
    });

    /// we can now create a new object and put the new recipe keys and value in the same structure our API and application will understand it. it is the reverse of the state.recipe object.

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      /// added the array
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);

    // const res = data.json();
  } catch (err) {
    throw err;
  }
};
