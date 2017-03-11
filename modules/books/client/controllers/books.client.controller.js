(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', '$translatePartialLoader', '$translate', '$mdMedia', '$stateParams', '$state', 'ListBooksService', '$timeout', '$anchorScroll', '$location'];

  function BooksController (Authentication, book, $translatePartialLoader, $translate, $mdMedia, $stateParams, $state, ListBooksService, $timeout, $anchorScroll, $location) {
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
    vm.chaptersAmmount = ListBooksService.getChaptersByAbbrev(vm.abbrev);
    vm.versesAmmount = new Array(vm.book.chapters[0].verses.length);
    vm.bookSearchTerm = '';
    vm.selectedBook = { abbrev: vm.abbrev, name: vm.book.book };
    vm.selectedVerses = [];
    vm.highlightedVerse = null;
    vm.toggleBooksList = toggleBooksList;
    vm.toggleChaptersList = toggleChaptersList;
    vm.toggleVersesList = toggleVersesList;
    vm.selectBook = selectBook;
    vm.selectChapter = selectChapter;
    vm.selectVerse = selectVerse;
    vm.showBooksList = false;
    vm.showChaptersList = false;
    vm.showVersesList = false;
    vm.isListOpen = isListOpen;
    vm.highlightVerse = highlightVerse;
    vm.getVerseClass = getVerseClass;
    vm.markers = {};

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

    function selectBook(book) {
      vm.selectedBook = book;
      vm.chaptersAmmount = ListBooksService.getChaptersByAbbrev(book.abbrev);
      vm.showChaptersList = true;
      vm.showSelectionClass = 'show-chapters-list';
    }

    function toggleBooksList() {
      vm.showBooksList = !vm.showBooksList;
      vm.showChaptersList = false;
      vm.showVersesList = false;
      vm.showSelectionClass = vm.showBooksList ? 'show-books-list' : '';
      if (!vm.showBooksList) {
        resetSelectedBook();
      }
    }

    function toggleChaptersList() {
      vm.showBooksList = false;
      vm.showChaptersList = !vm.showChaptersList;
      vm.showVersesList = false;
      vm.showSelectionClass = vm.showChaptersList ? 'show-chapters-list' : '';
      if (!vm.showChaptersList) {
        resetSelectedBook();
      }
    }

    function toggleVersesList() {
      vm.showBooksList = false;
      vm.showChaptersList = false;
      vm.showVersesList = !vm.showVersesList;
      vm.showSelectionClass = vm.showVersesList ? 'show-verses-number-list' : '';
      if (!vm.showVersesList) {
        resetSelectedBook();
      }
    }

    function resetSelectedBook() {
      $timeout(function () {
        vm.selectedBook = { abbrev: vm.abbrev, name: vm.book.book };
        vm.chaptersAmmount = ListBooksService.getChaptersByAbbrev(vm.abbrev);
      }, 500);
    }

    function selectChapter(chapter) {
      $state.go('bible.view', {
        abbrev: vm.selectedBook.abbrev,
        chapter: chapter
      });
    }

    function selectVerse(verse) {
      if (!findVerse(verse)) {
        vm.selectedVerses.push(verse);
      } else {
        var index = findVerseIndex(verse);
        vm.selectedVerses.splice(index, 1);
      }
    }

    function highlightVerse(verse) {
      vm.showSelectionClass = '';
      vm.highlightedVerse = verse;
      vm.showVersesList = false;
      goToVerse(verse);
    }

    function findVerse(verseToFind) {
      return vm.selectedVerses.find(function (verse) {
        return verse === verseToFind;
      });
    }

    function findVerseIndex(verseToFind) {
      return vm.selectedVerses.findIndex(function (verse) {
        return verse === verseToFind;
      });
    }

    function isListOpen() {
      return vm.showBooksList || vm.showChaptersList;
    }

    function goToVerse(verse) {
      var newHash = 'verse-' + verse;
      if ($location.hash() !== newHash) {
        $location.hash('verse-' + verse);
      } else {
        $anchorScroll();
      }
    }

    function getVerseClass(verse) {
      var verseClass = '';
      if (vm.highlightedVerse === verse) {
        verseClass = 'highlighted';
      }
      if (findVerse(verse)) {
        verseClass = 'selected';
      }
      return verseClass;
    }

    function setVersesMark() {
      var markers = {};
      [].markers.forEach(function (marker) {
        marker.verses.forEach(function (verse) {
          markers[verse] = marker.color;
        });
      });
      vm.markers = markers;
    }

    function markVerse(verse, color) {
      [].markers.forEach(function (marker) {
        if (marker.color === color) {
          if (marker.verses.indexOf(verse) === -1) {
            marker.verses.push(verse);
          }
        }
      });
    }

  }
}());
