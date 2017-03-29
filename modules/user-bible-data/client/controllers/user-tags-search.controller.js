(function () {
  'use strict';

  angular
    .module('books')
    .controller('UserTagsSearchController', UserTagsSearchController);

  UserTagsSearchController.$inject = ['Authentication', 'UserTagsSearchService', 'userCustomDataResolve', 'Toast', 'DiacriticsUtilService', 'BooksListService', '$scope'];

  function UserTagsSearchController(Authentication, UserTagsSearchService, userCustomData, Toast, DiacriticsUtilService, BooksListService, $scope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.books = BooksListService.getBooks();
    vm.abbrevBooks = BooksListService.getAbbrevBooks();
    vm.search = search;
    vm.booksQuerySearch = booksQuerySearch;
    vm.searchForm = {};
    vm.tags = userCustomData.tags;
    vm.clearSearchTerm = clearSearchTerm;

    function clearSearchTerm() {
      vm.searchTerm = '';
    }

    function search(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.searchForm');
        Toast.error('Campos não preenchidos corretamente');
        return false;
      }
      UserTagsSearchService.get({
        book: vm.searchForm.book ? vm.searchForm.book.abbrev : null
      }, {
        tags: vm.searchForm.tags
      }).$promise
        .then(function (result) {
          for (var i = 0; i < result.length; i++) {
            result[i]._id = result[i]._id;
            for (var j = 0; j < result[i].books.length; j++) {
              result[i].books[j].chapters = sortChapters(result[i].books[j].chapters);
              for (var k = 0; k < result[i].books[j].chapters.length; k++) {
                result[i].books[j].chapters[k].verses = sortVerses(result[i].books[j].chapters[k].verses);
              }
            }
          }
          vm.result = result;
        });
    }

    function sortChapters(chapters) {
      return chapters.sort(function (a, b) {
        return a.chapter - b.chapter;
      });
    }

    function sortVerses(verses) {
      return verses.sort(function (a, b) {
        return a - b;
      }).join(', ');
    }

    function booksQuerySearch(query) {
      var books = vm.books.at.concat(vm.books.nt);
      var results = query ? books.filter(createFilterFor(query, 'name')) : books;
      return results;
    }

    function createFilterFor(query, property) {
      var lowercaseQuery = DiacriticsUtilService.removeDiacritics(query.toLowerCase());
      return function filterFn(book) {
        return DiacriticsUtilService.removeDiacritics(book[property].toString().toLowerCase()).indexOf(lowercaseQuery) > -1;
      };
    }

    angular.element(document.getElementsByClassName('select-header-searchbox')).on('keydown', function(ev) {
      ev.stopPropagation();
    });
  }
}());
