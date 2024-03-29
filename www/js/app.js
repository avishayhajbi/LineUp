// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'starter.services', 'starter.localization', 'ngCordova'])
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
  .config(function($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
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
      .state('app.default', {
        url: "/default",
        views: {
          'menuContent': {
            templateUrl: "templates/default.html",
            controller: 'defaultCtrl'
          }
        }
      })
      .state('app.createLine', {
        url: "/createLine",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/createLine.html",
            controller: 'createLineCtrl'

          }
        }
      })
      .state('app.shareLine', {
        url: "/shareLine",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/shareLine.html",
            controller: 'shareLineCtrl'
          }
        }
      })
      .state('app.shareMeeting', {
        url: "/shareMeeting",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/shareMeeting.html",
            controller: 'shareMeetingCtrl'
          }
        }
      })
      .state('app.lineStatus', {
        url: "/lineStatus",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/lineStatus.html",
            controller: 'lineStatusCtrl'
          }
        }
      })
      .state('app.lineAnalyze', {
        url: "/lineAnalyze",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/lineAnalyze.html",
            controller: 'lineStatusCtrl'
          }
        }
      })

    .state('app.getInLine', {
        url: "/getInLine/",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/getInLine.html",
            controller: 'getInLineCtrl',

          }
        }
      })
      .state('app.meetingStatus', {
        url: "/meetingStatus",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/meetingStatus.html",
            controller: 'meetingStatusCtrl'
          }
        }
      })
      .state('app.myMeetings', {
        url: "/myMeetings",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/myMeetings.html",
            controller: 'myMeetingsCtrl'
          }
        }
      })
      .state('app.myLines', {
        url: "/myLines",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/myLines.html",
            controller: 'myLinesCtrl'
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
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/default');
  });