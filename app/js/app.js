/**
 * Created by NiekKruse on 9/16/15.
 *
 * App definition for instafeed
 */

var instafeedApp = angular.module('instafeedApp', [
    'ngRoute',
    'ngMaterial',
    'instafeedControllers',
    'stateServiceModule',
    'instagramService'
]);

instafeedApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            'templateUrl': '/partials/feed-container.html',
            'controller': 'FeedContainerCtrl'
        }).when('/authorize', {
            'templateUrl': '/partials/authorize.html',
            'controller': 'AuthorizeCtrl'
        }).when('/feed', {
            'templateUrl': '/partials/feed.html',
            'controller': 'FeedCtrl'
        }).when('/search', {
            'templateUrl': '/partials/user-search.html',
            'controller': 'UserSearchCtrl'
        }).when('/profile/:username', {
            'templateUrl': '/partials/profile.html',
            'controller': 'ProfileCtrl'
        }).otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }]);

instafeedApp.run(['$rootScope', 'userService',
    function ($rootScope, userService) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (sessionStorage.restorestate == "true") {
                $rootScope.$broadcast('restorestate');
                sessionStorage.restorestate = false;
            }
        });

        window.onbeforeunload = function (event) {
            $rootScope.$broadcast('savestate');
            sessionStorage.restorestate = true;
        };
    }]);

instafeedApp.constant("appSettings", {
    "clientID": "c0529330871448c18e840cd78c537628",
    "baseUrl": "http://localhost:3474/",
    "apiBaseUrl": "https://api.instagram.com/v1/"//DONT LOOK
});

instafeedApp.factory('userService', ['$rootScope', 'stateService',
    function ($rootScope, stateService) {
        var service = {
            saveState: function () {
                if (stateService.user) {
                    sessionStorage.userService = angular.toJson(stateService.user);
                }

                var authCode = stateService.getAuthCode();
                if (authCode) {
                    sessionStorage.access_code = angular.toJson(authCode);
                }
            },

            restoreState: function () {
                if (sessionStorage.userService != undefined && sessionStorage.access_code != undefined) {
                    stateService.user = angular.fromJson(sessionStorage.userService);
                    stateService.setAuthCode(angular.fromJson(sessionStorage.access_code));
                }
            }
        };

        $rootScope.$on('savestate', service.saveState);
        $rootScope.$on('restorestate', service.restoreState);

        return service;
    }]);
