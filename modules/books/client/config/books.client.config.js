(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Versions',
      state: 'bible',
      type: 'dropdown',
      icon: 'help',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Almeida Atualizada',
      state: 'bible.view({"version": "aa"})',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Almeida Corrigida Fiel',
      state: 'bible.view({"version": "acf"})',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Nova Versão Internacional',
      state: 'bible.view({"version": "nvi"})',
      roles: ['user', 'admin', 'guest']
    });
  }
}());
