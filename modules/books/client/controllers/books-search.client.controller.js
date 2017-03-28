(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksSearchController', BooksSearchController);

  BooksSearchController.$inject = ['Authentication', 'BooksSearchService', 'Toast', 'DiacriticsUtilService', 'BooksListService', '$scope'];

  function BooksSearchController(Authentication, BooksSearchService, Toast, DiacriticsUtilService, BooksListService, $scope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.books = BooksListService.getBooks();
    vm.search = search;
    vm.booksQuerySearch = booksQuerySearch;
    vm.searchForm = { version: 'aa' };
    vm.versions = [{
      abbrev: 'aa',
      name: 'Almeida Atualizada'
    }, {
      abbrev: 'acf',
      name: 'Almeida Corrigida Fiel'
    }, {
      abbrev: 'nvi',
      name: 'Nova Versão Internacional'
    }];

    function search(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.searchForm');
        Toast.error('Campos não preenchidos corretamente');
        return false;
      }
      BooksSearchService.get({
        version: vm.searchForm.version,
        abbrev: vm.searchForm.book ? vm.searchForm.book.abbrev : null,
        searchTerm: vm.searchForm.searchTerm
      }).$promise
        .then(function (result) {
          if (result.length === 200) {
            var msg = 'Sua pesquisa obteve mais de 200 versículos como resultado.';
            if (!vm.searchForm.abbrev) {
              msg += ' Experimente filtrar por um livro ou usar um termo de pesquisa mais específico.';
            } else {
              msg += ' Experimente usar um termo de pesquisa mais específico.';
            }
            Toast.warning(msg);
          }
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
