'use strict';

// if (module.hot) {
//   module.hot.accept();
// }

//NS IMPORTS

import * as model from './model.js';
import recipeViewClass from './views/recipeView.js';
import searchViewClass from './views/searchView.js';
import resultsViewClass from './views/resultsView.js';
import paginationViewClass from './views/paginationView.js';
import bookmarksViewClass from './views/bookmarksView.js';
import previewViewClass from './views/previewView.js';
import addRecipeViewClass from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config/';

// COMMENT making sure our aplliction work on old browers

// NS CORE IMPORTS

// parcel installs babel which transpiles our syntax back to ES5.

import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async await
import { values } from 'regenerator-runtime/runtime';

//IMPORTANT stops the app from reloading whenever we change the app code.

// if (module.hot) {
//   module.hot.accept();
// }

//IMPORTANT; WHEN CREATING NEW MARK UP ONLY ON THE FLY --
// parcel is not automatically refeencing our images out the box. the original index.html is referencing the images from the origninal folder. so we need to tell javascript and parcel to use the folders in the disfolder manually my importing the folder where we keep are images. we must port the icons from the view of the orignal js file we are workng on, which is conttollder js. once we have connected it, we only have to go in the js file we are wrking on 'controller' and replace the url refeeence to the images with 'icons' then it will reference the folder in the dis folder parcel has created so its ready to ship later on. this is a full development set up, you must undersand this.

// https://forkify-api.herokuapp.com/v2

// NS Loading recipe

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // console.log(id);

    //  we USE slice to remove the # simple so we can use it as part of the new url to retireve the recipe and render it.

    //  id there is no ID we dont get the spinner and nothing happens

    if (!id) return;

    /// LOADING SPINNER
    recipeViewClass.renderSpinner();

    ///// update results view to mark selected search results

    resultsViewClass.update(model.getSearchResultsPage());

    /// LOADING RECIPE
    await model.loadRecipe(id);

    /// Rendering Recipe
    recipeViewClass.render(model.state.recipe);

    // IMPORTANT you did when you want to render eleents on the FLY dynamically. you create the markup in the html and comment it out then copy and paste it in the js file, wrap it in a funtion, eidit and use addadjacementhtml( posision, funtion) to render it on the fly.

    /// UPDATING BOOKMARKS VIEW

    bookmarksViewClass.render(model.state.bookmarks);
  } catch (err) {
    console.error(err);

    recipeViewClass.renderError(model.state.recipe); // renderError displays the error in the UI.
  }
};

// NS

const controlSearchResults = async function () {
  try {
    resultsViewClass.renderSpinner();

    // get search query ---
    const query = searchViewClass.getQuery();
    if (!query) return;

    // load search results  ---
    await model.loadSearchResults(query);

    // render results per page ---
    resultsViewClass.render(model.getSearchResultsPage());

    // render initial pagination buttons ---
    paginationViewClass.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//NS

const controlPagination = function (gotoPage) {
  resultsViewClass.render(model.getSearchResultsPage(gotoPage));

  // render initial pagination buttons ---
  paginationViewClass.render(model.state.search);

  console.log(model.state.search);
};

// NS

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);
  // update the recipe view

  // recipeViewClass.render(model.state.recipe);
  recipeViewClass.update(model.state.recipe);
};

// NS

const controlAddBookmark = function () {
  /// ADD AND REMOVE BOOKS MARKS

  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);

    //view bookmarks object to see how it works.
    // console.log(model.state);
  } else model.deleteBookmark(model.state.recipe.id);

  /// UPDATE RECIPE VIEW

  recipeViewClass.update(model.state.recipe);

  /// RENDER SAVED BOOKMARKS COLLECTION TAB AND VIEW.

  bookmarksViewClass.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    /// show loading spinner

    addRecipeViewClass.renderSpinner();

    /// uploading new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    /// render recipe

    recipeViewClass.render(model.state.recipe);

    /// SUCCESS MESSAGE

    addRecipeViewClass.renderMessage();

    /// re render bookmarks view

    bookmarksViewClass.render(model.state.bookmarks);

    /// change ID in the URL - pushState updates the URL link  without reloading the page!

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    ///close form window
    setTimeout(function () {
      addRecipeViewClass.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    console.error(`❌ ${err}`);
    addRecipeViewClass.renderError(err.message);
  }
  // console.log(newRecipe);

  /// FIXES BUG ON NOT BeING ABLE TO LOAD THE FORM AGAIN.
  setTimeout(function () {
    location.reload();
  }, 1500);
};

//IMPORTANT Handler functions, they control what is happening and when.
const init = function () {
  recipeViewClass.addHandlerRender(controlRecipes);
  recipeViewClass.addHandlerUpdateServings(controlServings);
  recipeViewClass.addHandlerAddBookmark(controlAddBookmark);
  searchViewClass.addHandlerSearch(controlSearchResults);
  paginationViewClass.addHandlerPage(controlPagination);
  addRecipeViewClass.addHandlerUpload(controlAddRecipe);
};

init();

console.log(`hey welcome to the application`);
