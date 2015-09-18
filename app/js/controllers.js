/**
 * Created by NiekKruse on 9/16/15.
 *
 * Controllers for this app
 */

var instafeedControllers = angular.module('instafeedControllers', []);

instafeedControllers.controller('FeedContainerCtrl', ['$scope', 'Instagram', 'appSettings', '$location', 'stateService',
    function ($scope, Instagram, appSettings, $location, stateService) {
        if(stateService.user){
            $location.path('/feed');
        }

        $scope.signIn = function(){
            window.location.replace("https://api.instagram.com/oauth/authorize/?client_id=" + appSettings.clientID + "&redirect_uri=" + appSettings.baseUrl + "authorize&response_type=token");
        };

    }
]);

instafeedControllers.controller('FooterCtrl', ['$scope', '$mdDialog', 'stateService', 'appSettings', '$location',
    function ($scope, $mdDialog, stateService, appSettings, $location) {

        $scope.title = "TagsFeed";
        $scope.state = stateService;

        $scope.showAlert = function ($event) {
            console.log('showing alert');
            //noinspection JSUnresolvedFunction
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#divContainer')))
                    .clickOutsideToClose(true)
                    .title('Wat is dit?')
                    .content('Dit is een simpele test app geschreven in Angular die je naar recente Instagram tags laat zoeken. Work in progress enzo.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Snap \'t G!')
                    .targetEvent($event)
            );
        };

        $scope.signIn = function () {
            window.location.replace("https://api.instagram.com/oauth/authorize/?client_id=" + appSettings.clientID + "&redirect_uri=" + appSettings.baseUrl + "authorize&response_type=token");
        };

        $scope.signout = function () {
            stateService.signout();
            $location.path('/');
        }
    }]);

instafeedControllers.controller("AuthorizeCtrl", ['$scope', '$location', 'stateService', 'Instagram', '$timeout',
    function ($scope, $location, stateService, Instagram, $timeout) {
        $scope.isValid = false;
        $scope.state = stateService;

        var authCode = window.location.href.match(/access_token=(.*)/)[1];

        if (authCode != null && authCode != "") {
            $scope.isValid = true;
            stateService.setAuthCode(authCode);

            Instagram.user.query({'userID': 'self'}, function (result) {

                $timeout(function () {
                    stateService.user = result.data;
                }, 1000);
            });
        }

        $scope.getStarted = function () {
            $location.path("/");
        }
    }]);

instafeedControllers.controller('FeedCtrl', ['$scope', '$location', 'stateService', 'Instagram',
    function ($scope, $location, stateService, Instagram) {
        $scope.nextMaxID = null;
        $scope.images = [];

        if (!stateService.user) {
            $location.path("/");
        }

        Instagram.feed.query({"maxID": $scope.nextMaxID}, function (data) {
            $scope.nextMaxID = data.pagination.next_max_id;
            $scope.images = data.data;
        });
    }]);

instafeedControllers.controller('UserSearchCtrl', ['$scope', 'Instagram', '$location',
    function ($scope, Instagram, $location) {
        $scope.query = "";
        $scope.users = [];

        $scope.keyPressed = function ($event) {
            switch ($event.keyCode) {
                case 13: //enter key
                    Instagram.users.query({"q": $scope.query}, function (result) {
                        $scope.users = result.data;
                    });
                    break;
            }
        };

        $scope.goToProfile = function (username) {
            $location.path("/profile/" + username);
        };

    }]);

instafeedControllers.controller('ProfileCtrl', ['$scope', 'Instagram', '$routeParams',
    function ($scope, Instagram, $routeParams) {
        $scope.username = $routeParams.username;
    }]);