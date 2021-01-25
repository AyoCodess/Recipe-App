'use strict';

import previewViewClass from './previewView.js';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class bookmarksViewClass extends View {
  _ParentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No Bookmarks yet. Find a nice recipe and book mark it.`;
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewViewClass.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksViewClass();
