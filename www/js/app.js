// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers' ,'starter.directives', 'starter.services', 'starter.localization', 'ngCordova'  ])
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
      views: {
        'menuContent': {
          templateUrl: "templates/createLine.html",
          controller: 'createLineCtrl'

        }
      }
    })
    .state('app.signIn', {
      url: "/signIn",
      views: {
        'menuContent': {
          templateUrl: "templates/signIn.html",
          controller: 'signInCtrl'
        }
      }
    })
  .state('app.shareLine', {
      url: "/shareLine",
      views: {
        'menuContent': {
          templateUrl: "templates/shareLine.html",
          controller: 'shareLineCtrl'
        }
      }
    })
    .state('app.shareMeeting', {
      url: "/shareMeeting",
      views: {
        'menuContent': {
          templateUrl: "templates/shareMeeting.html",
          controller: 'shareMeetingCtrl'
        }
      }
    })
    .state('app.lineStatus', {
      url: "/lineStatus",
      views: {
        'menuContent': {
          templateUrl: "templates/lineStatus.html",
          controller: 'lineStatusCtrl'
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
    .state('app.lineAnalyze', {
      url: "/lineAnalyze",
      views: {
        'menuContent': {
          templateUrl: "templates/lineAnalyze.html",
          controller: 'lineAnalyzeCtrl'
        }
      }
    })

    .state('app.getInLine', {
      url: "/getInLine",
      views: {
        'menuContent': {
          templateUrl: "templates/getInLine.html",
          controller: 'getInLineCtrl'
        }
      }
    })
    .state('app.meetingStatus', {
      url: "/meetingStatus",
      views: {
        'menuContent': {
          templateUrl: "templates/meetingStatus.html",
          controller: 'meetingStatusCtrl'
        }
      }
    })
    .state('app.myMeetings', {
      url: "/myMeetings",
      views: {
        'menuContent': {
          templateUrl: "templates/myMeetings.html",
          controller: 'myMeetingsCtrl'
        }
      }
    })
        .state('app.myLines', {
      url: "/myLines",
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
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/default');
});