
angular.module('ProjectProposalController', ['ProjectProposalService', 'userService','toDoModule'])
    .controller('ProjectProposalController', function($window,$location,$scope, User, ProfileService, ProjectService, ToDoService, $stateParams){

		var profile;
		
		ProfileService.loadProfile().then(function(data){
					if (data) {
						profile = data;
						if (profile.userType == "Student") {
							$location.path("/");
						}
					}
					else {
						profile = null;
						$location.path("login");
					}
		});

        $scope.colleges= [
            {
                name: 'Architecture & The Arts',
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

        $scope.fixedColleges = $scope.colleges;

        for(school in $scope.fixedColleges){
            var name = $scope.fixedColleges[school]['name']
            var fixedNames = name.split(' ').join('_');
            fixedNames = fixedNames.split('&').join('and');
            //console.log(fixedNames);
            $scope.fixedColleges[school]['name'] = fixedNames;
        };

        var vm = this;
        vm.title = "";
        vm.image = ""
        vm.description = "";
        vm.disciplines = [];
        vm.editingMode = false;
        //$scope.project.submit = submit;

        init();
        function init () {
            if($stateParams.id != null){
                vm.id = $stateParams.id;
                vm.editingMode = true;
                getProjectById();
            }
        }



        function getProjectById (){
            ProjectService.getProject(vm.id).then(function(data){
                $scope.project = data;
            });
        }

        $scope.save = function save() {
			
			$scope.project.owner = profile._id; // Set the project owner to the person who proposed the project used later for contacting the faculty member.
			$scope.project.owner_email = profile.email;
			$scope.project.owner_rank = profile.userType;
			$scope.project.owner_name = profile.firstName + " " + profile.lastName;
			var obj = document.getElementById('teamImage');
			if (obj.files.length == 0) {
				    $scope.project.image = "";
					if(!vm.editingMode){
							$scope.project.status='pending'
							ProjectService.createProject($scope.project)
								.then(function(data){
									success_msg();
                                    
									var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "#" };
									ToDoService.createTodo(todo).then(function(success)  {
										
									}, function(error) {
										
									});
									var email_msg = 
									{
										recipient: profile.email, 
										text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.title + ". Your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
										subject: "Project Proposal Submission Pending", 
										recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu", 
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project by visiting the following link - http://vip.fiu.edu/#/reviewproject/", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
								}, function (error) {
									$scope.result = "An Error Occured Whilst Submitting Project Proposal! REASON: " + error.data;
								});
					}
					else{
							$scope.project.id = $stateParams.id
							ProjectService.editProject($scope.project, $stateParams.id)
								.then(function(data){
									success_msg();
									var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "#" };
									ToDoService.createTodo(todo).then(function(success)  {
										
									}, function(error) {
										
									});
									
									var email_msg = 
									{
										recipient: profile.email, 
										text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.title  + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
										subject: "Project Proposal Submission Pending", 
										recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu", 
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. You can do this by logging into VIP.", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
									
								}, function(error) {
									$.scope.result = "An Error Occured Whilst Submitting Project Proposal!";
								});
					}
			}
			else {
				var f = obj.files[0],
				r = new FileReader();
				r.onloadend = function(e){
					var dataURL = e.target.result;

					$scope.project.image = dataURL;
					if(!vm.editingMode){
							$scope.project.status='pending'
							ProjectService.createProject($scope.project)
								.then(function(data){
									success_msg();
									var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "#" };
									ToDoService.createTodo(todo).then(function(success)  {
										
									}, function(error) {
										
									});
									var email_msg = 
									{
										recipient: profile.email, 
										text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.title  + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
										subject: "Project Proposal Submission Pending", 
										recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu",   
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. You can do this by logging into VIP.", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
								}, function (error) {
									error_msg();
								});
					}
					else{
							$scope.project.id = $stateParams.id
							ProjectService.editProject($scope.project, $stateParams.id)
								.then(function(data){
									success_msg();
									var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "/#/to-do" };
									ToDoService.createTodo(todo).then(function(success)  {
										
									}, function(error) {
										error_msg();
										
									});
									var email_msg = 
									{
										recipient: profile.email, 
										text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.s  + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
										subject: "Project Proposal Submission Pending", 
										recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu",  
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. You can do this by logging into VIP.", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
								}, function(error) {
									error_msg();
								});
					}

				}
				r.readAsDataURL(f);
			}
        };

        $scope.toggleCheckbox = function toggleSelection(majors) {
            var idx = vm.disciplines.indexOf(majors);

            // is currently selected
            if (idx > -1) {
              vm.disciplines.splice(idx, 1);
            }

            // is newly selected
            else {
              vm.disciplines.push(majors);
            }
        };
		
		 function error_msg()
         {
            swal({   
                title: "Oops!",   
                text: "An uknown error has occured!",   
                type: "warning",   
                confirmButtonText: "Ok" ,
                allowOutsideClick: true,
                timer: 7000,
            }, function () {
                $window.location.reload();
            }
            );
        };

        function success_msg()
         {
            swal({   
                title: "Project Proposed!",   
                text: "Thank you for submitting your wonderful idea. A PI/Co-PI will now review it and notify you if it is accepted",   
                type: "success",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 9000,
            }, function () {
                $window.location.reload();
            }
            );
        };
    });