angular.module('starter.localization', ['ionic', 'pascalprecht.translate'])
  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.translations('en', {
      //global
      TR_LINEUP: 'LineUp',
      TR_BACK: 'Back',
      TR_SEARCH: 'Search',
      TR_Menu: 'Menu',
      TR_Login: 'Login',
      TR_Close: 'Close',
      TR_Username: 'User Name',
      TR_Password: 'Password',
      TR_Log_in: 'Log in',
      TR_page1: 'page1',
      TR_Settings: 'Settings',
      //settings Page
      TR_Settings_language: 'Change language',
      //page1
      TR_1_BUTTON: 'Create Line',
      TR_1_JOINLINE: 'Join Line',
      TR_1_ENTERLINEID: 'Enter Line ID..',
      TR_1_CHOOSELINE: 'Choose Line',
      TR_1_POPTITLE: 'line not found',
      TR_1_POPTEMPLATE: 'id not exist please insert different line ID.'
    });
    $translateProvider.translations('he', {
      //global
      TR_LINEUP: 'LineUp',
      TR_BACK: 'חזרה',
      TR_SEARCH: 'חיפוש',
      TR_Menu: 'תפריט',
      TR_Login: 'התחברות',
      TR_Close: 'סגור',
      TR_Username: 'שם משתמש',
      TR_Password: 'סיסמא',
      TR_Log_in: 'התחבר',
      TR_page1: 'דף1',
      TR_Settings: 'הגדרות',
      //settings Page
      TR_Settings_language: 'שנה שפה',
      //page1
      TR_1_BUTTON: 'צור תור',
      TR_1_JOINLINE: 'הצטרף לתור',
      TR_1_ENTERLINEID: 'הכנס מספר תור',
      TR_1_CHOOSELINE: 'בחר תור',
      TR_1_POPTITLE: 'תור לא נמצא',
      TR_1_POPTEMPLATE: 'מספר תור לא נמצא נסה שוב'
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