(function () {
  'use strict';

  angular
    .module('books')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bible', {
        abstract: true,
        parent: 'home',
        url: 'bible',
        template: '<ui-view/>'
      })
      .state('search', {
        abstract: true,
        parent: 'home',
        url: 'search',
        template: '<ui-view/>'
      })
      .state('search.bible', {
        url: '/bible',
        templateUrl: '/modules/books/client/views/books-search.client.view.html',
        controller: 'BooksSearchController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pesquisar na Bíblia'
        }
      })
      .state('bible.view', {
        url: '/:version/:abbrev/:chapter',
        templateUrl: '/modules/books/client/views/view-book.client.view.html',
        controller: 'BooksController',
        controllerAs: 'vm',
        resolve: {
          bookResolve: getBook,
          userBibleDataResolve: getUserBibleData,
          userCustomDataResolve: getUserCustomData
        },
        data: {
          roles: ['user', 'admin', 'guest'],
          pageTitle: '{{ bookResolve.book }} - {{ bookResolve.chapters[0].number }}'
        }
      });
  }

  getBook.$inject = ['$stateParams', 'BooksService'];

  function getBook($stateParams, BooksService) {
    $stateParams.abbrev = $stateParams.abbrev || 'gn';
    $stateParams.chapter = $stateParams.chapter || 1;
    return BooksService.get({
      version: $stateParams.version,
      abbrev: $stateParams.abbrev,
      chapter: $stateParams.chapter
    }).$promise;
  }

  getUserBibleData.$inject = ['$stateParams', 'UserBibleDataService'];

  function getUserBibleData($stateParams, UserBibleDataService) {
    $stateParams.abbrev = $stateParams.abbrev || 'gn';
    $stateParams.chapter = $stateParams.chapter || 1;
    return UserBibleDataService.get({
      book: $stateParams.abbrev,
      chapter: $stateParams.chapter
    }).$promise;
  }

  getUserCustomData.$inject = ['UserCustomDataService'];

  function getUserCustomData(UserCustomDataService) {
    return UserCustomDataService.get().$promise;
  }

  newBook.$inject = ['BooksService'];

  function newBook(BooksService) {
    return new BooksService();
  }
}());
