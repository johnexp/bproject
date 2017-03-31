(function () {
  'use strict';

  angular
    .module('books')
    .controller('UserMarkersSearchController', UserMarkersSearchController);

  UserMarkersSearchController.$inject = ['Authentication', 'UserMarkersSearchService', 'userCustomDataResolve', 'Toast', 'DiacriticsUtilService',
    'BooksListService', 'BooksService', '$scope', 'BooksUtilService'];

  function UserMarkersSearchController(Authentication, UserMarkersSearchService, userCustomData, Toast, DiacriticsUtilService,
                                    BooksListService, BooksService, $scope, BooksUtilService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.books = BooksListService.getBooks();
    vm.abbrevBooks = BooksListService.getAbbrevBooks();
    vm.search = search;
    vm.booksQuerySearch = booksQuerySearch;
    vm.searchForm = {};
    vm.markers = getMarkers();
    vm.clearSearchTerm = clearSearchTerm;
    vm.getVerseRefText = getVerseRefText;
    vm.verseRefTexts = [];

    function clearSearchTerm() {
      vm.searchTerm = '';
    }

    function search(isValid) {
      if (filterIsValid(isValid)) {
        UserMarkersSearchService.get({
          book: vm.searchForm.book ? vm.searchForm.book.abbrev : null
        }, {
          markers: vm.searchForm.markers
        }).$promise
          .then(function (result) {
            for (var i = 0; i < result.length; i++) {
              result[i]._id = result[i]._id;
              for (var j = 0; j < result[i].books.length; j++) {
                result[i].books[j].chapters = sortChapters(result[i].books[j].chapters);
                for (var k = 0; k < result[i].books[j].chapters.length; k++) {
                  var versesArray = sortVerses(result[i].books[j].chapters[k].verses);
                  result[i].books[j].chapters[k].verses = versesArray.join(', ');
                  result[i].books[j].chapters[k].versesArray = versesArray;
                }
              }
            }
            vm.result = result;
          });
      }
    }

    function filterIsValid(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.searchForm');
        Toast.error('Campos não preenchidos corretamente');
        return false;
      }
      if ((!vm.searchForm.markers || vm.searchForm.markers.length === 0) && !vm.searchForm.book) {
        Toast.error('É necessário informar pelo menos um filtro.');
        return false;
      }
      return true;
    }

    function sortChapters(chapters) {
      return chapters.sort(function (a, b) {
        return a.chapter - b.chapter;
      });
    }

    function sortVerses(verses) {
      return verses.sort(function (a, b) {
        return a - b;
      });
    }

    function booksQuerySearch(query) {
      var books = vm.books.at.concat(vm.books.nt);
      var results = query ? books.filter(createFilterFor(query, 'name')) : books;
      return results;
    }

    function createFilterFor(query, property) {
      var lowercaseQuery = DiacriticsUtilService.removeDiacritics(query.toLowerCase());
      return function filterFn(book) {
        return DiacriticsUtilService.removeDiacritics(book[property].toString().toLowerCase()).indexOf(lowercaseQuery) > -1;
      };
    }

    function getVerseRefText(book, chapter) {
      var refUrl = book + '-' + chapter;
      if (!vm.verseRefTexts[refUrl]) {
        BooksService.get({
          version: 'aa',
          abbrev: book,
          chapter: chapter
        }).$promise.then(function (result) {
          for (var i = 0; i < result.chapters[0].verses.length; i++) {
            if (!vm.verseRefTexts[book + '-' + chapter]) {
              vm.verseRefTexts[book + '-' + chapter] = [];
            }
            vm.verseRefTexts[book + '-' + chapter][i + 1] = result.chapters[0].verses[i];
          }
        });
      }
    }

    function getMarkers() {
      vm.legends = BooksUtilService.getLegends();
      for (var i = 0; i < userCustomData.colorsLegend.length; i++) {
        vm.legends[userCustomData.colorsLegend[i].color].legend = userCustomData.colorsLegend[i].legend;
      }
      var markers = Object.keys(vm.legends).map(function(k) {
        return vm.legends[k];
      });
      return markers;
    }

    angular.element(document.getElementsByClassName('select-header-searchbox')).on('keydown', function(ev) {
      ev.stopPropagation();
    });
  }
}());
