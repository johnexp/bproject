// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .factory('UserNotesSearchService', UserNotesSearchService);

  UserNotesSearchService.$inject = ['$resource'];

  function UserNotesSearchService($resource) {
    var UserNotesSearch = $resource('/api/user-notes-search/:searchTerm/:book', {
      searchTerm: '@searchTerm',
      book: '@book'
    }, {
      get: {
        method: 'GET',
        isArray: true
      }
    });

    return UserNotesSearch;
  }
}());
