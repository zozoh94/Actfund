'use strict';

/**
 * @ngdoc function
 * @name actfundApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the actfundApp
 */
angular.module('actfundApp')
  .controller('MainCtrl', function ($scope, $uibModal, $location, $http, $sce, store, uuid4, md5) {
    $scope.openModal1 = function() {
      $uibModal.open({
	templateUrl: 'modal1.html',
	controller: 'ModalInstanceCtrl',      
      });
    };
    $scope.openModal2 = function() {
      $uibModal.open({
	templateUrl: 'modal2.html',
	controller: 'ModalInstanceCtrl',      
      });
    };
    $scope.openModal3 = function() {
      $uibModal.open({
	templateUrl: 'modal3.html',
	controller: 'ModalInstanceCtrl',      
      });
    };

    $scope.cfGaPledge = '?utm_source='+encodeURIComponent($location.hostname)+'&utm_medium=widget&utm_content=pledge&utm_campaign=Act+Fund';
    $scope.cfGaClick = '?utm_source='+encodeURIComponent($location.hostname)+'&utm_medium=widget&utm_content=click&utm_campaign=Act+Fund';

    $scope.total = 0;
    $http.get('https://api.givago.co/actfund/survey/total/').success(function(data) {
      $scope.total = data.total;
    });

    var endUserId = store.get('survey_id');
    if(!endUserId) {
      endUserId = uuid4.generate();
      store.set('survey_id', endUserId);      
    }

    var appId = '8693';
    var appKey = '2b2ce92a9b0f82073d9bfdcd7bb5cb97';

    var userGo = md5.createHash(endUserId+appId+appKey).substring(0,10);

    $scope.surveyUrl = 'http://www.peanutlabs.com/userGreeting.php?userId='+endUserId+'-'+appId+'-'+userGo;
    $scope.surveyUrl = $sce.trustAsResourceUrl($scope.surveyUrl);
  })
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {  
    $scope.close = function () {
      $uibModalInstance.close();
    };    
  });
