// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .factory('UserMarkersSearchService', UserMarkersSearchService);

  UserMarkersSearchService.$inject = ['$resource'];

  function UserMarkersSearchService($resource) {
    var UserMarkersSearch = $resource('/api/user-markers-search/:book', {}, {
      get: {
        method: 'POST',
        transformRequest: function (data) {
          return JSON.stringify(data);
        },
        isArray: true
      }
    });

    return UserMarkersSearch;
  }
}());
