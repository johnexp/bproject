(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', '$translatePartialLoader', '$translate', '$mdMedia', '$stateParams', '$state'];

  function BooksController (Authentication, book, $translatePartialLoader, $translate, $mdMedia, $stateParams, $state) {
    var vm = this;

    vm.authentication = Authentication;
    vm.book = book;
    vm.form = {};
    vm.$mdMedia = $mdMedia;
    vm.chapter = $stateParams.chapter;
    vm.abbrev = $stateParams.abbrev;
    vm.nextChap = nextChap;
    vm.prevChap = prevChap;

    $translatePartialLoader.addPart('books');
    $translate.refresh();

    function nextChap() {
      var nextChapNumber = parseInt($stateParams.chapter, 0) + 1;
      if (nextChapNumber <= vm.book.numberOfChapters) {
        $state.go('books.view', {
          abbrev: $stateParams.abbrev,
          chapter: nextChapNumber
        });
      }
    }

    function prevChap() {
      var prevChapNumber = parseInt($stateParams.chapter, 0) - 1;
      if (prevChapNumber > 0) {
        $state.go('books.view', {
          abbrev: $stateParams.abbrev,
          chapter: prevChapNumber
        });
      }
    }

  }
}());
