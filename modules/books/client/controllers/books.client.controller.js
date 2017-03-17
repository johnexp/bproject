(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', 'userMetaResolve', '$mdDialog', '$stateParams', '$state', 'ListBooksService', '$timeout', '$anchorScroll', '$location', 'Toast'];

  function BooksController (Authentication, book, userMeta, $mdDialog, $stateParams, $state, ListBooksService, $timeout, $anchorScroll, $location, Toast) {
    var vm = this;

    vm.authentication = Authentication;
    vm.book = book;
    vm.form = {};
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
    vm.markVerses = markVerses;
    vm.unmarkVerses = unmarkVerses;
    vm.selectAllVerses = selectAllVerses;
    vm.userMeta = userMeta;
    vm.markers = {};
    vm.notes = {};
    vm.setVersesUserMeta = setVersesUserMeta;
    vm.showNoteDialog = showNoteDialog;
    vm.showConfirmRemoveVerseNote = showConfirmRemoveVerseNote;
    vm.noteToRemove = null;

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
      if (!findSelectedVerse(verse)) {
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

    function findSelectedVerse(verseToFind) {
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
      if (findSelectedVerse(verse)) {
        verseClass = 'selected';
      }
      if (vm.markers[verse]) {
        verseClass += ' ' + vm.markers[verse];
      }
      if (vm.notes[verse]) {
        verseClass += ' has-note';
      }
      return verseClass;
    }

    function selectAllVerses() {
      vm.selectedVerses = [];
      for (var i = 1; i <= vm.book.chapters[0].verses.length; i++) {
        vm.selectedVerses.push(i);
      }
    }

    function setVersesUserMeta() {
      setVersesMark();
      setVersesNotes();
    }

    function setVersesMark() {
      var markers = {};
      for (var i = 0; i < vm.userMeta.markers.length; i++) {
        for (var j = 0; j < vm.userMeta.markers[i].verses.length; j++) {
          markers[vm.userMeta.markers[i].verses[j]] = vm.userMeta.markers[i].color;
        }
      }
      vm.markers = markers;
    }

    function setVersesNotes() {
      var notes = {};
      for (var i = 0; i < vm.userMeta.notes.length; i++) {
        for (var j = 0; j < vm.userMeta.notes[i].verses.length; j++) {
          if (!angular.isArray(notes[vm.userMeta.notes[i].verses[j]])) {
            notes[vm.userMeta.notes[i].verses[j]] = [];
          }
          notes[vm.userMeta.notes[i].verses[j]].push(vm.userMeta.notes[i]);
        }
      }
      vm.notes = notes;
    }

    function unmarkVerses() {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        for (var j = 0; j < vm.userMeta.markers.length; j++) {
          var verseIndex = vm.userMeta.markers[j].verses.indexOf(vm.selectedVerses[i]);
          if (verseIndex !== -1) {
            vm.userMeta.markers[j].verses.splice(verseIndex, 1);
          }
        }
      }
      saveUserMeta();
    }

    function markVerses(color) {
      var mustCreate = true;
      for (var i = 0; i < vm.userMeta.markers.length; i++) {
        if (vm.userMeta.markers[i].color === color) {
          addSelectedVersesToMarker(vm.userMeta.markers[i]);
          mustCreate = false;
        } else {
          removeAlreadyMarked(vm.userMeta.markers[i]);
        }
      }
      if (mustCreate) {
        vm.userMeta.markers.push({ color: color, verses: vm.selectedVerses });
      }
      saveUserMeta();
    }

    function addSelectedVersesToMarker(marker) {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        if (marker.verses.indexOf(vm.selectedVerses[i]) === -1) {
          marker.verses.push(vm.selectedVerses[i]);
        }
      }
    }

    function removeAlreadyMarked(marker) {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        var verseIndex = marker.verses.indexOf(vm.selectedVerses[i]);
        if (verseIndex !== -1) {
          marker.verses.splice(verseIndex, 1);
        }
      }
    }

    function showNoteDialog(ev, currentNote) {
      $mdDialog.show({
        controller: 'VerseNoteController as vm',
        templateUrl: '/modules/user-meta/client/view/verse-note.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: { currentNote: currentNote }
      })
        .then(function(versesNote) {
          if (versesNote && versesNote.note) {
            addVersesNote(versesNote);
          }
        });
    }

    function showConfirmRemoveVerseNote(ev, noteToRemove) {
      vm.noteToRemove = noteToRemove;
      var confirm = $mdDialog.confirm()
        .title('Comfirmar Remoção')
        .textContent('Deseja remover a nota do verso?')
        .ariaLabel('Comfirmar Remoção')
        .targetEvent(ev)
        .ok('Sim')
        .cancel('Não');
      $mdDialog.show(confirm).then(function() {
        removeVerseNote(vm.noteToRemove._id);
      }, function () {
        vm.noteToRemove = null;
      });
    }

    function addVersesNote(versesNote) {
      if (!versesNote._id) {
        vm.userMeta.notes.push({ note: versesNote.note, verses: vm.selectedVerses });
      }
      saveUserMeta();
    }

    function removeVerseNote(verseNoteId) {
      for (var i = 0; i < vm.userMeta.notes.length; i++) {
        if (vm.userMeta.notes[i]._id === verseNoteId) {
          vm.userMeta.notes.splice(i, 1);
          vm.noteToRemove = null;
          saveUserMeta();
          return;
        }
      }
    }

    function clearEmptyDocuments() {
      var markersLength = vm.userMeta.markers.length;
      for (var i = markersLength - 1; i >= 0; i--) {
        if (vm.userMeta.markers[i].verses.length === 0) {
          vm.userMeta.markers.splice(i, 1);
        }
      }
    }

    function saveUserMeta() {
      clearEmptyDocuments();
      vm.userMeta.createOrUpdate()
        .then(onSuccess)
        .catch(onError);

      function onSuccess(userMeta) {
        vm.userMeta = userMeta;
        setVersesUserMeta();
      }

      function onError() {
        Toast.genericErrorMessage();
      }
    }
  }

}());
