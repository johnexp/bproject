// Books service used to communicate Books REST endpoints
(function () {
  'use strict';

  angular
    .module('books')
    .factory('BooksSearchService', BooksSearchService);

  BooksSearchService.$inject = ['$resource', '$log'];

  function BooksSearchService($resource) {
    var BooksSearch = $resource('/api/search/:searchTerm/:version/:abbrev', {
      version: '@version',
      abbrev: '@abbrev',
      chapter: '@searchTerm'
    }, {
      get: {
        method: 'GET',
        isArray: true
      }
    });

    angular.extend(BooksSearch.prototype, {
      getSearchByVersionResouce: getSearchByVersionResouce
    });

    function getSearchByVersionResouce() {
      return $resource('/api/book/search/:version/:searchTerm', {
        version: '@version',
        chapter: '@searchTerm'
      }, {
        get: {
          method: 'GET',
          isArray: true
        }
      });
    }

    return BooksSearch;
  }
}());
