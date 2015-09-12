/**
 * Created by tianhengzhou on 9/2/15.
 */
var app = angular.module('myApp', ['angularUtils.directives.dirPagination']);
app.controller('customersCtrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $http.get('/data').success(function (data) {
        $scope.posts = data
    });
    $http.get('/categories').success(function (data) {
        $scope.categories = data
    });
    $scope.categoryquery = function(category){
        $scope.categoryq = category;
    };
});


