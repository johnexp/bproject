(function () {
  'use strict';

  angular
    .module('user-custom-data')
    .controller('ColorsLegendController', ColorsLegendController);

  function ColorsLegendController($mdDialog, userCustomData) {
    var vm = this;
    vm.userCustomData = userCustomData;
    vm.colorsLegend = loadColorsLegend();
    vm.hide = hide;
    vm.saveLegends = saveLegends;

    function hide() {
      $mdDialog.hide();
    }

    function loadColorsLegend() {
      vm.colorsLegend = {};
      if (vm.userCustomData.colorsLegend) {
        for (var i = 0; i < vm.userCustomData.colorsLegend.length; i++) {
          vm.colorsLegend[vm.userCustomData.colorsLegend[i].color] = vm.userCustomData.colorsLegend[i].legend;
        }
      }
      return vm.colorsLegend;
    }

    function saveLegends() {
      vm.userCustomData.colorsLegend = createColorsLegend();
      $mdDialog.hide(vm.userCustomData);
    }

    function createColorsLegend() {
      var colorsLegend = [];
      if (vm.colorsLegend.yellow) {
        colorsLegend.push({ color: 'yellow', legend: vm.colorsLegend.yellow });
      }
      if (vm.colorsLegend.red) {
        colorsLegend.push({ color: 'red', legend: vm.colorsLegend.red });
      }
      if (vm.colorsLegend.purple) {
        colorsLegend.push({ color: 'purple', legend: vm.colorsLegend.purple });
      }
      if (vm.colorsLegend.blue) {
        colorsLegend.push({ color: 'blue', legend: vm.colorsLegend.blue });
      }
      if (vm.colorsLegend.green) {
        colorsLegend.push({ color: 'green', legend: vm.colorsLegend.green });
      }
      if (vm.colorsLegend.pink) {
        colorsLegend.push({ color: 'pink', legend: vm.colorsLegend.pink });
      }
      if (vm.colorsLegend.orange) {
        colorsLegend.push({ color: 'orange', legend: vm.colorsLegend.orange });
      }
      return colorsLegend;
    }
  }
}());
