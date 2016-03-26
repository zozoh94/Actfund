'use strict';

/**
 * @ngdoc overview
 * @name actfundApp
 * @description
 * # actfundApp
 *
 * Main module of the application.
 */
angular
  .module('actfundApp', [
    'pascalprecht.translate',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'duScroll',
    'uuid4',
    'angular-md5',
    'angular-storage'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider) {    
    $translateProvider
      .useSanitizeValueStrategy('sanitizeParameters')
      .useStaticFilesLoader({
	prefix: '/translations/locale-',
	suffix: '.json'
      });

    var lang = localStorage.getItem('lang').substring(1,localStorage.getItem('lang').length-1) || sessionStorage.getItem('lang').substring(1,sessionStorage.getItem('lang').length-1) || false;
    if(lang===0) {
      var name = 'lang=';
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0)===' ') {
	  c = c.substring(1);
	}
	if (c.indexOf(name) === 0) {
	  lang = c.substring(name.length,c.length);
	  lang = lang.substring(9, lang.length-9);
	}
      }
    }
    if(lang!==0 && lang.match('^(fr|en)$')) {
      $translateProvider.preferredLanguage(lang);
    } else {
      $translateProvider.determinePreferredLanguage();
      $translateProvider.preferredLanguage($translateProvider.preferredLanguage().substring(0,2));	      
    }
    
    $urlRouterProvider.when('/', '/'+$translateProvider.preferredLanguage());
    $urlRouterProvider.otherwise('/'+$translateProvider.preferredLanguage()+'/404');       
    
    $stateProvider.state('app', {
      abstract: true,
      url: '/{lang:(?:fr|en)}',
      template: '<ui-view/>'
    });

    $stateProvider.state('app.404', {
      url: '/404',
      templateUrl: 'views/404.html',
      controller: 'NotFoundController',
      data:{
	pageTitle: 'title.404'
      }
    });
    
    $stateProvider
      .state('app.home', {      
	url: '',
	templateUrl: 'views/main.html',
	controller: 'MainCtrl',
	data:{
	  pageTitle: 'title.home',
	  pageDesc: 'description'
	}
      })
      .state('app.preview', {      
	url: '/preview',
	templateUrl: 'views/preview.html',
	data:{
	  pageTitle: 'title.preview',
	  pageDesc: 'description'
	}
      });    
    
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .controller('RootController', function($scope, $rootScope, $stateParams, $translate, $location, $filter, $window, store, scrollAnchor){
    $rootScope.scrollTo = scrollAnchor.scrollTo;
    $rootScope.changeLanguage = function changeLanguage(lang){
      store.set('lang', lang);
    };
    
    var vm = this;
    vm.pageTitle = 'Actfund';
    vm.htmlTitle = $filter('translate')('title.actfund');
    vm.pageDesc = $filter('translate')('description').replace(/<[^>]+>/gm, '');
    vm.pageImages = [];

    var port = $location.port();
    //Port can be omitted on 80 or 443
    port = (port === 80 || port === 443) ? '' : ':' + port;
    vm.pageURL = $location.protocol() + '://' + $location.host() + port;

    //setting fb app id
    $rootScope.facebookAppId = 377735055715546;
    
    $scope.$on('$stateChangeSuccess', function rootStateChangeSuccess(event, toState){
      $rootScope.responseStatus = 200;
      angular.extend(vm, toState.data);
      //give 404 on hashbang URL's (for some reason googlebot crawled them?)
      if($location.absUrl().indexOf('#!') !== -1){
        if($location.host() !== 'localhost'){
          $rootScope.responseStatus = 404;
        }
      }

      if($stateParams.lang !== undefined){
        var otherLang = $stateParams.lang === 'en' ? 'fr' : 'en';
        $rootScope.activeLang = $stateParams.lang;
	$rootScope.otherLang = otherLang; //used in hreflang
        $rootScope.otherLangURL = $location.absUrl().replace('/' + $stateParams.lang, '/' +otherLang);
        $translate.use($stateParams.lang);
      }
      
      if(angular.isDefined(toState.data)){
	if(angular.isDefined(toState.data.pageTitle)){
          $scope.$watch(function(){
            return $filter('translate')(toState.data.pageTitle);
          }, function(newValue){
            var translatedValue = $filter('translate')(newValue);
            vm.pageTitle = translatedValue;
            vm.htmlTitle = translatedValue + ' - ' + $filter('translate')('title.actfund');
          });
	}

	if(angular.isDefined(toState.data.pageDesc)){
          $scope.$watch(function(){
            return $filter('translate')(toState.data.pageDesc);
          }, function(newValue){
            vm.pageDesc = newValue.replace(/<[^>]+>/gm, '');
          });
	}
      }

      vm.pageImages = [];
      vm.pageURL = $location.protocol() + '://' + $location.host() + $location.path();
    });
    
    if (/PhantomJS/.test($window.navigator.userAgent)) {
      //running prerender, we need to remove noscript as google indexes it :/
      var body = document.getElementsByTagName('body')[0];
      var noscript = document.getElementsByTagName('noscript')[0];
      body.removeChild(noscript);
    }
  })
  .controller('NotFoundController', function($rootScope) {
    $rootScope.responseStatus = 404;
  });

 angular.element(document).ready(function applicationBootstrap() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
      window.location.hash = '#!';
    }
 });
