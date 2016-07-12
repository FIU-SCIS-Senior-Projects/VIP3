(function () {
    'use strict';

    angular
        .module('admin')
        .controller('adminController', adminCtrl);

    adminCtrl.$inject = ['$window','$state', '$scope', 'adminService', 'User', 'reviewStudentAppService'];
    /* @ngInject */
    function adminCtrl($window, $state, $scope, adminService, User, reviewStudentAppService) {
        var vm = this;
        vm.users; //Confirmed users only (Email is verified)
		vm.allusers; //All confirmed and unconfirmed users
		vm.unconfirmedusers;//Unconfirmed users (Email is not verified)
		vm.filteredusers; //filteredusers affected by filter function
		vm.projects;
		vm.filterUsers = filterUsers;
		vm.currentuserview;
		vm.currentview = currentview;
        init();
		
        function init(){
            loadUsers();
			loadProjects();
        }
		
		//Load all user information
		function loadUsers()
		{
			var tempArray = [];
			var tempArray2 = [];
			adminService.loadAllUsers().then(function(data){
				vm.allusers = data;
				vm.allusers.forEach(function (obj)
				{
					tempArray2.push(obj);
					if (obj.verifiedEmail == false)
					{
						tempArray2.pop();
						tempArray.push(obj);
					}
				});
				vm.users = tempArray2;
				vm.unconfirmedusers = tempArray;
				vm.filteredusers = vm.allusers;
			});
        }
		
		//Loads all project information for active projects
		function loadProjects(){
			reviewStudentAppService.loadProjects().then(function(data){
				vm.projects = data;
			});
		}
		
		//Filters users based on parameters
		function filterUsers(usertype, userrank, unconfirmed, gmaillogin, superuser, mentor, multipleprojects)
		{
			vm.filteredusers = vm.allusers;
			if (usertype)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.userType == usertype)
					{
						tempArray.push(obj);
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (userrank)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.userRank == userrank)
					{
						tempArray.push(obj);
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (unconfirmed)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.verifiedEmail == false)
					{
						tempArray.push(obj);
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (gmaillogin)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.google)
					{
						tempArray.push(obj);
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (superuser)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.isSuperUser)
					{
						tempArray.push(obj);
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (mentor)
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					if (obj.joined_project == true)
					{
						vm.projects.forEach(function (proj)
						{
							var full = obj.firstName + " " + obj.lastName;
							if (proj.owner_name == full)
							{
								tempArray.push(obj);
							}
						});
					}
				});
				vm.filteredusers = tempArray;				
			}
			if (multipleprojects) // O(n^3) Very slow.
			{
				var tempArray = [];
				
				vm.filteredusers.forEach(function (obj)
				{
					var counter = 0;
					if (obj.joined_project == true)
					{
						vm.projects.forEach(function (proj)
						{
							proj.members.forEach(function (email)
							{
								if (email == obj.email)
								{
									counter++;
									if (counter > 1) {tempArray.push(obj);}
								}
							});
						});
					}
				});
				vm.filteredusers = tempArray;		
			}
			
		}
		
		function currentview(user)
		{
			vm.currentuserview = [];
			vm.currentuserview.push(user);
			console.log(vm.currentuserview);
		}
		
		//Remove users
		function RemoveUser(user)
		{
			
		}
		
		//Confirm unconfirmed users
		function ConfirmUser(user)
		{
			
		}
		
		//Reject Unconfirmed users
		function RejectUser(user)
		{
			
		}
		
		//Change User Type
		function ChangeUserType(user)
		{
			
		}
		
		//Change User's Project
		function ChangeUserProject(user)
		{
			
		}
	}
})();






/* OLD CODE THAT WAS IN ADMIN.HTML


<div class="col-md-3">
				<div class="panel panel-default">
					<table class="table">
					<tr>
						<th>
							<b>Select User:</b><select class="form-control"></select>
						</th>
					</tr>
					<tr>
						<th>
							<p><b>Name:</b></p>	
							<p><b>Gender:</b></p>
							<p><b>UserType:</b></p>
							<p><b>UserRank:</b></p>
							<p><b>Email:</b></p>	
							<p><b>Department:</b></p>	
							<p><b>College:</b></p>	
							<p><b>Project:</b></p>		
						</th>
					</tr>
					<tr>
					<th>
					<button style= "width: 80px;" class="btn btn-info btn-block">Message</button>
					</th>
					</tr>
					</table>
				</div>
				</div>
*/

