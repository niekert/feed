/**
 * Created by NiekKruse on 9/16/15.
 */

var instafeedControllers = angular.module('instafeedControllers', []);

instafeedControllers.controller('FeedContainerCtrl', ['$scope', 'Instagram',
    function ($scope, Instagram) {
        $scope.isLoading = false;
        $scope.tagText = "";
        $scope.tagQuery = "";
        $scope.images = [];

        var spacePressed = false;

        $scope.keyPressed = function ($event) {
            spacePressed = false;
            switch ($event.keyCode) {
                case 13: //Enter key
                    $scope.tagQuery = $scope.tagText;
                    loadImages();
                    break;
                case 32: //space
                    $event.stopImmediatePropagation();
                    $event.preventDefault();
                    spacePressed = true; //very ugly workaround
                    break;
            }
        };

        $scope.tagChanged = function () {
            if (spacePressed) {
                $scope.tagText = $scope.tagText.substr(0, $scope.tagText.length - 1);
            }
        };


        function loadImages() {
            $scope.isLoading = true;
            $scope.images = [];

            Instagram.tags.queryTags({"tag": encodeURIComponent($scope.tagQuery)}, function (data) {
                $scope.isLoading = false;
                $scope.images = data.data;
            });
        }

    }
]);

instafeedControllers.controller('FooterCtrl', ['$scope', '$mdDialog', 'stateService', 'appSettings',
    function ($scope, $mdDialog, stateService, appSettings) {

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
                    $timeout(function () {
                        $location.path("/");
                    }, 5000); //Show a welcome for three seconds
                }, 1000);
            });
        }

        $scope.getStarted = function(){
            $location.path("/");
        }
    }]);