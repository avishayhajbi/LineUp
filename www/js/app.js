// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers' ,'starter.directives', 'starter.services', 'starter.localization'   ,  'ngCordova'  ])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($compileProvider, $stateProvider, $urlRouterProvider , $httpProvider) {
  // openFB.init({appId: '800206223408829'});
  //to show images
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider
    .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'menuCtrl'
  })
.state('app.page1', {
    url: "/page1",
    views: {
      'menuContent': {
        templateUrl: "templates/page1.html",
        controller: 'page1Ctrl'
      }
    }
  })
  .state('app.page2', {
      url: "/page2",
      views: {
        'menuContent': {
          templateUrl: "templates/page2.html",
          controller: 'page2Ctrl'

        }
      }
    })
    .state('app.page3', {
      url: "/page3",
      views: {
        'menuContent': {
          templateUrl: "templates/page3.html",
          controller: 'page3Ctrl'
        }
      }
    })
  .state('app.page4', {
      url: "/page4",
      views: {
        'menuContent': {
          templateUrl: "templates/page4.html",
          controller: 'page4Ctrl'
        }
      }
    })
    .state('app.page5', {
      url: "/page5",
      views: {
        'menuContent': {
          templateUrl: "templates/page5.html",
          controller: 'page5Ctrl'
        }
      }
    })
    .state('app.page6', {
      url: "/page6",
      views: {
        'menuContent': {
          templateUrl: "templates/page6.html",
          controller: 'page6Ctrl'
        }
      }
    })
    .state('app.page7', {
      url: "/page7",
      views: {
        'menuContent': {
          templateUrl: "templates/page7.html",
          controller: 'page7Ctrl'
        }
      }
    })

    .state('app.page9', {
      url: "/page9",
      views: {
        'menuContent': {
          templateUrl: "templates/page9.html",
          controller: 'page9Ctrl'
        }
      }
    })
    .state('app.page10', {
      url: "/page10",
      views: {
        'menuContent': {
          templateUrl: "templates/page10.html",
          controller: 'page10Ctrl'
        }
      }
    })
    .state('app.page11', {
      url: "/page11",
      views: {
        'menuContent': {
          templateUrl: "templates/page11.html",
          controller: 'page11Ctrl'
        }
      }
    })
    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settingPage.html",
          controller: 'settingCtrl'
        }
      }
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/page1');
});