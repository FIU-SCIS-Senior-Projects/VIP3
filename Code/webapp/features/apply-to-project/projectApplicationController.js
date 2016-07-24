angular
    .module('projectApplicationController', ['ProjectProposalService','user-profile','toDoModule', 'userService', 'reviewProfile'])
    .controller('projAppCtrl',  function (ProjectService, ProfileService, ToDoService, User, reviewProfileService, $stateParams, $location, $window, $scope, $state, $document) {
        
        var vm = this;
		var profile;
		$scope.done = false;
		$scope.joinAs = "fac";
		
		ProfileService.loadProfile().then(function(data)
		{
			if (data) {
				
				
					vm.Colleges = [
					{
						name: 'Architecture + The Arts ',
						schools: [
							'Architecture',
							'Interior Architecture',
							'Landscape Architecture and Environmental Urban Design',
							'Art and Art History',
							'Communication Arts',
							'School of Music',
							'Theatre']
					},
					{
						name: 'Arts and Sciences & Education',
						schools: [
							'Biological Sciences',
							'Chemistry and Biochemistry',
							'Earth and Environment',
							'English',
							'Mathematics and Statistics',
							'Philosophy',
							'Physics',
							'Psychology',
							'Teaching and Learning',
							'Leadership and Professional Studies',
							'School of Education',
							'School of Enviroment, Arts & Society',
							'School of Integrated Science & Humanity'

						]
					},
					{
						name: 'Business',
						schools: [
							'Decision Sciences and Information Systems',
							'Alvah H. Chapman Jr. Graduate School of Business',
							'R. Kirk Landon Undergraduate School of Business',
							'Finance',
							'Management and International Business',
							'Marketing',
							'School of Accounting',
							'Real Estate'
						]
					},
					{
						name: 'Chaplin School of Hospitality and Tourism Management',
						schools: [
							'Hospitality and Tourism Management'
						]
					},
					{
						name: 'Engineering & Computing',
						schools: [
							'School of Computing and Information Sciences',
							'OHL School of Construction',
							'Department of Biomedical Engineering',
							'Department of Civil and Environment Engineering',
							'Department of Electrical and Computer Engineering',
							'Department of Mechanical and Materials Engineering'
						]
					},
					{
						name: 'Herbert Wertheim College of Medicine',
						schools: [
							'Cellular Biology and Pharmacology',
							'Human and Molecular Genetics',
							'Immunology',
							'Medical and Population Health Sciences Research'
						]
					},
					{
						name: 'Journalism and Mass Communication',
						schools: [
							'Advertising and Public Relations',
							'Journalism Broadcasting and Digital Media'
						]
					},
					{
						name: 'Law',
						schools: [
							'College of Law'
						]
					},
					{
						name: 'Nicole Wertheim College of Nursing & Health Sciences',
						schools: [
							'Biostatistics',
							'Dietetics and Nutrition',
							'Environmental and Occupational Health',
							'Epidemiology',
							'Health Policy and Management',
							'Health Promotion and Disease Prevention'
						]

					},
					{
						name: 'Robert Stempel College of Public Health & Social Work',
						schools: [
							'School of Social Work'
						]
					},
					{
						name: 'Steven J. Green School of International and Public Affairs',
						schools: [
							'Criminal Justice',
							'Economics',
							'Global and Sociocultural Studies',
							'History',
							'Modern Languages',
							'Public Administration',
							'Religious Studies'
						]
					}
				];

				vm.genders = ['Male', 'Female'];
				vm.semesters = ['Fall 2016', 'Spring 2017', 'Summer 2017'];

				
				
				vm.selectedCollege = vm.Colleges.find(function (element) {
					return element.name === data.college;
				});;
						
				$scope.done = true;
				profile = data;
				vm.user_info = data.firstName;
				vm.user_type = data.userType;
				vm.firstName = data.firstName;
				vm.type = data.userType;
				vm.lastName = data.lastName;
				vm.gender = data.gender;
				vm.email = data.email;
				vm.pID = data.pantherID;
				vm.rank = data.rank;
				vm.school = data.department;
				vm.college = data.college;
				vm.semester = "1";
				vm.google = data.google;
				vm.profile = data;
				
			}
			else {
				$scope.done = true;
				//$window.sessionStorage.setItem('lr', 'studentConfirmation/');
				//$location.path('login');
				vm.semesters = ['Fall 2016', 'Spring 2017', 'Summer 2017'];
				$scope.guest = true;
			}
		});

        

        

        init();
        function init () {
            loadData();
        }

        function loadData(){
            ProjectService.getProjects().then(function(data){
                vm.projects = data;
                if($stateParams.id){
					//alert("found some ID");
					//alert(vm.id);
                    vm.id = $stateParams.id;
                    getProjectById(vm.projects);
                } else {
                    vm.sProject = null;
                    //alert($stateParams.id);
                    //alert(vm.id);
                }
            });
        }
        function getProjectById (projects){
            ProjectService.getProject(vm.id).then(function(data){

                projects.forEach( function (project)
                {
                    if(data._id === project._id)
                    {
                        vm.sProject = project;
                    }
                });
            });
        }
		
		
				
       


        vm.save = function() {
			
			loading();
			
			if (!$scope.guest) {
			
				vm.profile.rank = vm.rank;
				reviewProfileService.updateProfile(vm.profile).then(function(data){
				});
				var project = vm.sProject;
				
				
				if (vm.join_type) {
					if (vm.join_type == 'Mentor') {
						if (project.mentor) {
								for (i = 0; i < project.mentor.length; i++) {
									if (project.mentor[i].email === vm.email) {
										 error_msg();
										return;
									}
								}
								project.mentor.push({name: profile.firstName + " " + profile.lastName, email: profile.email});
							
						}
						else {
							if (vm.name && vm.email2) {
								project.mentor = [{name: profile.firstName + " " + profile.lastName, email: profile.email}];
							}
							else {
								alert('Please enter a name and a valid email this is required!');
								return;
							}
						}
					}
					else {
						if (project.faculty) {
								for (i = 0; i < project.faculty.length; i++) {
									if (project.faculty[i].email === vm.email) {
										 error_msg();
										return;
									}
								}
								project.faculty.push({name: profile.firstName + " " + profile.lastName, email: profile.email});
							
							
						}
						else {
							
								project.faculty = [{name: profile.firstName + " " + profile.lastName, email: profile.email}];
							
						}
					}
					
					profile.joined_project = false;
					User.update({user: profile});
					
					ProjectService.editProject(project,project._id).then(
						   function(response){
							 // success callback
							 success_msg();
							
							
							var email_msg = 
							{
								recipient: profile.email, 
								text: "Dear " + profile.firstName + " " + profile.lastName + ", thank you for applying to " + project.title + ", as either a faculty or mentor please register an account using the same email as soon as possible so people who are signed into the website can see your profile.\n\nProject: " + project.title + "\nStatus: Approved", 
								subject: "Faculty/Mentor Application Successfull", 
								recipient2: "sadjadi@cs.fiu.edu,mtahe006@fiu.edu,dlope073@fiu.edu,vlalo001@fiu.edu", 
								text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has applied to project as a mentor or faculty you can remove this person off the project if he or she isn't authorized to join project.", 
								subject2: "Faculty/Mentor has joined " + project.title 
							};
							User.nodeEmail(email_msg);

							// // refresh the page after 3 seconds so the user can see the message
							// setTimeout(function () { location.reload(true); }, 7000);
					   }, 
					   function(response){
						  msg("Cannot Apply Reason:", response.data);
					   }
					);
				}
				else {
				
				
				
					for (i = 0; i < project.members.length; i++) {
						if (project.members[i] === vm.email) {
							 error_msg();
							return;
						}
					}
					for (i = 0; i < project.members_detailed.length; i++) {
						if (project.members_detailed[i] === (profile.firstName + " " + profile.lastName)) {
							 error_msg();
							return;
						}
					}
					
					profile.joined_project = false;
					User.update({user: profile});
					
					project.members[project.members.length] = vm.email;
					project.members_detailed[project.members_detailed.length] = profile.firstName + " " + profile.lastName;
					ProjectService.editProject(project,project._id).then(
						   function(response){
							 // success callback
							 success_msg();
							 var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for applying for the project titled " + project.title + ". You will have to be approved first so please check for future notifaction and emails regarding the status of joining the project.", type: "personal", link: "#" };
							ToDoService.createTodo(todo).then(function(success)  {
								
							}, function(error) {
								
							});
							
							var email_msg = 
							{
								recipient: profile.email, 
								text: "Dear " + profile.firstName + ", thank you for applying to " + project.title + " you are currently pending and this is just a confirmation that you applied to the project please keep checking the VIP to-do or your email as the PI will approve or deny your request to join the project.\n\nProject: " + project.title + "\nStatus: Pending", 
								subject: "Project Application Submission Pending", 
								recipient2: "sadjadi@cs.fiu.edu,mtahe006@fiu.edu,dlope073@fiu.edu,vlalo001@fiu.edu", 
								text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has applied to project please approve him/her by logging into your VIP account and choosing student applications.", 
								subject2: "New Student Applied Has Applied To " + project.title 
							};
							User.nodeEmail(email_msg);

							// // refresh the page after 3 seconds so the user can see the message
							// setTimeout(function () { location.reload(true); }, 7000);
					   }, 
					   function(response){
						  msg("Cannot Apply Reason:", response.data);
					   }
					);
				}
			}
			else {
				var project = vm.sProject;
				
				if (vm.join_type) {
					if (vm.join_type == 'Mentor') {
						if (project.mentor) {
							if (vm.name && vm.email2) {
								
								for (i = 0; i < project.mentor.length; i++) {
									if (project.mentor[i].email === vm.email2) {
										 error_msg();
										return;
									}
								}
								
								project.mentor.push({name: vm.name, email: vm.email2});
							}
							else {
								alert('Please enter a name and a valid email this is required!');
								return;
							}
						}
						else {
							if (vm.name && vm.email2) {
								project.mentor = [{name: vm.name, email: vm.email2}];
							}
							else {
								alert('Please enter a name and a valid email this is required!');
								return;
							}
						}
					}
					else {
						if (project.faculty) {
							if (vm.name && vm.email2) {
								for (i = 0; i < project.faculty.length; i++) {
									if (project.faculty[i].email === vm.email2) {
										 error_msg();
										return;
									}
								}
								project.faculty.push({name: vm.name, email: vm.email2});
							}
							else {
								alert('Please enter a name and a valid email this is required!');
								return;
							}
						}
						else {
							if (vm.name && vm.email2) {
								project.faculty = [{name: vm.name, email: vm.email2}];
							}
							else {
								alert('Please enter a name and a valid email this is required!');
								return;
							}
						}
					}
				}
				else {
					alert('Please select the type of person you would like to join the project as!');
					return;
				}

				
				
				ProjectService.editProject(project,project._id).then(
					   function(response){
						 // success callback
						 success_msg();

						
						
						var email_msg = 
						{
							recipient: vm.email2, 
							text: "Dear " + vm.name + ", thank you for applying to " + project.title + ", as either a faculty or mentor please register an account using the same email as soon as possible so people who are signed into the website can see your profile.\n\nProject: " + project.title + "\nStatus: Approved", 
							subject: "Faculty/Mentor Application Successfull", 
							recipient2: "sadjadi@cs.fiu.edu,mtahe006@fiu.edu,dlope073@fiu.edu,vlalo001@fiu.edu", 
							text2: "Dear PI, " + vm.name  + " has applied to project as a mentor or faculty you can remove this person off the project if he or she isn't authorized to join project.", 
							subject2: "Faculty/Mentor has joined " + project.title 
						};
						User.nodeEmail(email_msg);

						// // refresh the page after 3 seconds so the user can see the message
						// setTimeout(function () { location.reload(true); }, 7000);
				   }, 
				   function(response){
					  msg("Cannot Apply Reason:", response.data);
				   }
				);
				
				
				
			}
			
        };
		
		function loading() {
			swal({   
               title: '',
			   text: 'Loading Please Wait...',
			   html: true,
			   timer: 10000,   
			   showConfirmButton: false
            }
            );
		}
		
		function msg(title, text) {
			swal({   
                title: title,   
                text: text,   
                type: "success",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                window.location.reload();
            }
            );
		}

         function success_msg()
         {
            swal({   
                title: "You've submitted your application!",   
                text: "Now please wait for approval by a Faculty member and you will be notified via email!",   
                type: "success",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                window.location.reload();
            }
            );
        };

        function error_msg()
         {
            swal({   
                title: "Sorry",   
                text: "You've already applied for this project or are already joined.",   
                type: "warning",   
                confirmButtonText: "Ok" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                window.location.reload();
            }
            );
        };
    });
