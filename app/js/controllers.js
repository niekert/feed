/**
 * Created by NiekKruse on 9/16/15.
 *
 * Controllers for this app
 */

var instafeedControllers = angular.module('instafeedControllers', []);

instafeedControllers.controller('FeedContainerCtrl', ['$scope', 'Instagram', 'appSettings', '$location', 'stateService',
    function ($scope, Instagram, appSettings, $location, stateService) {
        if (stateService.user) {
            $location.path('/feed');
        }

        $scope.signIn = function () {
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
                    .title('What is this?')
                    .content('This is a simple Angular test app that makes use of the Instagram API :)')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('K')
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
        $scope.loadFinished = false;
        $scope.useLowRes = document.getElementById('contentContainer').clientWidth < 650;
        $scope.style = null;

        if ($scope.useLowRes) {
            $scope.style = {
                'width': '330px'
            };
        } else {
            $scope.style = {
                'width': '650px'
            };
        }


        if (!stateService.user) {
            $location.path("/");
        }

        Instagram.feed.query({"maxID": $scope.nextMaxID}, function (data) {
            $scope.nextMaxID = data.pagination.next_max_id;
            $scope.images = data.data;
            $scope.loadFinished = true;
        });


        $scope.goProfile = function (username) {
            $location.path('/profile/' + username);
        };

        $scope.openLikers = function (index) {
            alert('work in progress');
        }
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
        $scope.userID = null;

        Instagram.users.query({"q":$scope.username}, function(result){
           //Get the userID
            $scope.userID = result.data[0].id;
            Instagram.user.query({"userID": $scope.userID}, function(result){
               debugger;
            });
        });

    }]);