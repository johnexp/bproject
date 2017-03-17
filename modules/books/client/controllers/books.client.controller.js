(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', 'userBibleDataResolve', 'userCustomDataResolve', '$mdDialog', '$stateParams', '$state', 'ListBooksService', '$timeout', '$anchorScroll', '$location', 'Toast'];

  function BooksController (Authentication, book, userBibleData, userCustomData, $mdDialog, $stateParams, $state, ListBooksService, $timeout, $anchorScroll, $location, Toast) {
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
    vm.userBibleData = userBibleData;
    vm.userCustomData = userCustomData;
    vm.markers = {};
    vm.notes = {};
    vm.tags = {};
    vm.setVersesUserMeta = setVersesUserMeta;
    vm.showNoteDialog = showNoteDialog;
    vm.showTagsDialog = showTagsDialog;
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
      setVersesTags();
    }

    function setVersesMark() {
      var markers = {};
      for (var i = 0; i < vm.userBibleData.markers.length; i++) {
        for (var j = 0; j < vm.userBibleData.markers[i].verses.length; j++) {
          markers[vm.userBibleData.markers[i].verses[j]] = vm.userBibleData.markers[i].color;
        }
      }
      vm.markers = markers;
    }

    function setVersesNotes() {
      var notes = {};
      for (var i = 0; i < vm.userBibleData.notes.length; i++) {
        for (var j = 0; j < vm.userBibleData.notes[i].verses.length; j++) {
          if (!angular.isArray(notes[vm.userBibleData.notes[i].verses[j]])) {
            notes[vm.userBibleData.notes[i].verses[j]] = [];
          }
          notes[vm.userBibleData.notes[i].verses[j]].push(vm.userBibleData.notes[i]);
        }
      }
      vm.notes = notes;
    }

    function setVersesTags() {
      var tags = {};
      for (var i = 0; i < vm.userBibleData.tags.length; i++) {
        for (var j = 0; j < vm.userBibleData.tags[i].verses.length; j++) {
          if (!angular.isArray(tags[vm.userBibleData.tags[i].verses[j]])) {
            tags[vm.userBibleData.tags[i].verses[j]] = [];
          }
          tags[vm.userBibleData.tags[i].verses[j]].push(vm.userBibleData.tags[i]);
        }
      }
      vm.tags = tags;
    }

    function unmarkVerses() {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        for (var j = 0; j < vm.userBibleData.markers.length; j++) {
          var verseIndex = vm.userBibleData.markers[j].verses.indexOf(vm.selectedVerses[i]);
          if (verseIndex !== -1) {
            vm.userBibleData.markers[j].verses.splice(verseIndex, 1);
          }
        }
      }
      saveUserBibleData();
    }

    function markVerses(color) {
      var mustCreate = true;
      for (var i = 0; i < vm.userBibleData.markers.length; i++) {
        if (vm.userBibleData.markers[i].color === color) {
          addSelectedVersesToMarker(vm.userBibleData.markers[i]);
          mustCreate = false;
        } else {
          removeAlreadyMarked(vm.userBibleData.markers[i]);
        }
      }
      if (mustCreate) {
        vm.userBibleData.markers.push({ color: color, verses: vm.selectedVerses });
      }
      saveUserBibleData();
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
        templateUrl: '/modules/user-bible-data/client/view/verse-note.client.tmpl.html',
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

    function showTagsDialog(ev, currentTags) {
      $mdDialog.show({
        controller: 'VerseTagsController as vm',
        templateUrl: '/modules/user-bible-data/client/view/verse-tags.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: { currentTags: currentTags }
      })
        .then(function(versesTags) {
          if (versesTags && versesTags.tags) {
            addVersesTags(versesTags);
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

    function addVersesTags(versesTags) {
      if (!versesTags._id) {
        vm.userBibleData.tags.push({ tags: versesTags.tags, verses: vm.selectedVerses });
      }
      saveUserTags(versesTags);
      saveUserBibleData();
    }

    function saveUserTags(versesTags) {
      for (var i = 0; i < versesTags.tags.length; i++) {
        if (vm.userCustomData.tags.indexOf(versesTags.tags[i]) === -1) {
          vm.userCustomData.tags.push(versesTags.tags[i]);
        }
      }
      saveUserCustomData();
    }

    function addVersesNote(versesNote) {
      if (!versesNote._id) {
        vm.userBibleData.notes.push({ note: versesNote.note, verses: vm.selectedVerses });
      }
      saveUserBibleData();
    }

    function removeVerseNote(verseNoteId) {
      for (var i = 0; i < vm.userBibleData.notes.length; i++) {
        if (vm.userBibleData.notes[i]._id === verseNoteId) {
          vm.userBibleData.notes.splice(i, 1);
          vm.noteToRemove = null;
          saveUserBibleData();
          return;
        }
      }
    }

    function clearEmptyDocuments() {
      var markersLength = vm.userBibleData.markers.length;
      for (var i = markersLength - 1; i >= 0; i--) {
        if (vm.userBibleData.markers[i].verses.length === 0) {
          vm.userBibleData.markers.splice(i, 1);
        }
      }
    }

    function saveUserBibleData() {
      clearEmptyDocuments();
      vm.userBibleData.createOrUpdate()
        .then(onSuccess)
        .catch(onError);

      function onSuccess(userBibleData) {
        vm.userBibleData = userBibleData;
        setVersesUserMeta();
      }

      function onError() {
        Toast.genericErrorMessage();
      }
    }

    function saveUserCustomData() {
      clearEmptyDocuments();
      userCustomData.createOrUpdate()
        .then(onSuccess)
        .catch(onError);

      function onSuccess(userCustomData) {
        vm.userCustomData = userCustomData;
        setVersesUserMeta();
      }

      function onError() {
        Toast.genericErrorMessage();
      }
    }
  }

}());
