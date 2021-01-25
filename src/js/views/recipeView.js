'use strict';

//NS IMPORTS

// import icons from `../img/icons.svg`; //parcel 1

// for parcel to for any other assest other than js and html files we must use url: before the path.

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View.js';

// parcel 2
// console.log(icons);
// COMMENT links to images in he dis folder

//IMPORTANT The controller calls this funtions to redender the logic state in the application for the user to see.

// NS APP VIEW

class recipeViewClass extends View {
  _ParentElement = document.querySelector('.recipe');

  _errorMessage = `We could not find that recipe. Please try another one!`;
  _message = '';

  // IMPORTANT
  // NS PUBLISHER SUBSCRIBER PATTERN NS - this funtion separates the presentation logic from the application logic. We do not want attribury functions calling other funtions. eveuthing should be organised and have struture. so we create a init() in the applicaiton logic js file (controller) which will handle events that have to do with the application logic , but we do not want to listen t0 presentatipnal change events, anything that has to do with the maniupulating the dom in the controller js file. that should be handled in the views. To implemnt this we must create a function in the view js file, that listens to all the events that have to do with the DOM, but do not handle them, AS the contoller will handle then, in the init() function, this is why we create the addHandlerRender funtion. It lisetns to any changes to the DOM in the views js, BU IT DOES NOT THE logic of calling it, the init() does that automatcall in the controller file, as thats the funtion we pass to it as an argument there which is the handler agument for the funtion is the views js file. ** The handler argument (funtion) in addhandlerender() will be called and executed by init() when the event lisenining logic in the addhanderrender() function is triggered.

  addHandlerRender(handler) {
    // NS TITLE IMPLEMTING lOADING OF RECIPES NS

    // COMMENT  were now lisenting for the href # tag change which we can use to load recipuies as users click on links

    // window.addEventListener('hashchange', controlRecipes);
    // window.addEventListener('load', controlRecipes);

    ['hashchange', 'load'].forEach(ev => {
      window.addEventListener(ev, handler);
    });

    // COMMENT this will call the fucntion that will render the hash url onto the page. we also have to listen to the load, so if the url get copied it immediially loads the recipli.

    // COMMENT we all also have to accpunt for the scenario that the app is loaded without any id.
  }

  addHandlerUpdateServings(handler) {
    // conntecting javascript to the dom
    this._ParentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      // console.log(btn);

      ///// we are creating a link between the DOM and javascript. by adding the class to the html through a template literal that gives us a number to kn ow what servings we are at.
      const { updateTo } = btn.dataset;

      ///// this stops it from decreasing below 0
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._ParentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? new Fraction(ing.quantity).toString() : (ing.quantity = '')
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
  }
}

export default new recipeViewClass();
