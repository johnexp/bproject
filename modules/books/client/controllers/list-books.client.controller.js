(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksListController', BooksListController);

  BooksListController.$inject = ['UserMetaService', '$stateParams', 'userMetaResolve'];

  function BooksListController(UserMetaService, $stateParams, userMeta) {
    var vm = this;

    vm.userMeta = userMeta;
    console.log(vm.userMeta);
  }
}());
