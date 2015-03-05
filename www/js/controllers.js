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

.controller('page1Ctrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicScrollDelegate, $filter, outSideLineHandler) {

    $scope.lineIdToGet = '';
    $scope.placeholder = 'TR_1_ENTERLINEID';
    $scope.searchPlaceHolder = 'TR_SEARCH';
    $scope.LineList = outSideLineHandler.getLineList();


    $scope.$on('lineListUpdated', function(event) {
      $scope.LineList = outSideLineHandler.getLineList();
      console.log('lineListUpdated');
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
      $scope.lineIdToGet = line.id;
      $scope.modal.hide();
    }

    //iside  chooseLine function : 
    $scope.scrollToTop = function() {
      $ionicScrollDelegate.scrollTop();
    }

    $scope.searchLineByName = function(value) {
      console.log("search Value:" + value);
      if (value !== '') {
        outSideLineHandler.searchLineByName(value);
      }

    }
    $scope.resetSearchBar = function(value) {
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
      var listObject = outSideLineHandler.getLine();
      if (!listObject) {
        var alertPopup = $ionicPopup.alert({
          title: $filter('translate')('TR_1_POPTITLE'),
          template: $filter('translate')('TR_1_POPTEMPLATE')
        });
      } else {
        $state.transitionTo("app.page9");
      }
    }


  })
  .controller('page2Ctrl', function($scope) {


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


})

.controller('page9Ctrl', function($scope ) {
  $scope.line = {
    configEnabeld: true,
    type: ["1", "2", "3"],
    availableDates: [{
      day: "01-01-2013",
      availableMeetings: ["07:00", "08:00", "09:00", "10:00"]
    }, {
      day: "01-01-2015",
      availableMeetings: ["07:00", "08:00", "09:00", "10:00"]
    }],
    startDate: "01-01-2013",
    endDate: "01-01-2015"
  }
  
  $scope.chooseDate = function(value) {
    $scope.selectedDate = value;
    console.log($scope.selectedDate);
  }

  
})
.controller('page10Ctrl', function($scope) {


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