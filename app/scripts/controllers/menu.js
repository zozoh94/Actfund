'use strict';

/**
 * @ngdoc function
 * @name actfundApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the actfundApp Menu
 */
angular.module('actfundApp')
  .controller('MenuCtrl', function ($rootScope, $scope) {            
    $scope.isCollapsed = true;

    $scope.inverseCollapse = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    
    $scope.collapse = function() {
      if(!$scope.isCollapsed) {
	$scope.isCollapsed = true;
      }
    };
  });
