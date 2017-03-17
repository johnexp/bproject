// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .factory('UserBibleDataService', UserBibleDataService);

  UserBibleDataService.$inject = ['$resource', '$log'];

  function UserBibleDataService($resource, $log) {
    var UserBibleData = $resource('/api/user-bible-data/:book/:chapter', {
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

    angular.extend(UserBibleData.prototype, {
      createOrUpdate: function () {
        var userBibleData = this;
        return createOrUpdate(userBibleData);
      }
    });

    return UserBibleData;

    function createOrUpdate(userBibleData) {
      if (userBibleData._id) {
        return userBibleData.$update(onSuccess, onError);
      } else {
        return userBibleData.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(userBibleData) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
