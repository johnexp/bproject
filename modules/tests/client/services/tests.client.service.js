// Tests service used to communicate Tests REST endpoints
(function () {
  'use strict';

  angular
    .module('tests')
    .factory('TestsService', TestsService);

  TestsService.$inject = ['$resource', '$log'];

  function TestsService($resource, $log) {
    var Tests = $resource('/api/test/:testId', {
      testId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Tests.prototype, {
      createOrUpdate: function () {
        var test = this;
        return createOrUpdate(test);
      },
      getListResource: getListResource,
      getEnumResource: getEnumResource
    });

    return Tests;

    function getListResource() {
      return $resource('/api/tests/:active', {}, {
        getAll: {
          method: 'GET',
          isArray: true
        },
        delete: {
          method: 'DELETE',
          transformRequest: function (data) {
            return JSON.stringify(data);
          },
          isArray: true
        }
      });
    }

    function getEnumResource() {
      return $resource('/api/tests/enum/:field', {
        field: '@field'
      }, {
        getEnumValues: {
          method: 'GET',
          params: {
            field: '@field'
          },
          isArray: true
        }
      });
    }

    function createOrUpdate(test) {
      if (test._id) {
        return test.$update(onSuccess, onError);
      } else {
        return test.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(test) {
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
