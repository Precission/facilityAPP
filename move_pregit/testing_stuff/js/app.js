'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngResource',
  'leaflet-directive',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider , RestangularProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl3'});
  $routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'MyUnitCtrl'});
  $routeProvider.when('/view5', {templateUrl: 'partials/my_partial.html', controller: 'MyCtrl3'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
