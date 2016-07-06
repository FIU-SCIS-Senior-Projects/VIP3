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
                templateUrl: 'features/contact/contact.html'
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

            .state('checkLogin', {
                url:'/checkLogin',
                templateUrl: 'features/checkLogin/loginTemplate.html'
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
                    "check":function(ProfileService,$location,$stateParams,$window)
                    {
                        var profile;
                        
                        ProfileService.loadProfile().then(function(data)
                        {
                            if (data) {
                                profile = data;
                                
                                //alert("Usertype found is " + profile.userType);
                                
                                // if the user is a PI or Faculty member, render the page
                                if (profile.userType == "Pi/CoPi" || profile.userType == "Student") {
                                    //alert("User type is " + profile.userType + " and user is allowed to view this page");
                                }
                                
                                // otherwise, the user doesnt have permission, so show homepage instead
                                else
                                {
                                    //alert("User type is Faculty/Staff, redirecting to home page");
                                    $location.path('/').replace();
                                    $window.location.href = "/#/";
                                }
                            }
                            
                            // handler for guest - redirect them to login, store cookie
                            else {
                                //alert("guest user found, redirecting to login");
                                $location.path('login').replace();
                                $window.location.href = "/#/login";
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
                                    $location.path('/').replace();
                                    $window.location.href = "/#/";
                                }
                            }
                            
                            // guest user, redirect to login
                            else
                            {
                                //$location.path("login");
                                //alert("found guest, redir to login");
                                $location.path('login').replace();
                                $window.location.href = "/#/login";
                            }
                        });
                    }
                },
                templateUrl: 'features/project-proposals/projectProposal.html',
                controller: 'ProjectProposalController',
                controllerAs: 'project',
                params: { id: null }
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
                                    $location.path("/").replace();
                                    $window.location.href = "/#/";
                                }
                            }
                            else {
                                //alert("found guest, redir to login");
                                $location.path("login").replace();
                                $window.location.href = "/#/login";
                            }
                        });
                        
                        // check if a decision has already been made for this user, if it has, redir to home
                        reviewRegService.getReg($stateParams.user_id).then(function(data)
                        {
                            profile_check = data;

                            if (profile_check.isDecisionMade)
                            {
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
            })
			
            // sensitive function
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
                url: '/userprofile/:user_id',
                templateUrl: 'features/view-profile/view-profile.html',
                controller: 'profileController',
                controllerAs: 'vm'
            })
        });
