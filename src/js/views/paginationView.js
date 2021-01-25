'use strict';

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationViewClass extends View {
  _ParentElement = document.querySelector('.pagination');

  addHandlerPage(handler) {
    this._ParentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      //   console.log(btn);

      //IMPORTANT we added data-goto to each of the HTML elements so we could  so we can have access to page numbers. we can use this variable to tell javascript to move to the next or previous page

      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      console.log(gotoPage);

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    // console.log(curPage);
    //generates total amount of [ages needed to display results. ]
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // page 1 and there are other pages

    if (curPage === 1 && numPages > 1) {
      // console.log(`there is 1 page and other pages`);

      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span> Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>s`;
    }

    // last page ---
    if (curPage === numPages && numPages > 1) {
      console.log(`we're on the last page`);

      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button> `;
    }

    //other page ---
    if (curPage < numPages) {
      console.log(
        `there are other pages still to go through, we're on a page that is not number one.`
      );

      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span> Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> `;
    }

    // page 1 and there are no other pages
    return console.log(`there is only one page`);
    // ---
  }
}

export default new paginationViewClass();
