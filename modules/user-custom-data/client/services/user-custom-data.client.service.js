// User meta service used to communicate User meta REST endpoints
(function () {
  'use strict';

  angular
    .module('user-custom-data')
    .factory('UserCustomDataService', UserCustomDataService);

  UserCustomDataService.$inject = ['$resource', '$log'];

  function UserCustomDataService($resource, $log) {
    var UserCustomData = $resource('/api/user-custom-data', {}, {
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

    angular.extend(UserCustomData.prototype, {
      createOrUpdate: function () {
        var userCustomData = this;
        return createOrUpdate(userCustomData);
      }
    });

    return UserCustomData;

    function createOrUpdate(userCustomData) {
      if (userCustomData._id) {
        return userCustomData.$update(onSuccess, onError);
      } else {
        return userCustomData.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(userCustomData) {
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
