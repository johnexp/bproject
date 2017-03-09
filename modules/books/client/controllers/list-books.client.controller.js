(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksListController', BooksListController);

  BooksListController.$inject = ['$mdBottomSheet'];

  function BooksListController($mdBottomSheet) {
    var vm = this;
  }
}());
