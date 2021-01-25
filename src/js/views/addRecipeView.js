'use strict';

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class addRecipeViewClass extends View {
  _ParentElement = document.querySelector('.upload');
  _message = `Recipe was added successfully!`;
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    /// this methods are immediately called
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  /// this allows us select the parent element that opens the form and also allows us to turn off and on the overlay that hides and displays it depending on if we want to open or close it.

  toggleWindow() {
    //COMMENT we could of used => so we didn't have to use bind
    this._overlay.classList.toggle('hidden'); // blurs background
    this._window.classList.toggle('hidden'); // opens form
    // console.log('open');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //this calls the opening on the from
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._ParentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      /// as we are working with a form and we do want to select all the fields we can use a method to help us with this. FormData then we spread the object into an array.
      const dataArr = [...new FormData(this)];
      /// then we have to convert this array into an object we can read and access more efficiently

      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new addRecipeViewClass();
