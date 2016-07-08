(function () {
    'use strict';

    angular
        .module('admin')
        .controller('adminController', adminCtrl);

    adminCtrl.$inject = ['$window','$state', '$scope', 'adminService'];
    /* @ngInject */
    function adminCtrl($window, $state, $scope, adminService) {
        var vm = this;
        vm.users; //Confirmed users only (Email is verified)
		vm.allusers; //All confirmed and unconfirmed users
		vm.unconfirmedusers;//Unconfirmed users (Email is not verified)
        init();
		
        function init(){
            loadUsers();
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
			});
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
