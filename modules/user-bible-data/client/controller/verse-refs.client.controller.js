(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseRefsController', VerseRefsController);

  function VerseRefsController($mdDialog, Toast, currentRefs, selectedVerses, BooksListService, BooksService, $stateParams, DiacriticsUtilService, $scope) {
    var vm = this;
    vm.versesRefs = angular.copy(currentRefs) || { refs: [] };
    vm.books = BooksListService.getBooks();
    vm.chapters = [];
    vm.verses = [];
    vm.selectedVerses = selectedVerses;
    vm.addRef = addRef;
    vm.saveRefs = saveRefs;
    vm.hide = hide;
    vm.getBookChapters = getBookChapters;
    vm.getChapterVerses = getChapterVerses;
    vm.booksQuerySearch = booksQuerySearch;
    vm.chaptersQuerySearch = chaptersQuerySearch;
    vm.versesQuerySearch = versesQuerySearch;
    vm.checkSelectedChapter = checkSelectedChapter;
    vm.checkSelectedVerse = checkSelectedVerse;
    vm.clearFields = clearFields;
    vm.getRefHumanized = getRefHumanized;

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
        vm.verseRef.$setPristine();
        vm.verseRef.$setUntouched();
        vm.actualChapter = item.number;
        BooksService.get({
          version: $stateParams.version,
          abbrev: vm.form.selectedBook.abbrev,
          chapter: item.number
        }).$promise.then(function (result) {
          for (var i = 0; i < result.chapters[0].verses.length; i++) {
            vm.verses.push({ number: (i + 1).toString(), text: result.chapters[0].verses[i], resume: i + 1 + ' - ' + result.chapters[0].verses[i] });
          }
        });
      }
    }

    function addRef(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.verseRef');
        Toast.error('Campos não preenchidos corretamente!');
        return false;
      }
      var ref = vm.form.selectedBook.abbrev + '-' + vm.form.selectedChapter.number + '-' + vm.form.selectedVerse.number;
      for (var i = 0; i < vm.versesRefs.refs.length; i++) {
        if (vm.versesRefs.refs[i] === ref) {
          Toast.error('Erro: Não é possível adicionar referência duplicada.');
          return;
        }
      }
      vm.versesRefs.refs.push(ref);
      vm.form.selectedVerse = null;
      vm.verseRef.$setPristine();
      vm.verseRef.$setUntouched();
    }

    function clearFields() {
      vm.form.selectedVerse = null;
      vm.form.selectedBook = null;
      vm.form.selectedChapter = null;
      vm.chapters = [];
      vm.verses = [];
      vm.verseRef.$setPristine();
      vm.verseRef.$setUntouched();
    }

    function hide() {
      $mdDialog.hide();
    }

    function saveRefs() {
      if (!vm.versesRefs.refs || vm.versesRefs.refs.length === 0) {
        Toast.warning('Sem referências adicionadas. (Clique no botão \' + Adicionar\' e depois em \'Salvar\')');
        return;
      }

      if (currentRefs) {
        currentRefs.refs = vm.versesRefs.refs;
      } else {
        currentRefs = vm.versesRefs;
      }
      $mdDialog.hide(currentRefs);
    }

    function getRefHumanized(ref) {
      var verseSplited = ref.split('-');
      return BooksListService.getBookByAbbrev(verseSplited[0]) + ' ' + verseSplited[1] + ':' + verseSplited[2];
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

    function versesQuerySearch(query) {
      var results = query ? vm.verses.filter(createFilterFor(query, 'resume')) : vm.verses;
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
      if (vm.actualChapter && item && vm.actualChapter === item) {
        return;
      }
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

    function checkSelectedVerse(item) {
      if (item) {
        for (var i = 0; i < vm.verses.length; i++) {
          if (vm.verses[i].number === item) {
            vm.form.selectedVerse = { number: item };
            return;
          }
        }
      }
    }
  }
}());
