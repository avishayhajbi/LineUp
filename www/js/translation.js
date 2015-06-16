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
      TR_default: 'My Lines',
      TR_createLine: 'Create New Line',
      TR_signIn: 'Sign in',
      TR_Passwordrepet: 'Repeat password',
      TR_Log_up: 'Sign up',
      TR_share: 'Share Line',
      TR_lineStatus: 'Line Status',
      TR_page6: 'Line Operations',
      TR_lineAnalyze: 'Line Analyze',
      TR_getInLine: 'Join Line',
      TR_meetingStatus: 'Meeting Status',
      TR_Date:'Date',
      TR_From: 'From:',
      TR_to: 'To:',
      TR_Time:'Time',
      TR_ConfirmTime: 'Confirm Time:',
      TR_Type: 'Type',
      TR_Reminder:'Set Reminder:',
      TR_Settings: 'Settings',
      TR_Create_Line: 'Create Line',
      TR_join_line: 'Join Line',
      TR_get_in_line: 'Get in line',
      TR_yourPositionIs : 'Your position is:',
      TR_timeToWait: 'Time to wait:',
      TR_cancelLine: 'Cancel Line', 
      TR_messageAdmin: 'Message Admin',
      TR_Settings_logOutFaceBook: 'Log out via Facebook',
      //settings Page
      TR_Settings_language: 'Change language',
      TR_Title: 'Title:',
      //page 4
      TR_4_ShareViaFacebook:'Share via FaceBook',
      TR_4_ShareViaEmail:'Share via Email',
      TR_4_ShareViaMobile:'Share via Mobile',


      //page 5
      TR_5_manualControl: 'Manual Control',
      TR_5_lineAnalyze: 'Line Analyze',
      TR_5_UsersInLine: 'Users in Line:',
      TR_5_nextMeetings: 'Next meetings:',
      TR_5_startDate: 'Start Date:',
      TR_5_endDate: 'End Date:',
      TR_5_user: 'user name',
      TR_5_date: 'meeting time',
      //page 6
      TR_6_nextMeeting: 'Move to next Meeting',
      TR_6_postponeCurrentMeeting:'Postpone current Meeting',
      TR_6_sendMessage:'Send message',
      TR_6_switchMeetings:'Switch Meetings',
      TR_6_fillEmptyMeeting:'Fill empty Meeting',
      TR_6_Share: 'Share Line',
      TR_6_endLine:'End line',
      TR_cancelMeeting: 'Cancel meeting',
      TR_meetingTimeStart: 'Meeting time',


      //page 1
      TR_1_ENTERLINEID: 'Enter Line ID..',
      TR_1_CHOOSELINE: 'Choose Line',
      TR_1_POPTITLE: 'line not found',
      TR_1_POPTEMPLATE: 'id not exist please insert different line ID.',
      TR_1_myLines:'My Lines:',
      TR_1_myMeetings: 'My Meetings:',

      //page 2
      TR_2_Dates:'Dates:',
      TR_2_Location: 'Location:',
      TR_2_Duration: 'Duration:',
        //getInLine
      TR_9_POPTITLE: 'line not found',
      TR_9_POPTEMPLATE: 'id not exist please insert different line ID.',
      TR_9_Type: 'Type:',
      TR_9_Location: 'Location:',
      TR_9_Time: 'Next Meeting:',
      TR_9_Comments: 'Comments:',

      // signIn
      TR_3_SignIn_Facebook:"Sign in with Facebook",
      TR_3_SignIn_Email:"Login with Email",
      TR_3_SignUp_Email: 'Sign up with Email',
      TR_signUp: 'Sign up',
      TR_logOut: 'Log out',      
      // login

      // message
      TR_Message:'Send Message',
      TR_messageDetails: 'Enter Details',
      TR_messageSubject:'Subject:',
      TR_messageBody:'Body:',
      TR_sendMessage:'Send',

      TR_2_POPTITLE: 'oh oh..',
      TR_2_POPTEMPLATE: 'Something went wrong :(',
      TR_2_ManualLine: 'Manual line:',
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
      TR_default: 'דף1',
      TR_Settings: 'הגדרות',
      TR_Date:'תאריך',
      TR_Reminder:'תזכורת',
      TR_Time:'זמן',
      TR_Type: 'סוג',
      TR_get_in_line: 'Get in line',
      //settings Page
      TR_Settings_language: 'שנה שפה',
      //default
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