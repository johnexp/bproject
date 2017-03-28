(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('BooksController', BooksController);

  BooksController.$inject = ['Authentication', 'bookResolve', 'userBibleDataResolve', 'userCustomDataResolve', '$mdDialog',
    '$stateParams', '$state', 'BooksListService', '$timeout', '$anchorScroll', '$location', 'Toast', 'BooksService', 'UserBibleDataService'];

  function BooksController (Authentication, book, userBibleData, userCustomData, $mdDialog, $stateParams, $state, BooksListService,
                            $timeout, $anchorScroll, $location, Toast, BooksService, UserBibleDataService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.book = book;
    vm.chapter = $stateParams.chapter;
    vm.abbrev = $stateParams.abbrev;
    vm.nextChap = nextChap;
    vm.prevChap = prevChap;
    vm.bookList = BooksListService.getBooks();
    vm.chaptersAmmount = BooksListService.getChaptersByAbbrev(vm.abbrev);
    vm.versesAmmount = new Array(vm.book.chapters[0].verses.length);
    vm.selectedBook = { abbrev: vm.abbrev, name: vm.book.book };
    vm.selectedVerses = [];
    vm.toggleBooksList = toggleBooksList;
    vm.toggleChaptersList = toggleChaptersList;
    vm.toggleVersesList = toggleVersesList;
    vm.selectBook = selectBook;
    vm.selectChapter = selectChapter;
    vm.selectVerse = selectVerse;
    vm.highlightVerse = highlightVerse;
    vm.getVerseClass = getVerseClass;
    vm.markVerses = markVerses;
    vm.unmarkVerses = unmarkVerses;
    vm.selectAllVerses = selectAllVerses;
    vm.userBibleData = userBibleData;
    vm.userCustomData = userCustomData;
    vm.setVersesUserMeta = setVersesUserMeta;
    vm.showNoteDialog = showNoteDialog;
    vm.showTagsDialog = showTagsDialog;
    vm.showRefsDialog = showRefsDialog;
    vm.showColorsLegendDialog = showColorsLegendDialog;
    vm.showConfirmRemoveVerseNote = showConfirmRemoveVerseNote;
    vm.showConfirmRemoveVerseTag = showConfirmRemoveVerseTag;
    vm.showConfirmRemoveVerseRef = showConfirmRemoveVerseRef;
    vm.arrayToString = arrayToString;
    vm.showMorePreview = showMorePreview;
    vm.showNotesPreview = showNotesPreview;
    vm.showRefsPreview = showRefsPreview;
    vm.hidePreviewCards = hidePreviewCards;
    vm.verses = getVerses();
    vm.notesPreviewClass = '';
    vm.morePreviewClass = '';
    vm.refsPreviewClass = '';
    vm.onCopySuccess = onCopySuccess;
    vm.verseRefTexts = [];
    vm.getVerseRefText = getVerseRefText;

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
      vm.chaptersAmmount = BooksListService.getChaptersByAbbrev(book.abbrev);
      vm.showChaptersList = true;
      vm.showSelectionClass = 'show-chapters-list';
    }

    function toggleBooksList() {
      vm.showBooksList = !vm.showBooksList;
      vm.showChaptersList = false;
      vm.showVersesList = false;
      vm.isListOpen = vm.showBooksList;
      vm.showSelectionClass = vm.showBooksList ? 'show-books-list' : '';
      if (!vm.showBooksList) {
        resetSelectedBook();
      }
    }

    function toggleChaptersList() {
      vm.showBooksList = false;
      vm.showChaptersList = !vm.showChaptersList;
      vm.showVersesList = false;
      vm.isListOpen = vm.showChaptersList;
      vm.showSelectionClass = vm.showChaptersList ? 'show-chapters-list' : '';
      if (!vm.showChaptersList) {
        resetSelectedBook();
      }
    }

    function toggleVersesList() {
      vm.showBooksList = false;
      vm.showChaptersList = false;
      vm.showVersesList = !vm.showVersesList;
      vm.isListOpen = vm.showVersesList;
      vm.showSelectionClass = vm.showVersesList ? 'show-verses-number-list' : '';
      if (!vm.showVersesList) {
        resetSelectedBook();
      }
    }

    function resetSelectedBook() {
      $timeout(function () {
        vm.selectedBook = { abbrev: vm.abbrev, name: vm.book.book };
        vm.chaptersAmmount = BooksListService.getChaptersByAbbrev(vm.abbrev);
      }, 500);
    }

    function selectChapter(chapter) {
      $state.go('bible.view', {
        abbrev: vm.selectedBook.abbrev,
        chapter: chapter
      });
    }

    function selectVerse(verse) {
      if (vm.selectedVerses.indexOf(verse) === -1) {
        vm.selectedVerses.push(verse);
      } else {
        var index = vm.selectedVerses.indexOf(verse);
        vm.selectedVerses.splice(index, 1);
      }
      setSelectedVersesText();
    }

    function highlightVerse(verse) {
      vm.showSelectionClass = '';
      vm.highlightedVerse = verse;
      vm.showVersesList = false;
      goToVerse(verse);
    }

    function getVerses() {
      var verses = [];
      for (var i = 0; i < vm.book.chapters[0].verses.length; i++) {
        verses.push({ number: i + 1, text: vm.book.chapters[0].verses[i] });
      }
      return verses;
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
      if (vm.selectedVerses.indexOf(verse) > -1) {
        verseClass = 'selected';
      }
      if (vm.markers[verse]) {
        verseClass += ' ' + vm.markers[verse];
      }
      if (vm.notes[verse]) {
        verseClass += ' has-note';
      }
      if (vm.tags[verse]) {
        verseClass += ' has-more';
      }
      return verseClass;
    }

    function selectAllVerses() {
      vm.selectedVerses = [];
      for (var i = 1; i <= vm.book.chapters[0].verses.length; i++) {
        vm.selectedVerses.push(i);
      }
      setSelectedVersesText();
    }

    function setVersesUserMeta() {
      setVersesMark();
      setVersesNotes();
      setVersesTags();
      setVersesRefs();
      setColorsLegend();
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

    function setVersesRefs() {
      var refs = {};
      for (var i = 0; i < vm.userBibleData.refs.length; i++) {
        if (!angular.isArray(refs[vm.userBibleData.refs[i].verse])) {
          refs[vm.userBibleData.refs[i].verse] = [];
        }
        createVerseRefObj(refs, i);
      }
      vm.refs = refs;
    }

    function setColorsLegend() {
      vm.colorsLegend = {};
      for (var i = 0; i < vm.userCustomData.colorsLegend.length; i++) {
        vm.colorsLegend[vm.userCustomData.colorsLegend[i].color] = vm.userCustomData.colorsLegend[i].legend;
      }
      return vm.colorsLegend;
    }

    function createVerseRefObj(refs, i) {
      for (var k = 0; k < vm.userBibleData.refs[i].refs.length; k++) {
        var verseRefArray = vm.userBibleData.refs[i].refs[k].split('-');
        var bookName = BooksListService.getBookByAbbrev(verseRefArray[0]);
        var verseRefText = bookName + ' ' + verseRefArray[1] + ':' + verseRefArray[2];
        refs[vm.userBibleData.refs[i].verse].push({ refText: verseRefText, refUrl: vm.userBibleData.refs[i].refs[k] });
        refs[vm.userBibleData.refs[i].verse].refObj = vm.userBibleData.refs[i];

      }
    }

    function unmarkVerses() {
      var verseFound = false;
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        for (var j = 0; j < vm.userBibleData.markers.length; j++) {
          var verseIndex = vm.userBibleData.markers[j].verses.indexOf(vm.selectedVerses[i]);
          if (verseIndex !== -1) {
            vm.userBibleData.markers[j].verses.splice(verseIndex, 1);
            verseFound = true;
          }
        }
      }
      if (verseFound) {
        saveUserBibleData();
      }
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
        templateUrl: '/modules/user-bible-data/client/views/verse-note.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: { currentNote: currentNote, selectedVerses: arrayToString(vm.selectedVerses) }
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
        templateUrl: '/modules/user-bible-data/client/views/verse-tags.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          currentTags: currentTags,
          selectedVerses: arrayToString(vm.selectedVerses),
          userTags: vm.userCustomData.tags
        }
      })
        .then(function(versesTags) {
          if (versesTags && versesTags.tags) {
            addVersesTags(versesTags);
          }
        });
    }

    function showRefsDialog(ev, currentRefs) {
      $mdDialog.show({
        controller: 'VerseRefsController as vm',
        templateUrl: '/modules/user-bible-data/client/views/verse-refs.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          currentRefs: currentRefs,
          selectedVerses: arrayToString(vm.selectedVerses)
        }
      })
        .then(function(versesRefs) {
          if (versesRefs && versesRefs.refs) {
            addVersesRefs(versesRefs);
          }
        });
    }

    function showColorsLegendDialog(ev) {
      $mdDialog.show({
        controller: 'ColorsLegendController as vm',
        templateUrl: '/modules/user-custom-data/client/views/colors-legend.client.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          userCustomData: vm.userCustomData
        }
      })
        .then(function(userCustomData) {
          if (userCustomData) {
            vm.userCustomData = userCustomData;
            saveUserCustomData();
          }
        });
    }

    function addVersesRefs(versesRefs) {
      if (!versesRefs._id) {
        checkForActualChapterRefs(versesRefs);
        for (var i = 0; i < vm.selectedVerses.length; i++) {
          var addedVerse = getAddedRefByVerse(vm.selectedVerses[i]);
          if (addedVerse) {
            addRefsInVerse(addedVerse, versesRefs.refs);
          } else {
            vm.userBibleData.refs.push({ refs: versesRefs.refs, verse: vm.selectedVerses[i] });
          }
        }
      }
      saveUserBibleData();
    }

    function checkForActualChapterRefs(versesRefs) {
      for (var i = 0; i < versesRefs.refs.length; i++) {
        var verseSplited = versesRefs.refs[i].replace('*', '').split('-');
        if (verseSplited[0] === $stateParams.abbrev && verseSplited[1] === $stateParams.chapter) {
          versesRefs.refs[i] = versesRefs.refs[i].replace('*', '');
          createActualChapterRefs(verseSplited);
        }
      }
    }

    function createActualChapterRefs(verseSplited) {
      var refsToAdd = [];
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        refsToAdd.push(verseSplited[0] + '-' + verseSplited[1] + '-' + vm.selectedVerses[i]);
      }

      var addedVerse = getAddedRefByVerse(verseSplited[2]);
      if (addedVerse) {
        addRefsInVerse(addedVerse, refsToAdd);
      } else {
        vm.userBibleData.refs.push({ refs: refsToAdd, verse: verseSplited[2] });
      }
    }

    function getAddedRefByVerse(selectedVerse) {
      for (var i = 0; i < vm.userBibleData.refs.length; i++) {
        if (vm.userBibleData.refs[i].verse === selectedVerse) {
          return vm.userBibleData.refs[i];
        }
      }
      return null;
    }

    function addRefsInVerse(addedVerse, refs) {
      for (var i = 0; i < refs.length; i++) {
        if (addedVerse.refs.indexOf(refs[i]) === -1) {
          addedVerse.refs.push(refs[i]);
        }
      }
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

    function showConfirmRemoveVerseTag(ev, tagsToRemove) {
      vm.tagsToRemove = tagsToRemove;
      var confirm = $mdDialog.confirm()
        .title('Comfirmar Remoção')
        .textContent('Deseja remover a(s) tag(s) do verso?')
        .ariaLabel('Comfirmar Remoção')
        .targetEvent(ev)
        .ok('Sim')
        .cancel('Não');
      $mdDialog.show(confirm).then(function() {
        removeVerseTags(vm.tagsToRemove._id);
      }, function () {
        vm.tagsToRemove = null;
      });
    }

    function showConfirmRemoveVerseRef(ev, refsId, refUrl, verse) {
      var confirm = $mdDialog.confirm()
        .title('Comfirmar Remoção')
        .textContent('Deseja remover a referência do verso?')
        .ariaLabel('Comfirmar Remoção')
        .targetEvent(ev)
        .ok('Sim')
        .cancel('Não');
      $mdDialog.show(confirm).then(function() {
        removeVerseRef(refsId, refUrl, verse);
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

    function removeVerseTags(tagsNoteId) {
      for (var i = 0; i < vm.userBibleData.tags.length; i++) {
        if (vm.userBibleData.tags[i]._id === tagsNoteId) {
          vm.userBibleData.tags.splice(i, 1);
          vm.tagsToRemove = null;
          saveUserBibleData();
          return;
        }
      }
    }

    function removeVerseRef(refsId, refUrl, verse) {
      for (var i = 0; i < vm.userBibleData.refs.length; i++) {
        if (vm.userBibleData.refs[i]._id === refsId) {
          var refIndex = vm.userBibleData.refs[i].refs.indexOf(refUrl);
          if (refIndex > -1) {
            vm.userBibleData.refs[i].refs.splice(refIndex, 1);
          }
          saveUserBibleData();
          findReferredVerseToRemove(refUrl, verse);
          return;
        }
      }
    }

    function findReferredVerseToRemove(refUrl, verse) {
      var refSplited = refUrl.split('-');
      if (refSplited[0] === $stateParams.abbrev && refSplited[1] === $stateParams.chapter) {
        removeReferredVerse(vm.userBibleData, verse);
      } else {
        UserBibleDataService.get({
          book: refSplited[0],
          chapter: refSplited[1]
        }).$promise
          .then(function (result) {
            removeReferredVerse(result, verse);
            result.createOrUpdate();
          });
      }
    }

    function removeReferredVerse(userBibleData, verse) {
      var refToFind = $stateParams.abbrev + '-' + $stateParams.chapter + '-' + verse;
      for (var i = 0; i < userBibleData.refs.length; i++) {
        var refIndex = userBibleData.refs[i].refs.indexOf(refToFind);
        if (refIndex > -1) {
          userBibleData.refs[i].refs.splice(refIndex, 1);
        }
      }
      clearReferredData();

      function clearReferredData() {
        var refsLength = userBibleData.refs.length;
        for (var j = refsLength - 1; j >= 0; j--) {
          if (userBibleData.refs[j].refs.length === 0) {
            userBibleData.refs.splice(j, 1);
          }
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
      var refsLength = vm.userBibleData.refs.length;
      for (var j = refsLength - 1; j >= 0; j--) {
        if (vm.userBibleData.refs[j].refs.length === 0) {
          vm.userBibleData.refs.splice(j, 1);
        }
      }
    }

    function sortArray(array) {
      array.sort(function (a, b) {
        return a - b;
      });
    }

    function arrayToString(array) {
      sortArray(array);
      return array.join(', ');
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
      vm.userCustomData.createOrUpdate()
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

    function showMorePreview(event, versePreviewShowing) {
      vm.morePreviewClass = 'show';
      setSideCardPreviewPosition(event);
      vm.versePreviewShowing = versePreviewShowing;
    }

    function showNotesPreview(event, versePreviewShowing) {
      vm.notesPreviewClass = 'show';
      setSideCardPreviewPosition(event);
      vm.versePreviewShowing = versePreviewShowing;
    }

    function showRefsPreview(event, versePreviewShowing) {
      vm.refsPreviewClass = 'show';
      setBottomCardPreviewPosition(event);
      vm.versePreviewShowing = versePreviewShowing;
    }

    function setSideCardPreviewPosition(event) {
      if (event.srcElement.localName === 'md-icon' && event.relatedTarget.nextElementSibling) {
        vm.previewCardTop = event.relatedTarget.nextElementSibling.offsetTop;
      } else {
        vm.previewCardTop = event.srcElement.offsetParent.offsetTop;
      }
    }

    function setBottomCardPreviewPosition(event) {
      vm.previewCardTop = event.srcElement.offsetTop + 7 + event.srcElement.offsetParent.offsetTop;
      var offsetLeft = event.srcElement.offsetLeft + event.srcElement.offsetWidth - 350;
      vm.previewCardLeft = offsetLeft < 0 ? 0 : offsetLeft;
    }

    function hidePreviewCards() {
      vm.morePreviewClass = '';
      vm.notesPreviewClass = '';
      vm.refsPreviewClass = '';
    }

    function setSelectedVersesText() {
      vm.selectedVersesText = vm.book.book + ' - Capítulo ' + vm.chapter + '\n';
      sortArray(vm.selectedVerses);
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        vm.selectedVersesText += vm.selectedVerses[i] + ' - ' + vm.verses[vm.selectedVerses[i] - 1].text + '\n';
      }
    }

    function onCopySuccess() {
      Toast.success('Versos copiados!');
    }

    function getVerseRefText(refUrl) {
      vm.refsPreviewZIndex = 99999;
      if (!vm.verseRefTexts[refUrl]) {
        var chapterInfo = refUrl.split('-');
        BooksService.get({
          version: $stateParams.version,
          abbrev: chapterInfo[0],
          chapter: chapterInfo[1]
        }).$promise.then(function (result) {
          for (var i = 0; i < result.chapters[0].verses.length; i++) {
            vm.verseRefTexts[chapterInfo[0] + '-' + chapterInfo[1] + '-' + (i + 1)] = result.chapters[0].verses[i];
          }
          // Setting timeout to prevent ref preview disappear when blockUI is hiding
          $timeout(function () {
            vm.refsPreviewZIndex = 70;
          }, 500);
        });
      }
    }

  }

}());
