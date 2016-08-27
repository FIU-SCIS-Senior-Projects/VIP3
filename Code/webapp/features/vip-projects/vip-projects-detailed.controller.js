(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsDetailedCtrl', VIPProjectsDetailedCtrl);

    VIPProjectsDetailedCtrl.$inject = ['$sce','$location','$state', '$scope', '$stateParams', 'ProjectService', 'ProfileService','reviewStudentAppService','User','$window'];

    /* @ngInject */
    function VIPProjectsDetailedCtrl($sce,$location, $state, $scope, $stateParams, ProjectService, ProfileService,reviewStudentAppService,User,$window) {
        var profile = null;
		var vm = this;
        vm.data = null
        
        vm.productOwner = new Array();
        
        // array that stores the names of product owners
        vm.own = [];
        
        vm.profile;
        vm.applyForProject = applyForProject;
        vm.deleteProject = deleteProject;
        vm.editProject = editProject;
		vm.leaveProject = leaveProject;
        //vm.findProfile = findProfile;
		vm.already_joined = null;
		vm.not_signed_in = false;
		vm.setVideo = function(src) {
			
			return $sce.trustAsResourceUrl(src);
		}
		
		vm.getEmail = function(index) {
			return vm.data.members[index];
		}
		
        vm.redirect = function(index) {
			
			User.getByEmail(vm.data.members[index]).then(function(res) {
				$state.go('viewProfile',{user_id: res.data, project_id: vm.data._id});
			});
		}
		
		 vm.redirect2 = function(email) {
			
			User.getByEmail(email).then(function(res) {
				$state.go('viewProfile',{user_id: res.data, project_id: vm.data._id});
			});
		}
		
        $scope.go = function ( path ) {
          alert(path);
          $location.path( path );
        };
        
        
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
				if (data.old_project && data.old_project.length > 0) {
					vm.data = data.old_project[0];
                    console.log(vm.data.owner_name);
                    vm.own = vm.data.owner_name.split(', ');
                    vm.own.mail = vm.data.owner_email.split(', ');
                    console.log(vm.own);
                    //vm.own_mails = 
				}
				else {
					vm.data = data;
                    console.log(vm.data.owner_name);
                    
                    vm.own = vm.data.owner_name.split(', ');
                    vm.newmail = vm.data.owner_email.split(', ');
                    
                    var xlength = vm.own.length;
                    for(var i = 0; i < xlength; i++) {
                        vm.productOwner.push([vm.own[i], vm.newmail[i]]);
                    }

                    console.log("Productowner array: ");
                    alert(vm.productOwner);
				}	
				ProfileService.loadProfile().then(function(data){
					profile = data;
					if (profile) {
						if (vm.data.members)
							vm.already_joined = vm.data.members.includes(profile.email);
						else {
							vm.already_joined = false;
						}
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
            // guest user should be told to login before applying to join a project
            if (!vm.profile) 
            {
                swal({
                            title: "Dear Guest!",   
                            text: "Please Login/Register before Applying to Join a Project!",   
                            type: "info",   
                            confirmButtonText: "Okay" ,
                            showCancelButton: true,
                }, function () {
                            //alert(1);
                            $window.location.href = "/#/login";
                });
            }
            
            // all other users are allowed
            else
            {
                $state.go('studentconfirminfo', {id: vm.id});
            }
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

         // function findProfile(name) {
         //    console.log(name);
            
         // }
         
         function editProject() {
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

    }
})();
