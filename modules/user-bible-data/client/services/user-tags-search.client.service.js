// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .factory('UserTagsSearchService', UserTagsSearchService);

  UserTagsSearchService.$inject = ['$resource'];

  function UserTagsSearchService($resource) {
    var UserTagsSearch = $resource('/api/user-tags-search/:book', {}, {
      get: {
        method: 'POST',
        transformRequest: function (data) {
          return JSON.stringify(data);
        },
        isArray: true
      }
    });

    return UserTagsSearch;
  }
}());
