(function () {
  'use strict';

  // Tests controller
  angular
    .module('tests')
    .controller('TestsController', TestsController);

  TestsController.$inject = ['$scope', '$state', 'Authentication', 'testResolve', '$translatePartialLoader', '$translate', '$mdMedia', 'DialogService', 'Toast', '$log', 'PaginationService'];

  function TestsController ($scope, $state, Authentication, test, $translatePartialLoader, $translate, $mdMedia, DialogService, Toast, $log, PaginationService) {
    var vm = this;

    vm.historyPagination = PaginationService.getPagination();
    vm.historyPagination.sort = '-date';
    vm.authentication = Authentication;
    vm.test = test;
    vm.form = {};
    vm.changeState = changeState;
    vm.save = save;
    vm.$mdMedia = $mdMedia;

    $translatePartialLoader.addPart('tests');
    $translate.refresh();

    vm.selectOptSearchTerm = '';
    vm.clearSelectOptSearchTerm = clearSelectOptSearchTerm;

    // Change activation state of an existing Test
    function changeState(ev) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          vm.test.$remove(function () {
            vm.test.active = false;
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    // Save Test
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.testForm');
        Toast.error($translate.instant('Some fields were not filled correctly'));
        return false;
      }

      vm.test.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);

      function successCallback(res) {
        $state.go('tests.view', {
          testId: res._id
        });
      }

      function errorCallback(res) {
        Toast.genericErrorMessage();
        $log.error(res.data.message);
      }
    }

    function clearSelectOptSearchTerm() {
      vm.selectOptSearchTerm = '';
    }

    angular.element(document.getElementsByClassName('select-search-searchbox')).on('keydown', function(ev) {
      ev.stopPropagation();
    });
  }
}());
