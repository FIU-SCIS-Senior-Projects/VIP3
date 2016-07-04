(function () {
    'use strict';

    angular
        .module('reviewStudentApp', ['reviewProjectProposals', 'ProjectProposalService'])
        .controller('reviewStudentAppController', reviewStudentAppCtrl);

    reviewStudentAppCtrl.$inject = ['$window','$state', '$scope', 'reviewStudentAppService','ToDoService','User', 'reviewPPS', 'ProjectService', 'ProfileService'];
    /* @ngInject */
    function reviewStudentAppCtrl($window,$state, $scope, reviewStudentAppService, ToDoService,User, reviewPPS, ProjectService, ProfileService) {
        var vm = this;
        vm.profile;
		vm.projects;
		vm.members = []; //Used to get members email and their respective projects 
		vm.membs = []; //Used to get Full information for members (including their application to a project)
		vm.ApproveData = ApproveData;
		vm.RejectData = RejectData;
		vm.UndoStudent = UndoStudent;
		vm.logs;
		
		
        init();
        function init(){
            loadProjects();
			loadLogs();
        }
		
		function loadLogs()
		{
            reviewPPS.loadLog("student").then(function(data){
                vm.logs = data;
            });
        }

		//Loads all project information for active projects including applications from interested students
		function loadProjects(){
			reviewStudentAppService.loadProjects().then(function(data){
				vm.projects = data;
				for (var i = 0; i < vm.projects.length; i++)
				{
					for (var x = 0; x < vm.projects[i].members.length; x++)
					{
						vm.members[x] = [vm.projects[i]._id, vm.projects[i].title, vm.projects[i].members[x], vm.projects[i].members_detailed[x]];
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
							vm.profile[i].members_detailed = vm.members[x][3];
							vm.membs[i] = vm.profile[i];
						}
					}
				}
				vm.membs = vm.membs.filter(function(n){ return n != undefined && !n.joined_project });
				
            });
        }
		
		function ApproveData(pid, members, userid,name,user)
		{
           
			//reviewStudentAppService.RemoveFromProject(pid, members).then(function(data){
			//	$scope.result = "Approved";
				
			//});
			
			user.joined_project = true;
			
			User.update({user: user});
			
			reviewStudentAppService.AddToProject(userid, pid).then(function(data){
				$scope.result = "Approved";
				var todo = {owner: "Student", owner_id: userid, todo: "Dear student, the project titled: " + name + " has accepted your application." , type: "project", link: "/#/to-do" };
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

			success_msg();
			var log = {projectid: pid, student: userid, firstName: user.firstName, lastName: user.lastName, studentemail: user.email, selectProject: name, gender: user.gender, department: user.department, college: user.college, action: "Approved", type: "student" };
			reviewPPS.createLog(log).then(function(success)  {
					
				}, function(error) {
				});

		}
		
		function RejectData(pid, members,members_detailed,userid,name, user)
		{
            
			reviewStudentAppService.RemoveFromProject(pid, members, {detailed: members_detailed }).then(function(data){
				$scope.result = "Rejected";
				var todo = {owner: "Student", owner_id: userid, todo: "Dear student, the project titled: " + name + " has rejected your application." , type: "project", link: "/#/to-do" };
				ToDoService.createTodo(todo).then(function(success)  {
					
				}, function(error) {
					
				});
				var email_msg = 
				{
					recipient: members, 
					text:  "Dear student, the project you joined has rejected you from joining.",
					subject: "Project Rejected", 
					recipient2: "test@example.com", 
					text2: "", 
					subject2: "" 
				};
				User.nodeEmail(email_msg);

			});
			var log = {projectid: pid, student: userid, firstName: user.firstName, lastName: user.lastName, studentemail: user.email, selectProject: name, gender: user.gender, department: user.department, college: user.college, action: "Rejected", type: "student" };
			reviewPPS.createLog(log).then(function(success)  {
					
				}, function(error) {
				});


			reject_msg();

		}
		
		function UndoStudent(log)
		{
			if (log.action == "Rejected")
			{
				//check if original user is in project first
				reviewStudentAppService.loadUser(log.student).then(function(data){
					var thisStud = data[0];
					if (thisStud.joined_project == false)
					{
						var sProject;
						ProjectService.getProject(log.projectid).then(function(data)
						{
							var project = data;
							console.log(project);
						for (i = 0; i < project.members.length; i++) {
							if (project.members[i] === log.email) {
								console.log("fail");
								return;
							}
						}
						for (i = 0; i < project.members_detailed.length; i++) {
							if (project.members_detailed[i] === (log.firstName + " " + log.lastName)) {
								console.log("fail");
								return;
							}
						}
						project.members[project.members.length] = log.studentemail;
						project.members_detailed[project.members_detailed.length] = log.firstName + " " + log.lastName;
						//Call service to create a student application:
						ProjectService.editProject(project,project._id).then(function(success){}
						);
						});
								
						//Call service to delete in log
						reviewPPS.UndoLog(log._id).then(function(success){
						}, function(error) {
						});
						undo_msg();
					}
					else
					{
						undoerror_msg(); //Student is in a project
					}
					
				});
					
				
			}
			else if (log.action == "Approved")
			{
				//check if original user is in project first
				console.log("FOUND YA!! " + log.student);
				reviewStudentAppService.loadUser(log.student).then(function(data){
					var thisStud = data;
					console.log(thisStud);
					if (thisStud.joined_project == true)
					{
						ProjectService.getProject(log.projectid).then(function(data)
						{
							var proj = data;
							//check if he is in the same project
							console.log(thisStud._id);
							if (thisStud.project == proj._id || thisStud.project == proj.title)
							{
								thisStud.joined_project = false;
								//call service to create a student application
								reviewStudentAppService.setJoinedProjectFalse(thisStud._id).then(function(data)
								{
								});
								
								
								
								
								//Call service to delete in log
								reviewPPS.UndoLog(log._id).then(function(success){
									}, function(error) {
									});
								undo_msg();
							}
							else
							{
								undoerror2_msg(); //student is in a different project
							}
						});
					}
					else
					{
						undoerror3_msg(); //Student is not in a project
					}
					
				});
					
				
			}
			
		}
		
		
		

		function success_msg()
         {
            swal({   
                title: "Accepted",   
                text: "User has been accepted and notified",   
                type: "info",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 10000,
            }, function (){
				$window.location.reload();
            }
            );
        };
		
		
		function undo_msg()
         {
            swal({   
                title: "Undo Successful",   
                text: "This student application now requires approval",   
                type: "info",   
                confirmButtonText: "Okay" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
               $window.location.reload();
            }
            );
        };
		
		//Student is in a project
		function undoerror_msg()
         {
            swal({   
                title: "Undo Successful",   
                text: "This student is already in a project",   
                type: "info",   
                confirmButtonText: "Okay" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
            }
            );
        };

		//Student is in a different project
		function undoerror2_msg()
         {
            swal({   
                title: "Undo Successful",   
                text: "This student is already in a different project",   
                type: "info",   
                confirmButtonText: "Okay" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
            }
            );
        };
		//Student is not in a project
		function undoerror3_msg()
         {
            swal({   
                title: "Undo Successful",   
                text: "This student is not in a project",   
                type: "info",   
                confirmButtonText: "Okay" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
            }
            );
        };

        function reject_msg()
         {
            swal({   
                title: "User Rejected",   
                text: "User has been denied and notified",   
                type: "warning",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 10000,
            }, function (){
				$window.location.reload();
            }
            );
        };
    }
})();
