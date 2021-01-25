'use strict';

import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewViewClass from './previewView';

class resultsViewClass extends View {
  _ParentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;
  _message = '';

  _generateMarkup() {
    return this._data
      .map(searchResults => previewViewClass.render(searchResults, false))
      .join('');
  }
}

export default new resultsViewClass();
