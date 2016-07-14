(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsDetailedCtrl', VIPProjectsDetailedCtrl);

    VIPProjectsDetailedCtrl.$inject = ['$location','$state', '$scope', '$stateParams', 'ProjectService', 'ProfileService','reviewStudentAppService','User','$window'];

    /* @ngInject */
    function VIPProjectsDetailedCtrl($location, $state, $scope, $stateParams, ProjectService, ProfileService,reviewStudentAppService,User,$window) {
        var profile = null;
		var vm = this;
        vm.data = null;
        vm.profile;
        vm.applyForProject = applyForProject;
        vm.deleteProject = deleteProject;
        vm.editProject = editProject;
		vm.leaveProject = leaveProject;
		vm.already_joined = null;
		vm.not_signed_in = false;
        
        $scope.go = function ( path ) {
          alert(path);
          $location.path( path );
        };
        
        //Note this data will not be here this will be in the db and the data will come from a get request
        vm.disciplines = [
            {'id':1, 'name':"Robotics"},
            {'id':2, 'name':"Augmented Reality"},
            {'id':3, 'name':"Virutal Reality"},
            {'id':4, 'name':"Aerospace"},
            {'id':5, 'name':"Big Data"},
        ];
        
        //init();
        //function init(){
            if($stateParams.id != null){
                
                vm.id = $stateParams.id;
                getProjectById();
				
            }
			ProfileService.loadProfile().then(function(data){
				vm.profile = data;
			});
        //}

        
        function getProjectById (){
            ProjectService.getProject(vm.id).then(function(data){
                vm.data = data;
				ProfileService.loadProfile().then(function(data){
					profile = data;
					if (profile) {
						vm.already_joined = vm.data.members.includes(profile.email);
						console.log(vm.already_joined);
					}
					else {
						vm.already_joined = false;
						vm.not_signed_in = true;
					}	
				});
            })
        }
        
        function applyForProject()
        {
            $state.go('studentconfirminfo', {id: vm.id});
        }
		
		
		function leaveProject() {
			swal({   
                        title: "You're about to leave this project!",   
                        text: "Are you sure you want to leave this project?",   
                        type: "warning",   
                        confirmButtonText: "I'm sure" ,
                        showCancelButton: true,
			}, function () {    
						profile.joined_project = false;
						User.update({user: profile});
						reviewStudentAppService.RemoveFromProject(vm.id,profile.email, {detailed: profile.firstName + " " + profile.lastName});
						$window.location.reload();
			});
			
		}
         
         function deleteProject() {
                 if (vm.profile) 
                 {
                    swal({   
                        title: "You're about to delete this project!",   
                        text: "Are you sure you want to delete this project?",   
                        type: "warning",   
                        confirmButtonText: "I'm sure" ,
                        showCancelButton: true,
                    }, function ()
                    {     
                         if (vm.profile._id == vm.data.owner || vm.profile.userType == "Pi/CoPi") 
                         {
                            ProjectService.delete(vm.id).then(function(data)
                            {
                                //console.log("Returned from the BackEnd");
                                $location.path('vip-projects');
                            });
                         }
                         else 
                         {
                             deny_msg();
                         }
                     });
                 }
                 else 
                 {
                     deny_msg();
                 }
         }
         
         function editProject() {
            //console.log(vm.profile.userType);
			 if (vm.profile) 
             {
				 if (vm.profile._id == vm.data.owner || vm.profile.userType == "Pi/CoPi") 
                 {
				    $state.go('projectProposal', {id: vm.id});
				 }
				 else 
                 {
					 deny_msg();
				 }
			 }
			 else 
             {
				 deny_msg();
			 }
			 
             
         }


        function deny_msg()
         {
            swal({   
                title: "You can't do that",   
                text: "You don't have permissions to perform this action.",   
                type: "info",   
                confirmButtonText: "Ok" ,
            }
            );
        }

            
            // console.log(vm.profile.userType == 'Student');
            // console.log(vm.user_type == 'Staff/Faculty');
            // console.log(vm.user_type == 'Pi/CoPi');

    }
})();
