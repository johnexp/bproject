(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksSearchController', BooksSearchController);

  BooksSearchController.$inject = ['Authentication', 'BooksSearchService'];

  function BooksSearchController(Authentication, BooksSearchService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.search = search;
    vm.searchForm = {};

    function search() {
      if (!vm.searchForm.abbrev) {
        vm.searchForm.abbrev = null;
      }
      BooksSearchService.get({
        version: vm.searchForm.version,
        abbrev: vm.searchForm.abbrev,
        searchTerm: vm.searchForm.searchTerm
      }).$promise
        .then(function (result) {
          vm.result = result;
        });
    }
  }
}());
