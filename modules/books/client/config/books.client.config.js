(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Books',
      state: 'books',
      type: 'dropdown',
      icon: 'help',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'books', {
      title: 'List Books',
      state: 'books.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'books', {
      title: 'Create Book',
      state: 'books.create',
      roles: ['admin']
    });
  }
}());
