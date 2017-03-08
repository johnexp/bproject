(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksListController', BooksListController);

  BooksListController.$inject = ['bookResolve', '$translatePartialLoader', '$translate', 'Toast', 'DialogService', '$log'];

  function BooksListController(book, $translatePartialLoader, $translate, Toast, DialogService, $log) {
    var vm = this;
    vm.bookService = book;
    vm.allBooks = book.getListResource().getAll(function() {
      vm.books = vm.allBooks;
    });
    vm.bookFilter = { active: true };
    vm.changeState = changeState;

    // Change activation state of an existing Book
    function changeState(ev, book) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          vm.bookService.$remove({ bookId: book._id }, function () {
            vm.allBooks = vm.bookService.getListResource().getAll();
            vm.books = vm.allBooks
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    $translatePartialLoader.addPart('books');
    $translate.refresh();
  }
}());
