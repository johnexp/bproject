// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-meta')
    .factory('UserMetaService', UserMetaService);

  UserMetaService.$inject = ['$resource'];

  function UserMetaService($resource) {
    var UserMeta = $resource('/api/user-meta/:version/:abbrev/:chapter', {
      version: '@version',
      abbrev: '@abbrev',
      chapter: '@chapter'
    }, {
      get: {
        method: 'GET'
      }
    });

    return UserMeta;
  }
}());
