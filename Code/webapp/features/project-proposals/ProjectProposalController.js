var image;


function uploadImage2() {
			
			var obj = document.getElementById('teamImage');
			var pI = document.getElementById('pI');
			pI.max = 100;
			pI.value = 0;	
			if (obj.files.length == 0) 
			{
					
			}
			else 
			{
				pI.style.visibility = "visible";
			
				var f = obj.files[0];
				var r = new FileReader();
				r.onprogress = function(event) {
					if (event.lengthComputable) {
						pI.max = event.total;
						pI.value = event.loaded;
					}
				};
				r.onloadend = function(e)
				{
					
					var dataURL = e.target.result;
					image = dataURL;
					
				}
				r.readAsDataURL(f);
			}
};


angular.module('ProjectProposalController', ['ProjectProposalService', 'userService','toDoModule'])
    .controller('ProjectProposalController', function($window,$location,$scope, User, ProfileService, ProjectService, ToDoService, $stateParams, $rootScope){
        
		
		var profile;
		var vm = this;
		$scope.done = false;
        
        // check permissions and get data
		ProfileService.loadProfile().then(function(data)
        {
            if (data)
            {
                profile = data;
                
                // students cannot submit proposals, only Pi/CoPi and Faculty/Staff
                if (profile.userType == "Student")
                {
                    $location.path("/").replace();
                    $window.location.href = "/#/";
                }
                
                $scope.done = true;
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
            ////console.log(fixedNames);
            $scope.fixedColleges[school]['name'] = fixedNames;
        };

        
        vm.title = "";
        vm.image = "";
        vm.description = "";
        vm.disciplines = [];
        vm.editingMode = false;
        //$scope.project.submit = submit;
		
		var faculty;
		$scope.updateFacultyEmails = updateFacultyEmails;
		$scope.updateFacultyNames = updateFacultyNames;
		$scope.updateMentorEmails = updateMentorEmails;
		$scope.updateMentorNames = updateMentorNames;
		$scope.updateStudentNames = updateStudentNames;
		$scope.updateStudentEmails = updateStudentEmails;

        init();
        function init () {
            if($stateParams.id != null){
                vm.id = $stateParams.id;
                vm.editingMode = true;
                getProjectById();
            }
        }

		var old_project = null;

        function getProjectById (){
            ProjectService.getProject(vm.id).then(function(data){
                $scope.project = data;
				old_project = JSON.parse(JSON.stringify(data)); // Make a new reference to avoid a circular reference.
				$scope.SelectedFacultyNames = "";
				$scope.SelectedMentorNames = "";
				$scope.SelectedStudentNames = "";
				$scope.SelectedFacultyEmails = "";
				$scope.SelectedMentorEmails = "";
				$scope.SelectedStudentEmails = "";
				for(i = 0; i < $scope.project.faculty.length; i++) {
					if (i != $scope.project.faculty.length - 1) {
						$scope.SelectedFacultyNames += $scope.project.faculty[i].name + ", ";
						$scope.SelectedFacultyEmails += $scope.project.faculty[i].email + ", ";
					}
					else {
						$scope.SelectedFacultyNames += $scope.project.faculty[i].name;
						$scope.SelectedFacultyEmails += $scope.project.faculty[i].email;
					}
				}
				for(i = 0; i < $scope.project.mentor.length; i++) {
					if (i != $scope.project.mentor.length - 1) {
						$scope.SelectedMentorNames += $scope.project.mentor[i].name + ", ";
						$scope.SelectedMentorEmails += $scope.project.mentor[i].email + ", ";
					}
					else {
						$scope.SelectedMentorNames += $scope.project.mentor[i].name;
						$scope.SelectedMentorEmails += $scope.project.mentor[i].email;
					}
				}
				for(i = 0; i < $scope.project.addedStudents.length; i++) {
					if (i != $scope.project.addedStudents.length - 1) {
						$scope.SelectedStudentNames += $scope.project.addedStudents[i].name + ", ";
						$scope.SelectedStudentEmails += $scope.project.addedStudents[i].email + ", ";
					}
					else {
						$scope.SelectedStudentNames += $scope.project.addedStudents[i].name;
						$scope.SelectedStudentEmails += $scope.project.addedStudents[i].email;
					}
				}
				
            });
        }

        $scope.save = function save() {

			// loading();
			
			updateFaculty();
			updateMentor();
			updateStudent();
			
			
			if (!$scope.project.owner_name && !$scope.project.owner_email) {
				$scope.project.owner = profile._id;
				$scope.project.owner_name = profile.firstName + " " + profile.lastName;
				$scope.project.owner_email = profile.email;
			}
			else {
				$scope.project.owner = "";
			}
			
		
            
            $scope.project.video_url = ProcessVideoURL($scope.project.video_url);

			if (image) 
				$scope.project.image = image;
            
			else
				$scope.project.image = "http://www.woojr.com/wp-content/uploads/2009/04/" + $scope.project.title.toLowerCase()[0] + ".gif";
			
			if(!vm.editingMode){
					
					$scope.project.status='pending';
					ProjectService.createProject($scope.project)
						.then(function(data){
							success_msg();
							
							var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "/#/to-do" };
							ToDoService.createTodo(todo).then(function(success)  {
								
							}, function(error) {
								
							});
							var todo2 = {owner: "Pi/CoPi", todo: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval.", type: "project", link: "/#/reviewproject" };
							ToDoService.createTodo(todo2).then(function(success)  {
								
							}, function(error) {
								
							});
							
							var email_msg = 
							{
								recipient: profile.email, 
								text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.title  + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
								subject: "Project Proposal Submission Pending", 
								recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu", 
								text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. Approve Projects Here: http://vip.fiu.edu/#/reviewproject", 
								subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
							};

							User.nodeEmail(email_msg);
						}, function (error) {
							$scope.result = "An Error Occured Whilst Submitting Project Proposal! REASON: " + error.data;
						});
			}
			else {	
					if (old_project) {
						$scope.project.old_project = old_project;
					}
					$scope.project.status='modified';
					console.log("req_video_url modified " + $scope.project.video_url);
                    
                    // if user has uploaded a new image, 'image' var will be non-null, so update image via API
                    if (image) 
                        $scope.project.image = image;
                    
                    // user hasnt uploaded a new image, set 'image' val to "", so API can know not to change it
                    else
                        $scope.project.image = "";
                    
					$scope.project.id = $stateParams.id;
					$scope.project.edited = true;
					ProjectService.editProject($scope.project, $stateParams.id)
						.then(function(data){
							success_msg();
							var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for editing the project proposal titled " + $scope.project.title + ". Your changes are currently under review, and you will be notified as soon as a decision to approve/deny them has been made. If you have any question contact the PI.", type: "project", link: "/#/to-do" };
							ToDoService.createTodo(todo).then(function(success)  {
								
							}, function(error) {
								
							});
							var todo2 = {owner: "Pi/CoPi", todo: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has edited an existing project titled: " + $scope.project.title +  ", please approve or deny the changes that were made.", type: "project", link: "/#/reviewproject" };
							ToDoService.createTodo(todo2).then(function(success)  {
								
							}, function(error) {
								
							});
							
							// email should indicate that the project has been modified, not that it's a new proposal
							var email_msg = 
							{
								recipient: profile.email, 
								text: "Dear " + profile.firstName + ", please be patient while the edits that you have proposed for the project " + $scope.project.title + " are reviewed. Once a decision has been made to approve/reject your edits, you will be notified again via email.\n\nProject:" + $scope.project.title + "\nStatus: Modified-PendingReview" , 
								subject: "Proposed Edits for " + $scope.project.title + " are being Reviewed", 
								recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu",
								subject2: "Faculty Has Edited the Existing Project " + $scope.project.title,
								text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has edited the existing project " + $scope.project.title +  ". Please review the edits to the project, and approve/deny the project by visiting the following link - http://vip.fiu.edu/#/reviewproject/"
							};

							User.nodeEmail(email_msg);
							
						}, function(error) {
							$.scope.result = "An Error Occured Whilst Submitting Project Proposal!";
						});
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
		
		var facultyname;
		var facultyemail;
		function updateFacultyNames(nameList)
		{
			if (nameList)
			{
				var names = nameList.split(', ');
				console.log(names);
				var temp = [];
				names.forEach(function (obj)
				{
					temp.push(obj);
				});
				facultyname = temp;
			}
			else {
				facultyname = null;
			}

		}
		
		
		function updateFacultyEmails(emailList)
		{
			if (emailList){
				var emails = emailList.split(', ');
				console.log(emails);
				var temp = [];
				emails.forEach(function (obj)
				{
					temp.push(obj);
				});
				facultyemail = temp;
			}
			else {
				facultyemail = null;
			}
		}
		
		function updateFaculty()
		{
			if (facultyname && facultyemail)
			{
				$scope.project.faculty = [];
				for (var i = 0; i < facultyname.length; i++)
				{
					if ($scope.project.faculty)
					{
						$scope.project.faculty.push({name: facultyname[i], email: facultyemail[i]});
					}
					else
					{
						$scope.project.faculty = [{name: facultyname[i], email: facultyemail[i]}];
					}
				}
			}
			else {
				$scope.project.faculty = [];
			}
		}
		
		var mentorname;
		var mentoremail;
        
		function updateMentorNames(nameList)
		{
			if (nameList)
			{
				var names = nameList.split(', ');
				console.log(names);
				var temp = [];
				names.forEach(function (obj)
				{
					temp.push(obj);
				});
				mentorname = temp;
			}
			else {
				mentorname = null;
			}
		}
		
		
		function updateMentorEmails(emailList)
		{
			if (emailList){
				var emails = emailList.split(', ');
				console.log(emails);
				var temp = [];
				emails.forEach(function (obj)
				{
					temp.push(obj);
				});
				mentoremail = temp;
			}
			else {
				mentoremail = null;
			}
		}
		
		function updateMentor()
		{
			if (mentorname && mentoremail)
			{
				$scope.project.mentor = [];
				for (var i = 0; i < mentorname.length; i++)
				{
					if ($scope.project.mentor)
					{
						$scope.project.mentor.push({name: mentorname[i], email: mentoremail[i]});
					}
					else
					{
						$scope.project.mentor = [{name: mentorname[i], email: mentoremail[i]}];
					}
				}
			}
			else {
				$scope.project.mentor = [];
			}
		}

		
		var studentname;
		var studentemail;
        
		function updateStudentNames(nameList)
		{
			if (nameList)
			{
				var names = nameList.split(', ');
				console.log(names);
				var temp = [];
				names.forEach(function (obj)
				{
					temp.push(obj);
				});
				studentname = temp;
			}
			else {
				studentname = null;
			}
		}
		
		function updateStudentEmails(emailList)
		{
			if (emailList){
				var emails = emailList.split(', ');
				console.log(emails);
				var temp = [];
				emails.forEach(function (obj)
				{
					temp.push(obj);
				});
				studentemail = temp;
			}
			else {
				studentemail = null;
			}
		}
		
		function updateStudent()
		{
			if (studentname && studentemail)
			{
				$scope.project.addedStudents = [];
				for (var i = 0; i < studentname.length; i++)
				{
					if ($scope.project.addedStudents)
					{
						$scope.project.addedStudents.push({name: studentname[i], email: studentemail[i]});
					}
					else
					{
						$scope.project.addedStudents = [{name: studentname[i], email: studentemail[i]}];
					}
				}
			}
			else {
				$scope.project.addedStudents = [];
			}
		}

        //function updateProjectMembers()
        //{
        //	if($scope.project.owner_name && $scope.project.owner_email)
		//	{
		//		$scope.project.members = profile._id; 
		//		$scope.project.owner_email = profile.email;
		//		$scope.project.owner_rank = profile.userType;
		//		$scope.project.owner_name = profile.firstName + " " + profile.lastName;
		//	}
        //}
        
        function ProcessVideoURL(VideoURL)
        {
            // format the youtube videos correctly
            // input: https://www.youtube.com/watch?v=uQ_DHRI-Xp0
            // output: https://www.youtube.com/embed/uQ_DHRI-Xp0
			if (VideoURL)
            {
                // video is already embed format, return
                if (VideoURL.indexOf("youtube.com/embed/") > -1)
                {
                    return VideoURL;
                }
                
                // youtube.com universal filter
				if (VideoURL.indexOf("youtube.com") > -1)
				{                   
					videoID = VideoURL.substr(VideoURL.indexOf("?v=") + 3);
					updatedVideoURL = "https://www.youtube.com/embed/" + videoID;
					//console.log("Filtered url: " + updatedVideoURL);
					return updatedVideoURL;
				}
                
                // youtu.be filter
				else if (VideoURL.indexOf("youtu.be") > -1)
				{
					videoID = VideoURL.substr(VideoURL.indexOf(".be/") + 4);
					updatedVideoURL = "https://www.youtube.com/embed/" + videoID;
					//console.log("Filtered url: " + updatedVideoURL);
					return updatedVideoURL;
				}
				
				else
				{
					return VideoURL;
				}
			}
			else {
				return "";
			}
        }


    });