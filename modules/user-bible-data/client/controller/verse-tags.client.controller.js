(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseTagsController', VerseTagsController);

  function VerseTagsController($mdDialog, currentTags, selectedVerses, userTags) {
    var vm = this;
    vm.selectedTags = angular.copy(currentTags) || { tags: [] };
    vm.selectedVerses = selectedVerses;
    vm.selectedItem = null;
    vm.searchText = null;
    vm.querySearch = querySearch;
    vm.hide = hide;
    vm.saveTags = saveTags;

    function hide() {
      $mdDialog.hide();
    }

    function saveTags() {
      currentTags.tags = vm.selectedTags.tags;
      $mdDialog.hide(currentTags);
    }

    function querySearch (query) {
      var results = query ? userTags.filter(createFilterFor(query)) : [];
      return results;
    }

    function createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();
      return function filterFn(tag) {
        return (tag.toLowerCase().indexOf(lowercaseQuery) === 0) || (tag.toLowerCase().indexOf(lowercaseQuery) === 0);
      };
    }
  }
}());
