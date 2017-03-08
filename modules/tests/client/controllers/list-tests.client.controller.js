(function () {
  'use strict';

  angular
    .module('tests')
    .controller('TestsListController', TestsListController);

  TestsListController.$inject = ['testResolve', '$translatePartialLoader', '$translate', 'PaginationService', '$filter', 'Toast', 'DialogService', '$log'];

  function TestsListController(test, $translatePartialLoader, $translate, PaginationService, $filter, Toast, DialogService, $log) {
    var vm = this;
    vm.testService = test;
    vm.pagination = PaginationService.getPagination();
    vm.pagination.sort = 'name';
    vm.allTests = test.getListResource().getAll(function() {
      filter();
    });
    vm.testFilter = { active: true };
    vm.changeState = changeState;
    vm.filter = filter;

    function filter() {
      angular.forEach(vm.testFilter, function (value, key) {
        if (value === '') {
          delete vm.testFilter[key];
        }
      });
      vm.tests = $filter('filter')(vm.allTests, vm.testFilter);
    }

    // Change activation state of an existing Test
    function changeState(ev, test) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          vm.testService.$remove({ testId: test._id }, function () {
            test.active = !test.active;
            filter();
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    $translatePartialLoader.addPart('tests');
    $translate.refresh();
  }
}());
