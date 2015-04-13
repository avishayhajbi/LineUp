angular.module('starter.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $ionicModal, $timeout) {


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/ionicModal/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalMenu = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalMenu.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalMenu.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
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

    $ionicModal.fromTemplateUrl('templates/ionicModal/LineList.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

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

      });
    })();

    //image handeling
    function UploadPicture(imageURI) {

      $scope.PicSourece = document.getElementById('smallimage');

      if (imageURI.substring(0, 21) == "content://com.android") {
        var photo_split = imageURI.split("%3A");
        imageURI = "content://media/external/images/media/" + photo_split[1];
      }
      $scope.newLine.ImageURI = imageURI;
      $scope.PicSourece.src = imageURI;

    }
    $scope.ShowPictures = function() {
      navigator.camera.getPicture(UploadPicture, function(message) {
        alert('get picture failed');
      }, {
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
      });
    };


    $scope.insertNewDate = function() {
      $scope.data = {};
      var chooseDatePopUp = $ionicPopup.show({
        template: '<label class="item item-input"><input type="date" ng-model="data.day" placeholder="date"></label><label class="item item-input row row-center"><span class="col col-25">from:</span><input type="time" class="col col-75" ng-model="data.from" placeholder="HH:mm"></label><label class="item item-input row row-center"><span class="col col-25">to:</span><input type="time" class="col col-75" ng-model="data.to" placeholder="HH:mm"></label>',
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
        data.day = dateHandler.getDay(data.day);
        data.fromMin = dateHandler.getTimeInMinutes(data.from);
        data.from = dateHandler.getTime(data.from);
        data.toMin = dateHandler.getTimeInMinutes(data.to);
        data.to = dateHandler.getTime(data.to);
        $scope.dates.push(data);

      });

    };

    $scope.createLine = function() {
      var newLine = $scope.newLine;
      var dates = $scope.dates;
      if (!checkAtt(newLine.confirmTime) || !checkAtt(dates) || !checkAtt(newLine.meetingTitle) || !checkAtt(newLine.druation)) {
        var alertPopup = $ionicPopup.alert({
          title: 'missing information',
          template: 'please fill all information'
        });
        alertPopup.then(function(res) {});

      } else {
        newLine.availableDates = [];
        for (var i = 0; i < dates.length; i++) {
          var day = dates[i].day;
          var meetings = [];
          for (var j = dates[i].fromMin; j < dates[i].toMin; j += newLine.druation) {
            meetings.push(dateHandler.getTimeFromMinutes(j));
          }
          newLine.availableDates.push({
            day: day,
            meetings: meetings
          });
        }
        console.log(newLine);
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
  .controller('page3Ctrl', function($scope) {


  })
  .controller('page4Ctrl', function($scope) {


  })
  .controller('page5Ctrl', function($scope) {


  })
  .controller('page6Ctrl', function($scope) {


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
  .controller('page9Ctrl', function($scope, $state, $rootScope, $stateParams, meetingManager, outSideLineHandler) {

    var meeting = {};
    $scope.reminder = true;
    $scope.line = outSideLineHandler.getLineInfo();
    $scope.chooseDate = function(value) {
      $scope.selectedDate = value;
    }

    $scope.toggleReminder = function(value) {
      $scope.reminderRow = value;
    }

    $scope.getInLine = function() {
      meeting.lineID = line._ID;
      if (line.configEnabeld) {
        meeting.date = $scope.selectedDate;
      }

      meetingManager.requestMeeting(meeting);
      $ionicLoading.show({
        template: $filter('translate')('TR_Loading')
      });
    }

    $rootScope.$on('newMeetingArrived', function(event, args) {
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
  .controller('page10Ctrl', function($scope, outSideLineHandler) {
    $scope.reminder = true;
    $scope.line = outSideLineHandler.getLineInfo();

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