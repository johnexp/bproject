(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseTagsController', VerseTagsController);

  function VerseTagsController($mdDialog, currentTags) {
    var vm = this;
    vm.selectedTags = currentTags || { tags: [] };
    vm.selectedItem = null;
    vm.searchText = null;
    vm.querySearch = querySearch;
    vm.hide = hide;
    vm.saveTags = saveTags;

    function hide() {
      $mdDialog.hide();
    }

    function saveTags() {
      $mdDialog.hide(vm.selectedTags);
    }

    function querySearch (query) {
      // TODO: Implement server search for tags
      // var results = query ? vm.tags.filter(createFilterFor(query)) : [];
      // return results;
    }
  }
}());
