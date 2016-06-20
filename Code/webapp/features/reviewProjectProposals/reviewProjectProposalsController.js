(function () {
    'use strict';

    angular
        .module('reviewProjectProposals')
        .controller('reviewProjectController', reviewProjectCtrl);

    reviewProjectCtrl.$inject = ['$state', '$scope', 'reviewPPS','ToDoService','User'];
    /* @ngInject */
    function reviewProjectCtrl($state, $scope, reviewPPS,ToDoService,User) {
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
		
		function AcceptProject(projectid,owner,title,email,rank){
		
            reviewPPS.AcceptProjects(projectid).then(function(data){
				$scope.result = "Project Approved";
				var todo = {owner: rank, owner_id: owner, todo: "Dear proposer of project, the project titled: " + title + " has been approved by the PI." , type: "project", link: "#" };
				ToDoService.createTodo(todo).then(function(success)  {
					
				}, function(error) {
					
				});
				var email_msg = 
				{
					recipient: email, 
					text: "Dear proposer of project, the project titled: " + title + " has been approved by the PI.",
					subject: "Project Approved", 
					recipient2: "test@example.com", 
					text2: "", 
					subject2: "" 
				};
				User.nodeEmail(email_msg);
            });
        }
		
		function RejectProject(projectid,owner,title,email,rank){
			
            reviewPPS.RejectProjects(projectid).then(function(data){
				$scope.result = "Project Rejected";
				var todo = {owner: rank , owner_id: owner, todo: "Dear proposer of project, the project titled: " + title + " has been rejected by the PI. Please contact the PI for the specific reason why the project didn't meet the criteria for acceptance." , type: "project", link: "#" };
				ToDoService.createTodo(todo).then(function(success)  {
					
				}, function(error) {
					
				});
				var email_msg = 
				{
					recipient: email, 
					text:  "Dear proposer of project, the project titled: " + title + " has been rejected by the PI. Please contact the PI for the specific reason why the project didn't meet the criteria for acceptance.",
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
