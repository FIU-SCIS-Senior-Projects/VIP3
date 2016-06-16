(function () {
    'use strict';

    angular
        .module('reviewProjectProposals')
        .controller('reviewProjectController', reviewProjectCtrl);

    reviewProjectCtrl.$inject = ['$state', '$scope', 'reviewPPS'];
    /* @ngInject */
    function reviewProjectCtrl($state, $scope, reviewPPS) {
        var vm = this;
        vm.projects;
		vm.AcceptProject = AcceptProject;
		vm.RejectProject = RejectProject;
		
        init();
        function init(){
            loadData();
        }

        function loadData(){
            reviewPPS.loadProjects().then(function(data){
                vm.projects = data;
            });
        }
		
		function AcceptProject(projectid){
			console.log("The Id is " + projectid +" ");
            reviewPPS.AcceptProjects(projectid).then(function(data){
				$scope.result = "Project Approved";
            });
        }
		
		function RejectProject(projectid){
			console.log("The Id is " + projectid +" ");
            reviewPPS.RejectProjects(projectid).then(function(data){
				$scope.result = "Project Rejected";
            });
		}
		
	}
})();
