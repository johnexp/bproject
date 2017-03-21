(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseRefsController', VerseRefsController);

  function VerseRefsController($mdDialog, Toast, currentRefs, selectedVerses, BooksListService, $element, BooksService, $stateParams, DiacriticsUtilService, $scope) {
    var vm = this;
    vm.versesRefs = angular.copy(currentRefs) || { refs: [] };
    vm.books = BooksListService.getBooks();
    vm.chapters = [];
    vm.verses = [];
    vm.verseRef = { selectedVersesRefs: [], selectedChapter: '', selectedBook: '' };
    vm.selectedVerses = selectedVerses;
    vm.addRef = addRef;
    vm.saveRefs = saveRefs;
    vm.hide = hide;
    vm.getBookChapters = getBookChapters;
    vm.getChapterVerses = getChapterVerses;
    vm.getOrderedVerses = getOrderedVerses;
    vm.refsAdded = getRefsAdded();
    vm.emptyArray = [];
    vm.booksQuerySearch = booksQuerySearch;
    vm.chaptersQuerySearch = chaptersQuerySearch;
    vm.checkSelectedChapter = checkSelectedChapter;

    function getBookChapters(item) {
      if (item) {
        var chaptersAmmount = BooksListService.getChaptersByAbbrev(item.abbrev);
        vm.chapters = [];
        for (var i = 1; i <= chaptersAmmount.length; i++) {
          vm.chapters.push({ number: i.toString() });
        }
      }
    }

    function getChapterVerses(item) {
      if (item) {
        vm.verses = [];
        vm.verseRef.selectedVersesRefs = [];
        vm.verseRef.$setPristine();
        vm.verseRef.$setUntouched();
        BooksService.get({
          version: $stateParams.version,
          abbrev: vm.form.selectedBook.abbrev,
          chapter: item.number
        }).$promise.then(function (result) {
          for (var i = 0; i < result.chapters[0].verses.length; i++) {
            vm.verses.push({ number: i + 1, text: result.chapters[0].verses[i] });
          }
        });
      }
    }

    function addRef(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.verseRef Gn 1:1,2,3,4,5');
        Toast.error('Campos não preenchidos corretamente!');
        return false;
      }
      for (var i = 0; i < vm.verseRef.selectedVersesRefs.length; i++) {
        vm.versesRefs.refs.push(vm.form.selectedBook.abbrev + '-' + vm.form.selectedChapter.number + '-' + vm.verseRef.selectedVersesRefs[i].number);
      }
      getRefsAdded();
      vm.verseRef.selectedVersesRefs = [];
      vm.form.selectedBook = null;
      vm.form.selectedChapter = null;
      vm.verseRef.$setPristine();
      vm.verseRef.$setUntouched();
    }

    function hide() {
      $mdDialog.hide();
    }

    function saveRefs() {
      if (!vm.versesRefs.refs || vm.versesRefs.refs.length === 0) {
        Toast.warning('É necessário adicionar pelo menos uma referência.');
        return;
      }

      if (currentRefs) {
        currentRefs.refs = vm.versesRefs.refs;
      } else {
        currentRefs = vm.versesRefs;
      }
      $mdDialog.hide(currentRefs);
    }

    function getOrderedVerses() {
      if (angular.isArray(vm.verseRef.selectedVersesRefs)) {
        vm.verseRef.selectedVersesRefs.sort(function (a, b) {
          return a.number - b.number;
        });
        return vm.verseRef.selectedVersesRefs;
      }
    }

    function getRefsAdded() {
      var refsAdded = [];
      for (var i = 0; i < vm.versesRefs.refs.length; i++) {
        var verseSplited = vm.versesRefs.refs[i].split('-');
        refsAdded.push(BooksListService.getBookByAbbrev(verseSplited[0]) + ' ' + verseSplited[1] + ':' + verseSplited[2]);
      }
      vm.refsAdded = refsAdded;
      return vm.refsAdded;
    }

    function booksQuerySearch(query) {
      var books = vm.books.at.concat(vm.books.nt);
      var results = query ? books.filter(createFilterFor(query, 'name')) : books;
      return results;
    }

    function chaptersQuerySearch(query) {
      var results = query ? vm.chapters.filter(createFilterFor(query, 'number')) : vm.chapters;
      return results;
    }

    function createFilterFor(query, property) {
      var lowercaseQuery = DiacriticsUtilService.removeDiacritics(query.toLowerCase());
      return function filterFn(book) {
        return DiacriticsUtilService.removeDiacritics(book[property].toString().toLowerCase()).indexOf(lowercaseQuery) > -1;
      };
    }

    function checkSelectedChapter(item) {
      var found = false;
      if (item) {
        for (var i = 0; i < vm.chapters.length; i++) {
          if (vm.chapters[i].number === item) {
            found = true;
            vm.form.selectedChapter = { number: item };
            return;
          }
        }
      }
      if (!found) {
        vm.verses = [];
      }
    }

    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });
  }
}());
