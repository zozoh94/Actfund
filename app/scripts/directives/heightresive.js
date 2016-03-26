'use strict';

/**
 * @ngdoc directive
 * @name actfundApp.directive:resive
 * @description
 * # resize
 */
angular.module('actfundApp')
  .directive('resize', function ($window) {
    return function (scope, element, attr) {

      var w = angular.element($window);
      scope.$watch(function () {
        return {
          'h': window.innerHeight,
          'w': window.innerWidth
        };
      }, function (newValue) {
        scope.windowHeight = newValue.h;
	scope.windowWidth = newValue.w;

        scope.resize = function (percent) {
          scope.$eval(attr.notifier);
          return { 
            'height': newValue.h * (percent/100) + 'px'                    
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    };
  });
