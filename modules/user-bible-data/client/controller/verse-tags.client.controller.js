(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseTagsController', VerseTagsController);

  function VerseTagsController($mdDialog, currentTags, selectedVerses, userTags, Toast) {
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
      if (!vm.selectedTags.tags || vm.selectedTags.tags.length === 0) {
        Toast.warning('É necessário adicionar pelo menos uma tag.');
        return;
      }
      if (currentTags) {
        currentTags.tags = vm.selectedTags.tags;
      } else {
        currentTags = vm.selectedTags;
      }
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
