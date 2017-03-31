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
      })
      .state('search.tags', {
        url: '/tags',
        templateUrl: '/modules/user-bible-data/client/views/user-tags-search.client.view.html',
        controller: 'UserTagsSearchController',
        controllerAs: 'vm',
        resolve: {
          userCustomDataResolve: getUserCustomData
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pesquisar Tags'
        }
      })
      .state('search.markers', {
        url: '/markers',
        templateUrl: '/modules/user-bible-data/client/views/user-markers-search.client.view.html',
        controller: 'UserMarkersSearchController',
        controllerAs: 'vm',
        resolve: {
          userCustomDataResolve: getUserCustomData
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pesquisar Marcadores'
        }
      });

    getUserCustomData.$inject = ['UserCustomDataService'];

    function getUserCustomData(UserCustomDataService) {
      return UserCustomDataService.get().$promise;
    }
  }
}());
