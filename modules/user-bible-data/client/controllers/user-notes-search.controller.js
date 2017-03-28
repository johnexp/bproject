(function () {
  'use strict';

  angular
    .module('books')
    .controller('UserNotesSearchController', UserNotesSearchController);

  UserNotesSearchController.$inject = ['Authentication', 'UserNotesSearchService', 'Toast', 'DiacriticsUtilService', 'BooksListService', '$scope'];

  function UserNotesSearchController(Authentication, UserNotesSearchService, Toast, DiacriticsUtilService, BooksListService, $scope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.books = BooksListService.getBooks();
    vm.abbrevBooks = BooksListService.getAbbrevBooks();
    vm.search = search;
    vm.booksQuerySearch = booksQuerySearch;
    vm.searchForm = {};

    function search(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.searchForm');
        Toast.error('Campos não preenchidos corretamente');
        return false;
      }
      UserNotesSearchService.get({
        searchTerm: vm.searchForm.searchTerm || '*',
        book: vm.searchForm.book ? vm.searchForm.book.abbrev : null
      }).$promise
        .then(function (result) {
          vm.result = result;
        });
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
  }
}());
