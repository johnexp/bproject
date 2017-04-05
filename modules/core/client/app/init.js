(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig)
    .config(materialDesignConfig)
    .config(customToastConfig)
    .config(blockUIConfig);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }

  materialDesignConfig.$inject = ['$mdThemingProvider'];

  // Then define the init function for starting up the application
  angular.element(document).ready(init);


  function materialDesignConfig($mdThemingProvider) {
    var customPrimary = {
      // '50': '#15e4bd',
      // '100': '#12cdaa',
      // '200': '#10b596',
      // '300': '#0e9e83',
      // '400': '#0c866f',
      // '500': '#0a6f5c',
      // '600': '#085849',
      // '700': '#064035',
      // '800': '#042922',
      // '900': '#02110e',
      // 'A100': '#26ebc6',
      // 'A200': '#3eeecd',
      // 'A400': '#55f0d3',
      // 'A700': '#000000',
      '50': '#57a0d2',
      '100': '#4395cd',
      '200': '#3488c2',
      '300': '#2f7aae',
      '400': '#296c9a',
      '500': '#245e86',
      '600': '#1f5072',
      '700': '#19425e',
      '800': '#14344a',
      '900': '#0e2636',
      'A100': '#6cabd7',
      'A200': '#80b7dd',
      'A400': '#94c2e2',
      'A700': '#091721',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': 'light'
    };

    var customAccent = {
      '50': '#000a08',
      '100': '#00231d',
      '200': '#003d31',
      '300': '#005646',
      '400': '#00705a',
      '500': '#00896f',
      '600': '#00bc97',
      '700': '#00d6ac',
      '800': '#00efc0',
      '900': '#0affcf',
      'A100': '#00bc97',
      'A200': '#00a383',
      'A400': '#00896f',
      'A700': '#007e66',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': 'light'
    };

    var customWarn = {
      '50': '#f4b5be',
      '100': '#f19faa',
      '200': '#ee8996',
      '300': '#ea7382',
      '400': '#e75c6f',
      '500': '#e4465b',
      '600': '#e13047',
      '700': '#d81f38',
      '800': '#c11c32',
      '900': '#ab192c',
      'A100': '#f7ccd1',
      'A200': '#fbe2e5',
      'A400': '#fef8f9',
      'A700': '#951627',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': 'light'
    };

    $mdThemingProvider
      .definePalette('customPrimary',
        customPrimary);

    $mdThemingProvider
      .definePalette('customAccent',
        customAccent);

    $mdThemingProvider
      .definePalette('customWarn',
        customWarn);

    $mdThemingProvider.theme('default')
      .primaryPalette('customPrimary', {
        'default': '500',
        'hue-1': '400',
        'hue-2': '600',
        'hue-3': '700'
      })
      .accentPalette('customAccent')
      .warnPalette('customWarn');
    $mdThemingProvider.theme('warning-toast');
    $mdThemingProvider.theme('error-toast');
    $mdThemingProvider.theme('info-toast');
    $mdThemingProvider.theme('success-toast');
  }

  function customToastConfig($mdToastProvider) {
    $mdToastProvider.addPreset('customToast', {
      argOption: 'textContent',
      methods: ['textContent', 'themeIcon', 'content', 'action', 'highlightAction', 'highlightClass', 'theme', 'parent'],
      options: /* ngInject */ ['$mdToast', '$mdTheming', function ($mdToast, $mdTheming) {
        return {
          templateUrl: '/modules/core/client/views/custom-toast.tmpl.html',
          controller: 'CustomToastController',
          theme: $mdTheming.defaultTheme(),
          controllerAs: 'toast',
          bindToController: true
        };
      }]
    });
  }

  function blockUIConfig(blockUIConfig) {
    blockUIConfig.template = '<div class=\"block-ui-overlay\"></div><div class=\"block-ui-message-container\" aria-live=\"assertive\" aria-atomic=\"true\"><div layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div></div>';
    blockUIConfig.requestFilter = function(config) {
      if (config.url.match(/\/api/g)) {
        return true;
      }
    };
  }

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    var injector = angular.bootstrap(document, [app.applicationModuleName]);
    injector.invoke(function($rootScope, $translate) {
      $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $translate.refresh();
      });
    });
  }

}(ApplicationConfiguration));
