(function () {
    'use strict';

    angular
        .module('reviewStudentApp')
        .controller('reviewStudentAppController', reviewStudentAppCtrl);

    reviewStudentAppCtrl.$inject = ['$state', '$scope', 'reviewStudentAppService'];
    /* @ngInject */
    function reviewStudentAppCtrl($state, $scope, reviewStudentAppService) {
        var vm = this;
        vm.profile;
		vm.projects;
		vm.members = []; //Used to get members email and their respective projects 
		vm.membs = []; //Used to get Full information for members (including their application to a project)
		vm.ApproveData = ApproveData;
		vm.RejectData = RejectData;
		
		
        init();
        function init(){
            loadProjects();
        }

		//Loads all project information for active projects including applications from interested students
		function loadProjects(){
			reviewStudentAppService.loadProjects().then(function(data){
				vm.projects = data;
				for (var i = 0; i < vm.projects.length; i++)
				{
					for (var x = 0; x < vm.projects[i].members.length; x++)
					{
						vm.members[x] = [vm.projects[i]._id, vm.projects[i].title, vm.projects[i].members[x]];
					}
				}
				loadData();
			});
		}
		
		//Loads all Student information and matches them to their student applications  
        function loadData()
		{
            reviewStudentAppService.loadProfile().then(function(data){
                vm.profile = data;
				for (var i = 0; i < vm.profile.length; i++)
				{
					for (var x = 0; x < vm.members.length; x++)
					{
						if (vm.profile[i].email == vm.members[x][2])
						{
						vm.profile[i].projectid = vm.members[x][0];
						vm.profile[i].project = vm.members[x][1]; 
						vm.membs[i] = vm.profile[i];
						}
					}
				}
            });
        }
		
		function ApproveData(pid, members, userid)
		{
			reviewStudentAppService.RemoveFromProject(pid, members).then(function(data){
				$scope.result = "Approved";
			});
			reviewStudentAppService.AddToProject(userid, pid).then(function(data){
				$scope.result = "Approved";
			});
		}
		
		function RejectData(pid, members)
		{
			reviewStudentAppService.RemoveFromProject(pid, members).then(function(data){
				$scope.result = "Rejected";
			});
		}


    }
})();
