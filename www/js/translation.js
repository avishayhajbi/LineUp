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
      TR_Loading: 'Loading...',
      TR_emailDetails: 'Enter Details',
      TR_Username: 'User Name',
      TR_EmailAddress:'Email Address',
      TR_Password: 'Password',
      TR_Log_in: 'Log in',
      TR_page1: 'page1',
      TR_Date:'Date',
      TR_Time:'Time',
      TR_Type: 'Type',
      TR_Reminder:'Reminder',
      TR_Settings: 'Settings',
      TR_Create_Line: 'Create Line',
      TR_join_line: 'Join Line',
      TR_get_in_line: 'Get in line',
      TR_yourPositionIs : 'Your postion is:',
      TR_timeToWait : 'Time to wait:',
      //settings Page
      TR_Settings_language: 'Change language',
    
      //page 4
      TR_4_ShareViaFacebook:'Share via FaceBook',
      TR_4_ShareViaEmail:'Share via Email',
      TR_4_ShareViaMobile:'Share via Mobile',

      //page 5
      TR_5_manualControl: 'Manual Control',
      TR_5_lineAnalyze: 'Line Analyze',

      //page 6
      TR_6_nextMeeting: 'Move to next Meeting',
      TR_6_postponeCurrentMeeting:'Postpone current Meeting',
      TR_6_sendMessage:'Send message',
      TR_6_switchMeetings:'Switch Meetings',
      TR_6_fillEmptyMeeting:'Fill empty Meeting',
      TR_6_Share: 'Share Line',
      TR_6_endLine:'End line',

      //page 1
      TR_1_ENTERLINEID: 'Enter Line ID..',
      TR_1_CHOOSELINE: 'Choose Line',
      TR_1_POPTITLE: 'line not found',
      TR_1_POPTEMPLATE: 'id not exist please insert different line ID.',
        //page9
      TR_9_POPTITLE: 'line not found',
      TR_9_POPTEMPLATE: 'id not exist please insert different line ID.',

      // page3
      TR_3_SignIn_Facebook:"Sign in with Facebook",
      TR_3_SignIn_Email:"Sign in with Email",

      // login

      // message
      TR_Message:'Send Message',
      TR_messageDetails: 'Enter Details',
      TR_messageSubject:'Subject:',
      TR_messageBody:'Body:',
      TR_sendMessage:'Send',

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
      TR_Date:'תאריך',
      TR_Reminder:'תזכורת',
      TR_Time:'זמן',
      TR_Type: 'סוג',
      TR_get_in_line: 'Get in line',
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