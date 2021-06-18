import * as model from './model.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import 'regenerator-runtime/runtime';
import 'core-js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const { async } = require('fast-glob');

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0.
    resultsView.update(model.getSearchResultsPage());
    //1. Loading recipe
    await model.loadRecipe(`${id}`);

    //2. Rending recipe
    recipeView.render(model.state.recipe);
    // controlServings();
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2. load results
    await model.loadSearchResults(query);
    //3.render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4. render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update reipe servings
  model.updateServings(newServings);
  // Update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // setTimeout(function () {
    // addRecipeView._toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);
    console.log(model.state.recipe);
  } catch (err) {
    console.error('😋', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!😎');
};

init();
// showRecipe();
