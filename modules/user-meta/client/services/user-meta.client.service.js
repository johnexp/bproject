// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-meta')
    .factory('UserMetaService', UserMetaService);

  UserMetaService.$inject = ['$resource'];

  function UserMetaService($resource) {
    var UserMeta = $resource('/api/user-meta/:book/:chapter', {
      book: '@book',
      chapter: '@chapter'
    }, {
      get: {
        method: 'GET'
      },
      update: {
        method: 'PUT',
        transformRequest: function (data) {
          return JSON.stringify(data);
        }
      }
    });

    angular.extend(UserMeta.prototype, {
      createOrUpdate: function () {
        var userMeta = this;
        return createOrUpdate(userMeta);
      }
    });

    return UserMeta;

    function createOrUpdate(userMeta) {
      if (userMeta._id) {
        return userMeta.$update(onSuccess, onError);
      } else {
        return userMeta.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(userMeta) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }
  }
}());
