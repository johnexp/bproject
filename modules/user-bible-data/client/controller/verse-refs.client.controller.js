(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseRefsController', VerseRefsController);

  function VerseRefsController($mdDialog, Toast, currentRefs, selectedVerses, BooksListService, $element, BooksService, $stateParams) {
    var vm = this;
    vm.versesRefs = angular.copy(currentRefs);
    vm.books = BooksListService.getBooks();
    vm.chapters = [];
    vm.verses = [];
    vm.selectedVersesRefs = [];
    vm.selectedVerses = selectedVerses;
    vm.saveRefs = saveRefs;
    vm.hide = hide;
    vm.searchTerm;
    vm.clearSearchTerm = clearSearchTerm;
    vm.getBookChapters = getBookChapters;
    vm.getChapterVerses = getChapterVerses;

    function clearSearchTerm() {
      vm.searchTerm = '';
    }

    function getBookChapters() {
      var chaptersAmmount = BooksListService.getChaptersByAbbrev(vm.selectedBook);
      vm.chapters = [];
      for (var i = 1; i <= chaptersAmmount.length; i++) {
        vm.chapters.push({ number: i });
      }
    }

    function getChapterVerses() {
      BooksService.get({
        version: $stateParams.version,
        abbrev: vm.selectedBook,
        chapter: vm.selectedChapter
      }).$promise.then(function (result) {
        for (var i = 0; i < result.chapters[0].verses.length; i++) {
          vm.verses.push({ number: i + 1, text: result.chapters[0].verses[i] });
        }
      });
    }

    function hide() {
      $mdDialog.hide();
    }

    function saveRefs() {
      if (!vm.versesRefs.note || vm.versesRefs.note.length < 2) {
        Toast.warning('O campo nota deve ter no mínimo 2 caracteres');
        return;
      }

      if (currentRefs) {
        currentRefs.refs = vm.versesRefs.refs;
      } else {
        currentRefs = vm.versesRefs;
      }
      $mdDialog.hide(currentRefs);
    }

    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });
  }
}());
