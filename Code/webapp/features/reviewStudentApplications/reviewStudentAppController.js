(function () {
    'use strict';

    angular
        .module('reviewStudentApp')
        .controller('reviewStudentAppController', reviewStudentAppCtrl);

    reviewStudentAppCtrl.$inject = ['$state', '$scope', 'reviewStudentAppService','ToDoService','User'];
    /* @ngInject */
    function reviewStudentAppCtrl($state, $scope, reviewStudentAppService, ToDoService,User) {
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
				vm.membs = vm.membs.filter(function(n){ return n != undefined });
				
            });
        }
		
		function ApproveData(pid, members, userid,name)
		{
			reviewStudentAppService.RemoveFromProject(pid, members).then(function(data){
				$scope.result = "Approved";
				
			});
			reviewStudentAppService.AddToProject(userid, pid).then(function(data){
				$scope.result = "Approved";
				var todo = {owner: "Student", owner_id: userid, todo: "Dear student, the project titled: " + name + " has accepted your application." , type: "project", link: "#" };
				ToDoService.createTodo(todo).then(function(success)  {
					
				}, function(error) {
					
				});
				var email_msg = 
				{
					recipient: members, 
					text:  "Dear student, the project you joined has accepted you to participate.",
					subject: "Project Approved", 
					recipient2: "test@example.com", 
					text2: "", 
					subject2: "" 
				};
				User.nodeEmail(email_msg);
			});
		}
		
		function RejectData(pid, members,userid,name)
		{
			reviewStudentAppService.RemoveFromProject(pid, members).then(function(data){
				$scope.result = "Rejected";
				var todo = {owner: "Student", owner_id: userid, todo: "Dear student, the project titled: " + name + " has rejected your application." , type: "project", link: "#" };
				ToDoService.createTodo(todo).then(function(success)  {
					
				}, function(error) {
					
				});
				var email_msg = 
				{
					recipient: members, 
					text:  "Dear student, the project you joined has rejected you from joining.",
					subject: "Project Approved", 
					recipient2: "test@example.com", 
					text2: "", 
					subject2: "" 
				};
				User.nodeEmail(email_msg);
			});
		}


    }
})();
