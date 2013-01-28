'use strict';

//var testing = window.location.search.replace("?testing=", "");
var testing = 'true';

var myApp = angular.module('myApp', ['ngResource', 'analytics']);

 myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: IndexController});
    $routeProvider.when('/quests', {templateUrl: 'partials/quests.html', controller: IndexController});
    $routeProvider.when('/practice', {templateUrl: 'partials/practice.html', controller: IndexController});
    $routeProvider.when('/create', {templateUrl: 'partials/create.html', controller: IndexController});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: IndexController});
    $routeProvider.when('/teach', {templateUrl: 'partials/teach.html', controller: IndexController});
    $routeProvider.otherwise({redirectTo: 'partials/home.html'});
  }]);
