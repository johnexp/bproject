(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', '$translatePartialLoader', '$translate', '$mdMedia', '$stateParams', '$state', 'ListBooksService', '$timeout'];

  function BooksController (Authentication, book, $translatePartialLoader, $translate, $mdMedia, $stateParams, $state, ListBooksService, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.book = book;
    vm.form = {};
    vm.$mdMedia = $mdMedia;
    vm.chapter = $stateParams.chapter;
    vm.abbrev = $stateParams.abbrev;
    vm.nextChap = nextChap;
    vm.prevChap = prevChap;
    vm.bookList = ListBooksService.getBooks();
    vm.bookSearchTerm;
    vm.clearSearchTerm = clearSearchTerm;
    vm.changeBook = changeBook;
    vm.toggleBooksList = toggleBooksList;
    vm.showBooksList = false;

    $translatePartialLoader.addPart('books');
    $translate.refresh();

    function nextChap() {
      var nextChapNumber = parseInt($stateParams.chapter, 0) + 1;
      if (nextChapNumber <= vm.book.numberOfChapters) {
        $state.go('bible.view', {
          chapter: nextChapNumber
        });
      }
    }

    function prevChap() {
      var prevChapNumber = parseInt($stateParams.chapter, 0) - 1;
      if (prevChapNumber > 0) {
        $state.go('bible.view', {
          chapter: prevChapNumber
        });
      }
    }

    function changeBook(abbrev) {
      toggleBooksList();
      // $timeout(function () {
        $state.go('bible.view', {
          abbrev: abbrev,
          chapter: 1
        });
      // }, 500);
    }

    function clearSearchTerm() {
      vm.bookSearchTerm = '';
    }

    function toggleBooksList() {
      vm.showBooksList = !vm.showBooksList;
    }

    angular.element(document.getElementsByClassName('select-header-searchbox')).on('keydown', function(ev) {
      ev.stopPropagation();
    });

  }
}());
