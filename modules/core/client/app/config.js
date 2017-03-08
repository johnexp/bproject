(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ngMaterial', 'ngFileUpload', 'ui-notification', 'pascalprecht.translate', 'ui.mask', 'ngMdIcons', 'ui.select', 'ngSanitize', 'md.data.table', 'blockUI'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });

  angular.module('pascalprecht.translate')
    .config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
      $translatePartialLoaderProvider.addPart('core');
      $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/modules/{part}/client/i18n/{part}.{lang}.json'
      });

      // Definimos o idioma padrão
      $translateProvider.preferredLanguage('en_US');
      $translateProvider.forceAsyncReload(true);
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
      // Se você preferir que o idioma padrão seja detectado pelo idioma do browser
      // use as linhas abaixo:
      //
      // $translateProvider
      //  .uniformLanguageTag()
      //  .determinePreferredLanguage();
    }]);

}(window));
