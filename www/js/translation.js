angular.module('starter.localization', ['ionic', 'pascalprecht.translate'])
  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.translations('en', {
      //global
      TR_HI: 'Hi\,',
      TR_LINEUP: 'LineUp',
      TR_BACK: 'Back',
      TR_SEARCH: 'Search',
      TR_Menu: 'Menu',
      TR_Login: 'Login',
      TR_Close: 'Close',
      TR_Loading: 'Loading...',
      TR_emailDetails: 'Enter Details',
      TR_Username: 'User Name:',
      TR_EmailAddress:'Email Address:',
      TR_Password: 'Password:',
      TR_Log_in: 'Log in',
      TR_default: 'My Lines',
      TR_createLine: 'Create New Line',
      TR_signIn: 'Sign in',
      TR_Passwordrepet: 'Repeat password:',
      TR_Log_up: 'Sign up',
      TR_share: 'Share Line',
      TR_ShareMeeting: 'Share Meeting',
      TR_lineStatus: 'Line Status',
      TR_page6: 'Line Operations',
      TR_lineAnalyze: 'Line Analyze',
      TR_getInLine: 'Join Line',
      TR_meetingStatus: 'Meeting Status',
      TR_Date:'Date:',
      TR_From: 'Start:',
      TR_to: 'End:',
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
      TR_StartLine: 'Start Line',
      TR_EnterYourAddress: 'Enter your address',
      TR_MyMeetings: 'My Meetings',
      //settings Page
      TR_Settings_language: 'Change language',
      TR_Title: 'Title:',
      TR_Current_Meetings: 'Current meeting:'
      //page 4
      TR_ShareViaFacebook:'Share via FaceBook',
      TR_ShareViaEmail:'Share via Email',
      TR_ShareViaMobile:'Share via Mobile',

      TR_Status_1: 'Your meeting is getting close..',
      TR_Status_2: 'It\'s almost time, don\'t forget to confirm your meeting',
      TR_Status_3: 'Hurry! it\'s time to Get in Line!',

      //page 5
      TR_manualControl: 'Manual Control',
      TR_lineAnalyze: 'Line Analyze',
      TR_UsersInLine: 'Users in Line:',
      TR_nextMeetings: 'Next Meetings:',
      TR_startDate: 'Start Date:',
      TR_endDate: 'End Date:',
      TR_user: 'Name',
      TR_date: 'Time',
      TR_confirm: 'Confirm',
      //page 6
      TR_nextMeeting: 'Move to next Meeting',
      TR_postponeCurrentMeeting:'Postpone current Meeting',
      TR_sendMessage:'Send message',
      TR_switchMeetings:'Switch Meetings',
      TR_fillEmptyMeeting:'Fill empty Meeting',
      TR_Share: 'Share Line',
      TR_endLine:'End line',
      TR_cancelMeeting: 'Cancel meeting',
      TR_meetingTimeStart: 'Meeting time',
      TR_Active_Lines: 'Active Lines:',
      TR_Active_Meetings: 'Active Meetings:',

      //page 1
      TR_ENTERLINEID: 'Enter Line ID..',
      TR_CHOOSELINE: 'Choose Line',
      TR_POPTITLE: 'line not found',
      TR_POPTEMPLATE: 'ID not exist please insert different line ID.',
      TR_myLines:'My Lines:',
      TR_myMeetings: 'My Meetings:',

      //page 2
      TR_Dates:'Dates:',
      TR_Location: 'Location:',
      TR_Duration: 'Duration:',
        //getInLine
      TR_POPTITLE: 'line not found',
      TR_POPTEMPLATE: 'id not exist please insert different line ID.',
      TR_Type: 'Type:',
      TR_Location: 'Location:',
      TR_Time: 'Next Meeting:',
      TR_Comments: 'Comments:',

      // signIn
      TR_SignIn_Facebook:"Sign in with Facebook",
      TR_SignIn_Email:"Login with Email",
      TR_SignUp_Email: 'Sign up with Email',
      TR_signUp: 'Sign up',
      TR_logOut: 'Log out',      
      // login

      // message
      TR_Message:'Send Message',
      TR_messageDetails: 'Enter Details',
      TR_messageSubject:'Subject:',
      TR_messageBody:'Body:',
      TR_sendMessage:'Send',

      TR_POPTITLE: 'oh oh..',
      TR_POPTEMPLATE: 'Something went wrong :(',
      TR_ManualLine: 'Manual line:',

      //footer
      TR_NextMeeting: 'Next Meeting',
      TR_PauseLine: 'Pause Line',
      TR_EndLine: 'End Line',
      TR_LineAnalyze: 'Line Analyze',
      TR_ShareLine: 'Share Line',

      TR_FutureMeetings: 'Future Meetings:',
      TR_PastMeetings: 'Past Meetings:',

      //line analze
      TR_LineInformation: 'Line information:',
      TR_UsersInLine: 'Users in Line:',
      TR_MeetingDuration: 'Meeting Duration:',
      TR_DefualtDuration: 'Defualt Duration:',
      TR_AvgDuration: 'Avg. Duration:',
      TR_TotalMeetings: 'Total Meetings:',
      TR_CanceledMeetings: 'Canceled meetings:',

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
      TR_BUTTON: 'צור תור',
      TR_JOINLINE: 'הצטרף לתור',
      TR_ENTERLINEID: 'הכנס מספר תור',
      TR_CHOOSELINE: 'בחר תור',
      TR_POPTITLE: 'תור לא נמצא',
      TR_POPTEMPLATE: 'מספר תור לא נמצא נסה שוב'
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
