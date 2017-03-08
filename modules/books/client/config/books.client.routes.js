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
      .state('bible.list', {
        url: '',
        templateUrl: '/modules/books/client/views/list-books.client.view.html',
        controller: 'BooksListController',
        controllerAs: 'vm',
        resolve: {
          bookResolve: newBook
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Books List'
        }
      })
      .state('bible.create', {
        url: '/create',
        templateUrl: '/modules/books/client/views/form-book.client.view.html',
        controller: 'BooksController',
        controllerAs: 'vm',
        resolve: {
          bookResolve: newBook
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Books Create'
        }
      })
      .state('bible.edit', {
        url: '/:bookId/edit',
        templateUrl: '/modules/books/client/views/form-book.client.view.html',
        controller: 'BooksController',
        controllerAs: 'vm',
        resolve: {
          bookResolve: getBook
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Book {{ bookResolve.name }}'
        }
      })
      .state('bible.view', {
        url: '/:version/:abbrev/:chapter',
        templateUrl: '/modules/books/client/views/view-book.client.view.html',
        controller: 'BooksController',
        controllerAs: 'vm',
        resolve: {
          bookResolve: getBook
        },
        data: {
          roles: ['user', 'admin', 'guest'],
          pageTitle: 'Book {{ bookResolve.name }}'
        }
      });
  }

  getBook.$inject = ['$stateParams', 'BooksService'];

  function getBook($stateParams, BooksService) {
    return BooksService.get({
      version: $stateParams.version,
      abbrev: $stateParams.abbrev,
      chapter: $stateParams.chapter
    }).$promise;
  }

  newBook.$inject = ['BooksService'];

  function newBook(BooksService) {
    return new BooksService();
  }
}());
