(function () {
  'use strict';

  angular
    .module('tests')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Tests',
      state: 'tests',
      type: 'dropdown',
      icon: 'help',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'tests', {
      title: 'List Tests',
      state: 'tests.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'tests', {
      title: 'Create Test',
      state: 'tests.create',
      roles: ['admin']
    });
  }
}());
