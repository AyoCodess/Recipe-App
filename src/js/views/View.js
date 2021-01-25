'use strict';

import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  //COMMENT HOW TO DO COMMENTS // JSDOCS
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g recipe)
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if the render =false
   * @this {Object} View instance
   * @author Ayo Adesanya
   * @todo Finish the implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //Stores recipe data
    this._data = data;

    //Ganerating the recipes
    const markup = this._generateMarkup();

    if (!render) return markup;

    // Clears ld HTML
    this._clear();

    //TDisplays Recipe

    this._ParentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //COMMENT DEVELOPING a DOM UPDATING ALGORITHM

  update(data) {
    this._data = data;

    ///IMPORTANT/// The instructions work universally but are written as if they we're made for the recipe view.

    ///// the live version of the --- RECIPE CONTAINER HTML --- that is not yet displayed on the page
    const LiveMarkup = this._generateMarkup();
    // console.log(LiveMarkup);

    ///// converting it so we can see what it looks like in the console as a element not a string. It will become a virtual DOM object we can traverse. its the same as the original DOM with the live changes after clicking the servings buttons.
    const newLiveDom = document
      .createRange()
      .createContextualFragment(LiveMarkup);
    // console.log(newLiveDom);

    ///// This will give a complete list of every single node in the new live dom we have virtually created in memory based of the button click on servings from 4 to 5 people. If we check for the element we are interested in, open it up and find its inner HTML (text property) attribute we will find the number 5. With this we can compare this virtual DOM with the dom that is actually on the page.

    const newLiveDomElements = newLiveDom.querySelectorAll('*');
    // console.log(newLiveDomElements);

    ///// We need to perform the actual comparison fo the old and new DOM. We first select all the elements in the current dom displayed on our page, ww have named in old elements. now we can compare both and see whats changed between them.

    const oldElements = this._ParentElement.querySelectorAll(`*`);
    // console.log(oldElements);

    ///// to do the comparison we must convert them both in arrays and loop over them

    const newLiveDomElementsArray = Array.from(newLiveDomElements);
    const oldElementsArray = Array.from(oldElements);

    // console.log(newLiveDomElementsArray, oldElementsArray);

    ///// now we can do the loop, we will need both the current element and the index, so we can grab the same element in the 2nd array we are looping over in the old elementsArray

    newLiveDomElementsArray.forEach((newEl, i) => {
      ///// this is how we loop at the same time, we attach the 2nd array to the first by using the index, as they will share the same elements at the exact same indexes.

      const oldEl = oldElementsArray[i];

      ///// now we need to the comparison formula to compare both, we use the "isEqualMethod" which compares nodes together, so if there is a change we can see it. we log the old element again at the start, so we can see what we are comparing it too also. BUT it will also make false the parent nodes of every element that was physically changed, this will be address in the next stage.

      // console.log(oldEl, newEl.isEqualNode(oldEl));

      ///// now we want to change the text content in the old dom so it reflects changes in the new dom and displays it. As we do not want to update the whole container and re-render everything which adds a lot of load to the browser. we only want to update the small div that changed, which is the servings, from 4 to 5.

      ///// this if statement will update the DOM (the doms nodes) in only the places that has changed, and in places that ONLY contains TEXT!

      ///// the if statement without the && argument (2nd argument) changed parents of nodes that have changed so we must check for something else also. so it only changes text. IMPORTANT WE use firstChild so parent DIVS are not selected (keeping the CSS intact) only its children elements are changed As its these elements like <span></span> which as that text that needs to be updated. trim() removes white space.

      ///// nodeValue, returns nodes that only content text. if the node and the text init is not empty "" then it will work. so different from an empty string we add optional chaining (?) as the first child might not always exist and stops errors occurring that may block the application, so if there is no firstChild, noting happens.

      // UPDATES CHANGED TEXT----
      if (
        !newEl.isEqualNode(oldEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        ///// the console.log shows all the elements that meet our requirements that are changed to reflect what was in the new dom, to be reflected in the old dom (what we see in the browser)
        // console.log(`🛑`, newEl.firstChild.nodeValue.trim());
        oldEl.textContent = newEl.textContent;

        ///// We also now need to change the attributes associated with the elements we have updated so our application works.
      }

      // UPDATES CHANGED ATTRIBUTES----
      // we are replacing all the attributes from the old dom with the new live ones in memory. So the buttons work correctly.
      if (!newEl.isEqualNode(oldEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => {
          // console.log(oldEl.setAttribute(attr.name, attr.value));
          oldEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    // Getting rid of stock markup
    this._ParentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;

    this._clear();
    this._ParentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderError(message = this._errorMessage) {
    const markup = ` 
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();
    this._ParentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderMessage(message = this._message) {
    const markup = ` 
    <div class="recipe">
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._ParentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
