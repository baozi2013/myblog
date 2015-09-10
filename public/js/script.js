/**
 * Created by tianhengzhou on 9/2/15.
 */
var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {
    $http.get('/data').success(function (data) {
        $scope.posts = data
    });
})