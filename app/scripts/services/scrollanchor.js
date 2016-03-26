'use strict';

/**
 * @ngdoc service
 * @name actfundApp.scrollAnchor
 * @description
 * # scrollAnchor
 * Service in the actfundApp.
 */
angular.module('actfundApp')
  .service('scrollAnchor', function ($rootScope, $location, $document, $state) {
    this.scrollTo = function(eID, state) {      
      if (typeof state !== 'undefined') {
	if($state.is(state)) {
	  $location.hash(eID);
	  var element = angular.element(document.getElementById(eID));	  
	  $document.scrollTo(element, 50, 600);
	}	
      }
    };
  });
