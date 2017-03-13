(function () {
  'use strict';

  angular
    .module('books')
    .factory('UserMetaService', UserMetaService);

  UserMetaService.$inject = ['$resource', '$log'];

  function UserMetaService($resource) {
    var UserMeta = $resource('/api/user-meta/test/:version/:abbrev/:chapter', {
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
