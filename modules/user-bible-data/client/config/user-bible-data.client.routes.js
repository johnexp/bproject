(function () {
  'use strict';

  angular
    .module('books')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('search.notes', {
        url: '/notes',
        templateUrl: '/modules/user-bible-data/client/views/user-notes-search.client.view.html',
        controller: 'UserNotesSearchController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pesquisar Notas'
        }
      });
  }
}());
