var myAppConfig = angular.module('myAppConfig', ['ngCookies','ngResource', 'analytics','aceDirective']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('', {templateUrl: 'partials/home.html', controller: IndexController});
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: IndexController});
    $routeProvider.when('/quests', {templateUrl: 'partials/selectquests.html', controller: IndexController});
    $routeProvider.when('/practice', {templateUrl: 'partials/practice.html', controller: IndexController});
    $routeProvider.when('/challenges', {templateUrl: 'partials/challenges.html', controller: IndexController});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: IndexController});
    $routeProvider.when('/teach', {templateUrl: 'partials/teach.html', controller: IndexController});
    $routeProvider.when('/storyboard', {templateUrl: 'partials/storyboard.html', controller: IndexController});
    $routeProvider.otherwise({redirectTo: 'partials/home.html'});
}]);

myAppConfig.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

myAppConfig.filter('startFrom', function() {
    return function(input, idx) {
        if(input != undefined){
            var i=idx, len=input.length, result = [];
            for (; i<len; i++)
                result.push(input[i]);
            return result;
        }
    };
});