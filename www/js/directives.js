

angular.module('starter.directives', ['ngCordova'])
.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      alert(1);
      $elm.on('onchange', function() {
        $("body").animate({scrollTop: $elm.offset().top}, "slow");
      });
    }
  }
})