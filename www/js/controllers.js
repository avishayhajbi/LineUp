  angular.module('starter.controllers', ['ngCordova'])

  .controller('menuCtrl', function($scope, $ionicModal, $timeout, userManagment, $ionicLoading, $ionicPopup) {


      // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/ionicModal/login.html', {
          scope: $scope
      }).then(function(modal) {
    $scope.modalMenu = modal;
  });

 $scope.user = {};
  $scope.$on('connectedToFB' , function(event , result){
    $scope.user = {id:userManagment.getMyFBId(),name:userManagment.getMyName(),connected:userManagment.isConnected()};
  });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
          $scope.modalMenu.hide();
      };

      // Open the login modal
      $scope.login = function() {
          $scope.modalMenu.show();
      };

  
      var pushNotification;


// setTimeout(function() {
//         debugger;

//           pushNotification = window.plugins.pushNotification;

//           pushNotification.unregister(function(dat) {
//             debugger;

//            }, function(add){
//             debugger
//            });

//            if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
//         pushNotification.register(
//           successHandler,
//           errorHandler, {
//             "senderID": "205633341244",
//             "ecb": "onNotification"
//           });
//       } else if (device.platform == 'blackberry10') {
//         pushNotification.register(
//           successHandler,
//           errorHandler, {
//             invokeTargetId: "replace_with_invoke_target_id",
//             appId: "replace_with_app_id",
//             ppgUrl: "replace_with_ppg_url", //remove for BES pushes
//             ecb: "pushNotificationHandler",
//             simChangeCallback: replace_with_simChange_callback,
//             pushTransportReadyCallback: replace_with_pushTransportReady_callback,
//             launchApplicationOnPush: true
//           });
//       } else {
//         pushNotification.register(
//           tokenHandler,
//           errorHandler, {
//             "badge": "true",
//             "sound": "true",
//             "alert": "true",
//             "ecb": "onNotificationAPN"
//           });
//       }

// } , 3000);

//       // Form data for the message modal
//       $scope.messageData = {};

//       // Create the message modal that we will use later
//   function successHandler (result) {
//     debugger;
//     console.log('result = ' + result);
// }

// function errorHandler (error) {
//     console.log('error = ' + error);
// }    
     
// //handle notification for ios 
// function onNotificationAPN (event) {
//     if ( event.alert )
//     {
//         navigator.notification.alert(event.alert);
//     }

//     if ( event.sound )
//     {
//         var snd = new Media(event.sound);
//         snd.play();
//     }

//     if ( event.badge )
//     {
//         pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
//     }
// }
// //handle notification for android
// function onNotification(e) {
//    debugger;
//     $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

//     switch( e.event )
//     {
//     case 'registered':
//         if ( e.regid.length > 0 )
//         {
//             $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
//             // Your GCM push server needs to know the regID before it can push to this device
//             // here is where you might want to send it the regID for later use.
//             console.log("regID = " + e.regid);
//         }
//     break;

//     case 'message':
//         // if this flag is set, this notification happened while we were in the foreground.
//         // you might want to play a sound to get the user's attention, throw up a dialog, etc.
//         if ( e.foreground )
//         {
//             $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

//             // on Android soundname is outside the payload.
//             // On Amazon FireOS all custom attributes are contained within payload
//             var soundfile = e.soundname || e.payload.sound;
//             // if the notification contains a soundname, play it.
//             var my_media = new Media("/android_asset/www/"+ soundfile);
//             my_media.play();
//         }
//         else
//         {  // otherwise we were launched because the user touched a notification in the notification tray.
//             if ( e.coldstart )
//             {
//                 $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
//             }
//             else
//             {
//                 $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
//             }
//         }

//        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
//            //Only works for GCM
//        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
//        //Only works on Amazon Fire OS
//        $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
//     break;

//     case 'error':
//         $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
//     break;

//     default:
//         $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
//     break;
//   }
// }

})
  .controller('page1Ctrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicScrollDelegate, $filter, outSideLineHandler, $ionicLoading) {

          $scope.lineIdToGet = '';
          $scope.placeholder = 'TR_1_ENTERLINEID';
          $scope.searchPlaceHolder = 'TR_SEARCH';

          $scope.LineList = outSideLineHandler.getLineList();


          $scope.$on('lineListUpdated', function(event) {
              $scope.LineList = outSideLineHandler.getLineList();
              console.log('lineListUpdated:', $scope.LineList);
          });

          //when typing on inputbox
          $scope.changeInput = function(manualId) {
              $scope.lineIdToGet = manualId;
          }

          // clear the placeholder when click
          $scope.clearPlaceHolder = function() {
              $scope.placeholder = '';
              $scope.lineIdToGet = '';
          }

          $ionicModal.fromTemplateUrl('templates/ionicModal/LineList.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.modal = modal;
          });


          //open the list of lines
          $scope.openChooseLine = function() {
                  $scope.LineList = outSideLineHandler.getDefaultLineList();
                  $scope.modal.show();

              }
              //when click back
          $scope.closeChooseLine = function() {
                  $scope.lineIdToGet = '';
                  $scope.modal.hide();
              }
              //click on one Line
          $scope.chooseLine = function(line) {
              $scope.placeholder = line.title;
              $scope.lineIdToGet = line._id;
              $scope.modal.hide();
          }

          //iside  chooseLine function : 
          $scope.scrollToTop = function() {

          }

          $scope.searchLineByName = function(value) {
              console.log("search Value:" + value);
              if (value !== '') {
                  outSideLineHandler.searchLineByName(value);
              }

          }
          $scope.resetSearchBar = function(value) {
              $ionicScrollDelegate.scrollTop();
              if (value === '') {
                  $scope.LineList = outSideLineHandler.getDefaultLineList();
              }
          }



          $scope.joinLine = function() {
              console.log("try to connect to:" + $scope.lineIdToGet);
              outSideLineHandler.getLine($scope.lineIdToGet);
              $ionicLoading.show({
                  template: $filter('translate')('TR_Loading')
              });
          }

          $scope.$on('lineInfoArrived', function(event, args) {
              $ionicLoading.hide();
              if (args === false) {
                  var alertPopup = $ionicPopup.alert({
                      title: $filter('translate')('TR_1_POPTITLE'),
                      template: $filter('translate')('TR_1_POPTEMPLATE')
                  });
              } else if (args === "noRoom") {
                  var alertPopup = $ionicPopup.alert({
                      title: "no room in line",
                      template: "no room in line"
                  });

              } else if (args === "signed") {
                  var alertPopup = $ionicPopup.alert({
                      title: "already signed to this line",
                      template: "already signed to this line"
                  });
              } else {
                  $state.go("app.page9");
              }
          });

      })
      .controller('page2Ctrl', function($scope, $filter, $rootScope, $state, $ionicPopup, $ionicLoading, lineManager) {

          $scope.newLine = {};
          $scope.dates = [];
          $scope.newLine.location = {
              latitude: '',
              longitude: ''
          };

          var autocomplete;
          (function() {
              autocomplete = new google.maps.places.Autocomplete(
                  (document.getElementById('autocomplete')), {
                      types: ['geocode']
                  });
              google.maps.event.addListener(autocomplete, 'place_changed', function() {
                  var place = autocomplete.getPlace();
                  $scope.newLine.location.latitude = place.geometry.location.k;
                  $scope.newLine.location.longitude = place.geometry.location.D;
                  $scope.newLine.location.address = place.formatted_address;

              });
          })();

          //image handeling
          $scope.PicSourece = document.getElementById('smallimage');

          function UploadPicture(imageURI) {
              if (imageURI.substring(0, 21) == "content://com.android") {
                  var photo_split = imageURI.split("%3A");
                  imageURI = "content://media/external/images/media/" + photo_split[1];
              }
              $scope.newLine.ImageURI = imageURI;
              $scope.PicSourece.src = imageURI;

          }
          $scope.ShowPictures = function() {
              navigator.camera.getPicture(UploadPicture, function(message) {
                  console.log('get picture failed');
              }, {
                  quality: 100,
                  destinationType: navigator.camera.DestinationType.FILE_URI,
                  sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
              });
          };


          $scope.insertNewDate = function() { 
              $scope.data = {};
              var chooseDatePopUp = $ionicPopup.show({
                  template: '<label class="item item-input"><input type="date" ng-model="data.day" placeholder="dd-MM-yyyy"></label><label class="item item-input row row-center"><span class="col col-25">from:</span><input type="time" class="col col-75" ng-model="data.from" placeholder="HH:mm"></label><label class="item item-input row row-center"><span class="col col-25">to:</span><input type="time" class="col col-75" ng-model="data.to" placeholder="HH:mm"></label>',
                  title: 'choose date:',
                  subTitle: '',
                  scope: $scope,
                  buttons: [{
                      text: 'Cancel'
                  }, {
                      text: '<b>Save</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                          if (!checkAtt($scope.data.day) && !checkAtt($scope.data.from) && !checkAtt($scope.data.to)) {
                              e.preventDefault();
                          } else {
                              return $scope.data;
                          }
                      }
                  }]
              });
              chooseDatePopUp.then(function(data) {

                  data.from.setDate(data.day.getDate());
                  data.from.setMonth(data.day.getMonth());
                  data.from.setFullYear(data.day.getFullYear());
                  data.to.setDate(data.day.getDate());
                  data.to.setMonth(data.day.getMonth());
                  data.to.setFullYear(data.day.getFullYear());
                  delete data.day;

                  $scope.dates.push(data);

              });

          };

          $scope.createLine = function() {
              if (!checkAtt($scope.newLine.confirmTime) || !checkAtt($scope.dates) || !checkAtt($scope.newLine.druation)) {
                  var alertPopup = $ionicPopup.alert({
                      title: 'missing information',
                      template: 'please fill all information'
                  });
              } else {
                  var newLine = $scope.newLine;
                  newLine.ImageURI = $scope.PicSourece.src;
                  newLine.availableDates = $scope.dates;
                  lineManager.createLine(newLine);
                  $ionicLoading.show({
                      template: $filter('translate')('TR_Loading')
                  });
              }
          }

          $scope.$on('lineCreated', function(event, args) {
              $ionicLoading.hide();
              if (args === false) {
                  var alertPopup = $ionicPopup.alert({
                      title: $filter('translate')('TR_1_POPTITLE'),
                      template: $filter('translate')('TR_1_POPTEMPLATE')
                  });
              } else {
                  $state.go("app.page3");
              }
          });

      })
      .controller('page3Ctrl', function($scope , userManagment) {

          $scope.signInEmail = function() {
              $scope.modalMenu.show();
          };

          $scope.signInFackBook = function() {
              userManagment.connectToFaceBook();
          };

      })


  .controller('page4Ctrl', function($scope, $rootScope, lineManager) {
      
      $scope.line = lineManager.getCurrentLine();

      $scope.shareFackBook = function() {
          console.log("share via FaceBook");
      };


      $scope.shareEmail = function() {
          console.log("share via Email");
      };


      $scope.shareMobile = function() {
          console.log("share via Mobile");
      };


  })


  .controller('page5Ctrl', function($scope, $state, lineManager) {

    $scope.line = lineManager.getCurrentLine();

      $scope.manualControl = function() {
          $state.go("app.page6");
      };

      $scope.lineAnalyze = function() {
          $state.go("app.page7");
      };

  })


  .controller('page6Ctrl', function($scope, $state) {


          $scope.nextMeeting = function() {
              console.log("Move to next Meeting");
          };

          $scope.postponeMeeting = function() {
              console.log("Postpone current Meeting");
          };

          $scope.sendMessage = function() {
              console.log("Send message");

              $scope.modalMessageMenu.show();
          
          };

          $scope.switchMeetings = function() {
              console.log("Switch Meetings");
          };

          $scope.fillEmptyMeeting = function() {
              console.log("Fill empty Meeting");
          };

          $scope.shareLine = function() {
              $state.go("app.page4");
          };

          $scope.endLine = function() {
              console.log("End line");
          };

      })



      .controller('page7Ctrl', function($scope) {


      })
      .controller('page8Ctrl', function($scope) {

          $scope.myLineList = [{
              title: "line number1"
          }, {
              title: "line number2"
          }];

      })
      .controller('page9Ctrl', function($scope, $state, $rootScope, meetingManager, $ionicLoading, $filter, $ionicPopup) {

          if (!$scope.meeting) {
              $scope.meeting = meetingManager.getCurrentMeeting();
              console.log("meeting:", $scope.meeting);
          }

          $rootScope.$on('LineInfoInManager', function() {
              $scope.meeting = meetingManager.getCurrentMeeting();
              console.log("meeting:", $scope.meeting);
          });


          $scope.chooseDate = function(value) {
              $scope.selectedDate = value;
          }

          $scope.toggleReminder = function(value) {
              $scope.reminderRow = value;
          }

          $scope.getInLine = function() {
              meetingManager.confirmMeeting();
              $ionicLoading.show({
                  template: $filter('translate')('TR_Loading')
              });
          }

          $rootScope.$on('signedToNewMeet', function(event, args) {
              $ionicLoading.hide();
              if (!args) {
                  var alertPopup = $ionicPopup.alert({
                      title: $filter('translate')('TR_1_POPTITLE'),
                      template: $filter('translate')('TR_1_POPTEMPLATE')
                  });
              } else {
                  $state.go("app.page10");
              }
          });

      })
      .controller('page10Ctrl', function($scope, meetingManager, $rootScope, $ionicPopup, $ionicLoading, $filter, $state) {
          meetingManager.getPosition();
          $scope.meeting = meetingManager.getCurrentMeeting();
          $scope.reminder = true;


          var updateInt = setInterval(function() {
              meetingManager.getPosition();
          }, 30000);

          $scope.$on("$destroy", function() {
              clearInterval(updateInt);
          });

          $scope.cancelLine = function() {

              var cancelLinePopUp = $ionicPopup.show({
                  template: 'are u sure?',
                  title: 'alert',
                  subTitle: '',
                  scope: $scope,
                  buttons: [{
                      text: 'No'
                  }, {
                      text: '<b>Yes</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                          meetingManager.cancelMeeting($scope.meeting);
                          $ionicLoading.show({
                              template: $filter('translate')('TR_Loading')
                          });
                      }
                  }]
              });
          }


          $rootScope.$on('meetingCancled', function(event, args) {

              $ionicLoading.hide();
              if (!args) {
                  var alertPopup = $ionicPopup.alert({
                      title: "please try again",
                      template: "please try again"
                  });
              } else {
                  var canceledPopup = $ionicPopup.show({
                      template: 'meeting canceld',
                      title: 'meeting canceld',
                      subTitle: '',
                      scope: $scope,
                      buttons: [{
                          text: '<b>ok</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                              return;

                          }

                      }]
                  });
                  canceledPopup.then(function(data) {
                      $state.go("app.page1");
                  });
              }
          });

      })
      .controller('page11Ctrl', function($scope) {

      })

  .controller('settingCtrl', function($scope, $translate) {
          $scope.changeLanguage = function() {
              $translate.use('he');
          }
      })
      .controller('mainCtrl', function($scope, $ionicPopup, $timeout, $cordovaSocialSharing) {
          //open screen delay 
          setTimeout(function() {
              $scope.$apply(function() {
                  $("#welcomeScreen").animate({
                      opacity: 0,
                      top: "+1000"
                  }, 2000, function() {
                      $("#welcomeScreen").hide();
                  });
              });
          }, 3000);

      });