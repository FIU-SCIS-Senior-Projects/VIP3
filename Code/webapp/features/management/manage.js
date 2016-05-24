var sem = null;

$.getJSON( "semester", function( data ) {
		 sem = data;
	 });

angular.module('manage', []).controller('m', function ($scope) {
	 
	 $scope.semester = sem.semester + ' ' + sem.year;
});