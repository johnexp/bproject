// Books service used to communicate Books REST endpoints
(function () {
  'use strict';

  angular
    .module('books')
    .factory('BooksService', BooksService);

  BooksService.$inject = ['$resource', '$log'];

  function BooksService($resource) {
    var Books = $resource('/api/book/:abbrev', {
      abbrev: '@abbrev'
    }, {
      get: {
        method: 'GET'
      }
    });

    return Books;
  }
}());
