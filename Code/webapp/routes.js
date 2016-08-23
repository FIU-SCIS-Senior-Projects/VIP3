angular.module('routes', ['ui.router'])

    .config(function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('about', {
                url: '/about',
                templateUrl: 'features/about/about.html'
            })
            .state('contact', {
                url:'/contact',
                templateUrl: 'features/contact/contact.html',
                controller: 'contactController',
                controllerAs: 'vm',
            })
            .state('competitionInformation', {
                url:'/competition-information',
                templateUrl: 'features/competition/competition.html'
            })
            .state('home', {
            	url:'/',
            	templateUrl:'features/main-page/home.html'
            })
            .state('how-vip-credits-count', {
                url:'/how-vip-credits-count',
                templateUrl: 'features/how-vip-credits-count/index.html'
            })
            .state('evaluation', {
                url:'/peer-evaluations',
                templateUrl: 'features/evaluation-page/evaluation.html'
            })
            .state('graduateApplication', {
                url:'/graduate-application',
                templateUrl: 'features/graduate-application/graduateApplication.html'
            })
            .state('undergraduateApplication', {
                url:'/undergraduate-application',
                templateUrl: 'features/undergraduate-application/undergraduateApplication.html'
            })
	        .state('presentationsAndPublications', {
	            url:'/presentations-and-publications',
	            templateUrl: 'features/presentations-and-publications/presentationsAndPublications.html'
	        })
            .state('registerPermit', {
                url:'/request-registration-permit',
                templateUrl: 'features/registration-permit/registrationPermit.html'
            })
            .state('login', {
                url:'/login',
                templateUrl: 'features/login/loginTemplate.html'
            })

           

			.state('resetpassword', {
                url:'/resetpassword',
                templateUrl: 'features/forgot-password/forgotPasswordTemplate.html',
                controller: 'forgotPasswordController',
                controllerAs: 'resetPwd',
            })
            .state('password_request', {
                url:'/password_request?auth_id',
                templateUrl: 'features/forgot-password/forgotPasswordTemplate.publish.html',
                controller: 'forgotPasswordPublishController',
                controllerAs: 'resetPwd',
            })
            .state('organization', {
                url:'/organization',
                templateUrl: 'features/organization/organization.html'
            })
            .state('profile', {
                url:'/profile',
                templateUrl: 'features/profile-page/user-profile.html',
                controller: 'profileController',
                controllerAs: 'vm'
            })
            .state('projects',{
                url:'/vip-projects',
                templateUrl:'features/vip-projects/vip-projects.html',
                controller: 'VIPProjectsCtrl',
                controllerAs: 'vm'
            })
           .state('projectsDetailed',{
                url:'/vip-projects-detailed/:id',
                templateUrl:'features/vip-projects/vip-projects-detailed.html',
                controller: 'VIPProjectsDetailedCtrl',
                controllerAs: 'vm',
                /*params: { id: null }*/
            })
            
            .state('registration', {
                url: '/registration',
                templateUrl: 'features/registration/registrationTemplate.html',
                controller: 'registrationController',
                controllerAs: 'regCtlr'
            })
            
            .state('toDo', {
                url: '/to-do',
                templateUrl: 'features/to-do/toDo.html',
                controller: 'toDoController',
                controllerAs: 'todo',
            })
            
            .state('verification', {
                url: '/emailVerified',
                templateUrl: 'features/emailVerification/email-verification.html',
            })
            
            // sensitive page:
            .state('studentconfirminfo', {
                url:'/studentConfirmation/:id',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(ProfileService,reviewRegService,$location,$stateParams,$window)
                    {
                        var profile;
                        var profile_check = {};
                        
                        // check if user is allowed to view this page
                        ProfileService.loadProfile().then(function(data)
                        {
                            // authenticated user
                            if (data)
                            {
                                profile = data;
                            }

                            // guest user
                            else {
                                //alert("found guest, redir to login");
                                
                                swal({   
                                    title: "Please Login!",   
                                    text: "Please login to your account before joining a new project.",   
                                    type: "info",   
                                    confirmButtonText: "Okay" ,
                                    allowOutsideClick: false,
                                    timer: 60000,
                                }
                                );

                                $window.sessionStorage.setItem('lr', "studentconfirminfo");
                                $location.path("login").replace();
                            }
                        });                        
                    }
                },
                templateUrl: 'features/apply-to-project/StudentConfirmInfo.html',
                controller: 'projAppCtrl',
                controllerAs: 'projApp'
            })
            
            // sensitive function
            .state('projectProposal', {
                url:'/project-proposal',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(ProfileService,reviewRegService,$location,$stateParams,$window)
                    {
                        var profile;
                        var profile_check = {};
                        
                        // check if user is allowed to view this page
                        ProfileService.loadProfile().then(function(data)
                        {
                            // authenticated user
                            if (data)
                            {
                                profile = data;
                                
                                // students cannot submit proposals, only Pi/CoPi and Faculty/Staff
                                if (profile.userType == "Student")
                                {
                                    swal({
                                        title: "Error!",   
                                        text: "Your account doesn't have permission to propose a new project.",   
                                        type: "info",   
                                        confirmButtonText: "Okay" ,
                                        allowOutsideClick: false,
                                        timer: 60000,
                                    });

                                    $location.path("/").replace();
                                    $window.location.href = "/#/";
                                }
                            }

                            // guest user
                            else {
                                //alert("found guest, redir to login");
                                
                                swal({   
                                    title: "Please Login!",   
                                    text: "Please login to your account before proposing a new project.",   
                                    type: "info",   
                                    confirmButtonText: "Okay" ,
                                    allowOutsideClick: false,
                                    timer: 60000,
                                }
                                );

                                $window.sessionStorage.setItem('lr', "project-proposal");
                                $location.path("login").replace();
                            }
                        });                        
                    }
                },
                templateUrl: 'features/project-proposals/projectProposal.html',
                controller: 'ProjectProposalController',
                controllerAs: 'project',
                params: { id: null }
            })
			
			.state('proxy', {
                url:'/proxy',
				templateUrl:'features/main-page/home.html',
                controller: function($window) {
					console.log("Hit Proxy!");
					var url = $window.sessionStorage.getItem('lr');
					if (url) {
						$window.sessionStorage.setItem('lr', null);
						$window.location = "/#/" + url;
					}
					else {
						$window.location = "/#/";
					}
				}
            })

            // sensitive function
            .state('verifyuser', {
                url: '/verifyuser/:user_id',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(ProfileService,reviewRegService,$location,$stateParams,$window)
                    {
                        var profile;
                        var profile_check = {};
                        
                        // check if user is allowed to view this page
                        ProfileService.loadProfile().then(function(data)
                        {
                            if (data) {
                                profile = data;
                                
                                // redirect if user is not a Pi, or if a decision has been made
                                if (profile.userType != "Pi/CoPi") {
                                    //alert("only Pi is allowed to view this page, redir to home");
                                    
                                    swal({   
                                        title: "Error",   
                                        text: "You don't have permission to view this page!",   
                                        type: "info",   
                                        confirmButtonText: "Exit" ,
                                        allowOutsideClick: false,
                                        timer: 60000,
                                    }
                                    );
                                    
                                    $location.path("/").replace();
                                    $window.location.href = "/#/";
                                }
                            }
                            else {
                                //alert("found guest, redir to login");
                                
                                swal({   
                                    title: "Error",   
                                    text: "You don't have permission to view this page!",   
                                    type: "info",   
                                    confirmButtonText: "Exit" ,
                                    allowOutsideClick: false,
                                    timer: 60000,
                                }
                                );
                                
                                $location.path("login").replace();
								$window.sessionStorage.setItem('lr', 'verifyuser/' + $stateParams.user_id);
                                $window.location.href = "/#/login";
                            }
                        });
                        
                        // check if a decision has already been made for this user, if it has, redir to home
                        reviewRegService.getReg($stateParams.user_id).then(function(data)
                        {
                            profile_check = data;
                            
                            // user_id is invalid and the user doesnt exist in our database. so, inform the Pi the link is invalid
                            if (profile_check == "Invalid link. User cannot be verified.")
                            {                                
                                swal({
                                    title: "User Not Found",   
                                    text: "Dear Pi, this user doesn't appear to be registered in the database, or the URL is invalid.",   
                                    type: "info",   
                                    confirmButtonText: "Continue" ,
                                    allowOutsideClick: true,
                                    timer: 60000,
                                }
                                );
                                
                                $location.path("/").replace();
                                $window.location.href = "/#/";
                                
                            }

                            // needs to redirect to a page thats says the account has already been accepted/rejected
                            if (profile_check.isDecisionMade)
                            {
                                
                                swal({   
                                    title: "No Action Required",   
                                    text: "Dear Pi, a decision has already been made to accept/reject this user's account.",   
                                    type: "info",   
                                    confirmButtonText: "Continue" ,
                                    allowOutsideClick: true,
                                    timer: 60000,
                                }
                                );
                                
                                $location.path("/").replace();
                                $window.location.href = "/#/";
                            }

                        });
                        
                    }
                },
                templateUrl: 'features/reviewRegistration/reviewRegistration.html',
                controller: 'reviewController',
                controllerAs: 'vm',
            })

            // sensitive function, grant access to Pi/CoPi only
            // purpose: approves/rejects profile changes such as userType/rank
            .state('verifyprofile', {
                url: '/verifyprofile/:user_id',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(reviewProfileService,ProfileService,$location,$stateParams,$window)
                    {
                        
                        //alert("Requsted user ID = " + $stateParams.user_id);
                        ////alert("Requsted user = " + vm.profile.requested_rank);
                        
                        //alert("entered check function");
                        console.log("entered check function");
                        
                        var profile;
                        var vm = {};
                        
                        // check if the user attempting to view the reviewProfile page has permissions to do so
                        ProfileService.loadProfile().then(function(data)
                        {
                            console.log("loadProfile() success");
                            //alert("loadProfile() success");
                            if (data)
                            {
                                profile = data;
                                
                                console.log("loadProfile() usertype is " + profile.userType);
                                //alert("loadProfile() usertype is " + profile.userType);
                                
                                // redirect if user is not a Pi, or if a decision has been made
                                if (profile.userType != "Pi/CoPi")
                                {
                                    $location.path("/").replace();
                                    $window.location.href = "/#/";
                                }
                            }
                            else {
                                //alert("User not authorized, redirecting to login");
                                $location.path("login").replace();
								$window.sessionStorage.setItem('lr', 'verifyProfile/' + $stateParams.user_id);
                                $window.location.href = "/#/login";
                            }
                        });
                        
                        // user has permission to view the reviewProfile page
                        // now, check if there are any profile requested made by the user_id
                        reviewProfileService.getReg($stateParams.user_id).then(function(data)
                        {
                            vm.profile = data;
                            
                            //alert("Requ user name = " + vm.profile.email);
                            //alert("Requ user = " + vm.profile.requested_userType);
                            //alert("Requ rank = " + vm.profile.requested_rank);
                            
                            // no usertype or rank updates, so no changes to be made
                            if (vm.profile.requested_rank == null && vm.profile.requested_userType == null)
                            {
                                //$window.location.href = "/";
                                //alert("user has no pending profile changes!");
                                
                                // TODO: Redirect to a page that says that this user has no pending profile request changes to be approved/denied
                                $location.path("/").replace();
                                $window.location.href = "/#/";
                            }
                        });
                    }
                },
                templateUrl: 'features/reviewProfile/reviewProfile.html',
                controller: 'reviewProfileController',
                controllerAs: 'vm'
            })

			.state('loginError', {
                url: '/login/error',
                templateUrl: 'features/login/loginError.html'
            }).state('loginErrorPI', {
                url: '/login/error_pi',
                templateUrl: 'features/login/loginPI.html'
            })
			.state('loginErrorEmail', {
                url: '/login/error_email',
                templateUrl: 'features/login/loginEmail.html'
            }).state('loginErrorNon', {
                url: '/login/error_non',
                templateUrl: 'features/login/loginNon.html'
            })

			.state('reviewuser', {
                url: '/reviewuser',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(ProfileService,$location,$stateParams,$window)
                    {
                        var profile;
                        
                        ProfileService.loadProfile().then(function(data)
                        {
                            // user is logged in, check perms
                            if (data)
                            {
                                profile = data;
                                if (profile.userType == "Student")
                                {
                                    //$location.path("/");
                                    //alert("students arent allowed to view this page, redir to home");
                                    $location.path('/');
                                    $window.location.href = "/#/";
                                }
                            }
                            
                            // guest user, redirect to login
                            else
                            {
                                //$location.path("login");
                                //alert("found guest, redir to login");
                                $location.path('login');
								$window.sessionStorage.setItem('lr', 'reviewuser');
                                $window.location.href = "/#/login";
                            }
                        });
                    }
                },
                templateUrl: 'features/reviewStudentApplications/reviewStudentApp.html',
				controller: 'reviewStudentAppController',
				controllerAs: 'vm'
            })
			
            // sensitive function
			.state('reviewproject', {
                url: '/reviewproject',
                resolve:{
                    //function to be resolved, accessFac and $location Injected
                    "check":function(ProfileService,$location,$stateParams,$window)
                    {
                        var profile;
                        
                        ProfileService.loadProfile().then(function(data)
                        {
                            // user is logged in, check perms
                            if (data)
                            {
                                profile = data;
                                if (profile.userType == "Student" || profile.userType == "Staff/Faculty")
                                {
                                    //$location.path("/");
                                    //alert("students/faculty/staff arent allowed to view this page, redir to home");
                                    $location.path('/');
                                    $window.location.href = "/#/";
                                }
                            }
                            
                            // guest user, redirect to login
                            else
                            {
                                //$location.path("login");
                                //alert("found guest, redir to login");
                                $location.path('login');
								$window.sessionStorage.setItem('lr', 'reviewproject');
                                $window.location.href = "/#/login";
                            }
                        });
                    }
                },
                templateUrl: 'features/reviewProjectProposals/reviewProjectProposals.html',
				controller: 'reviewProjectController',
				controllerAs: 'vm'
            })

            .state('viewProfile', {
                url: '/userprofile/:user_id/:project_id',
                templateUrl: 'features/view-profile/view-profile.html',
                controller: 'viewProfileController',
                controllerAs: 'vm'
            })

			
			.state('admin', {
                url: '/adminpanel',
                templateUrl: 'features/admin-panel/admin.html',
                controller: 'adminController',
                controllerAs: 'vm'
            })
            
			.state('message', {
                //url: '/sendmessage',
                url: '/sendmessage/:user_id/:is_reply_to_email/:original_subject',
                templateUrl: 'features/messenger/Messenger.html',
                controller: 'MessengerController',
                controllerAs: 'vm'
            })
			
        });
