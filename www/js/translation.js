angular.module('starter.localization', ['ionic', 'pascalprecht.translate'])
  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.translations('en', {
      TR_LINEUP: 'LineUp',
      TR_BACK: 'Back',
      TR_SEARCH: 'Search',
      TR_PAGE1BUTTON: 'Create Line',
      TR_PAGE1JOINLINE: 'Join Line',
      TR_PAGE1ENTERLINEID: 'Enter Line ID..',
      TR_PAGE1CHOOSELINE: 'Choose Line',
      TR_PAGE1POPTITLE: 'line not found',
      TR_PAGE1POPTEMPLATE: 'id not exist please insert different line ID.'
    });
    $translateProvider.translations('he', {
      TR_LINEUP: 'LineUp',
      TR_BACK: 'חזרה',
      TR_SEARCH: 'חיפוש',
      TR_PAGE1BUTTON: 'צור תור',
      TR_PAGE1JOINLINE: 'הצטרף לתור',
      TR_PAGE1ENTERLINEID: 'הכנס מספר תור',
      TR_PAGE1CHOOSELINE: 'בחר תור',
      TR_PAGE1POPTITLE: 'תור לא נמצא',
      TR_PAGE1POPTEMPLATE: 'מספר תור לא נמצא נסה שוב'
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
  })
  .run(function($ionicPlatform, $translate) {
    $ionicPlatform.ready(function() {
      if (typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
          $translate.use((language.value).split("-")[0]).then(function(data) {
            console.log("SUCCESS -> " + data);
          }, function(error) {
            console.log("ERROR -> " + error);
          });
        }, null);
      }
    });
  });