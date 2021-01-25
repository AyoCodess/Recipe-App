'use strict';

import View from './View.js';

class searchViewClass extends View {
  _ParentElement = document.querySelector('.search');
  getQuery() {
    const query = this._ParentElement.querySelector('.search__field').value;

    // clearing search field ---
    this._clearInput();

    return query;
  }

  _clearInput() {
    this._ParentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._ParentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}

export default new searchViewClass();
