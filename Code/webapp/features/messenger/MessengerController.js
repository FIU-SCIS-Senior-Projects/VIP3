angular.module('MessengerController', ['ProjectProposalService', 'userService','toDoModule', 'MessengerService'])
    .controller('MessengerController', function($window,$location,$scope, User, ProfileService, ProjectService, ToDoService, $stateParams, MessengerService, reviewStudentAppService){
        
		var profile;
		var vm = this;

		ProfileService.loadProfile().then(function(data){
            if (data) {
                $scope.done = true;
                profile = data;
                if (profile.userType == "Student") {
                    //$location.path("/");
                    $location.path('/').replace();
                }
            }
            else {
                $scope.done = true;
                profile = null;
                //$location.path("login");
                $location.path('login').replace();
            }
		});
        
        vm.title = "";
        vm.image = ""
        vm.description = "";
        vm.projects;
        vm.disciplines = [];
        vm.editingMode = false;
        vm.sendMessage = deploy_email_message;
        vm.updateUsers = AddContacts;
        vm.clearUsers = ClearContacts;
        vm.users = null;
        
		vm.allusers; //All confirmed and unconfirmed users
		vm.unconfirmedusers;//Unconfirmed users (Email is not verified)
		vm.filteredusers; //filteredusers affected by filter function
		vm.filterUsers = filterUsers;
		vm.currentuserview;
		vm.currentview = currentview;
		
		//Out of scope functions
		vm.userinUnconfirmedfunc = userinUnconfirmedfunc;
        vm.getStudents = getStudents;
        vm.studentsEmailInSelectedProjects;
		
		//For out of scope variables:
		vm.userinusertype;
		vm.userinprojects;
		vm.usertypeinusertype;
		vm.projectinprojects;
		vm.userinunconfirmed;
        vm.messageAllUsers = messageAllUsers;
		
		vm.currentUser = function(user) { vm.cuser = user; }
		vm.currentProject = function(project) {  vm.cproject = project; }
		
        vm.usertype = ['Staff/Faculty' , 'Pi/CoPi', 'Student'];
		
		//Used for filters
		vm.getRank = getRank;
		vm.filteredrank; //Value changed by getRank function after a usertype is selected in filter
        vm.typeranks = [
            {
                name: 'Staff/Faculty',
                ranks: [
                    'Instructor',
                    'Assitant Professor',
                    'Associate Professor',
                    'Full Professor',
                    'Administrator',
                    'Director'

                ]
            },
            {
                name: 'Pi/CoPi',
                ranks: [
                    'PI',
                    'CoPI',
                    'Coordinator',
                    'External Member'
                ]
            },
            {
                name: 'Student',
                ranks: [
                    'Freshman',
                    'Sophmore',
                    'Junior',
                    'Senior',
                    'Masters',
                    'PhD',
                    'postDoc'
                ]
            }

        ];
        
        $scope.usersToMessage = "";
        $scope.MessageSubject = "Type the Subject of your Message here";
        $scope.MessageBody = "Type the Body of your Message here";
        
        my_id = $stateParams.user_id;
        
        //alert(my_id);

        init();
        
        function init () {            
            if (vm.users == null)
            {
                loadUsers();
            }
            
            //alert(vm.users);
            
			loadProjects();
        }
        
		//Load all user information
		function loadUsers()
		{
			var tempArray2 = [];
			MessengerService.loadAllUsers().then(function(data){
				vm.allusers = data;
				vm.allusers.forEach(function (obj)
				{
					tempArray2.push(obj);
                    
                    // if param with user's name is specified, cross reference the name to find the users email in the database
                    if (my_id != null)
                    {
                         //alert(my_id + " vs " + obj.firstName + " " + obj.lastName);
                         if (my_id == (obj.firstName + " " + obj.lastName))
                         {
                            //alert("found id " + my_id + " email is " + obj.email);
                            $scope.usersToMessage = obj.email;
                         }
                    }
                    
                    //alert(obj.email);
					if (obj.verifiedEmail == false)
					{
						tempArray2.pop();
					}
				});
				vm.users = tempArray2;
			});
        }
        
        function getStudents(SelectedProject)
        {
            //alert("entered function");
            if (SelectedProject)
            {
                //alert("not null SelectedProject");
                studentsArray = [];
                SelectedProject.members.forEach(function (obj)
                {
                    studentsArray.push(obj);
                    //alert(obj);
                    
                });
                vm.studentsEmailInSelectedProjects = studentsArray;
            }
        }
        
        // messages one particular user the user chooses in filters
        function AddContacts(email)
        {
            if (!$scope.usersToMessage.replace(/^\s+/g, '').length)
            {
                //alert("empty, adding");
                if (email)
                {
                    $scope.usersToMessage += email;
                }
            }
            
            else
            {
                //alert("else");
                if (email)
                {
                    $scope.usersToMessage += ", " + email;
                }
            }
         }
         
         // messages all filtered users
         function messageAllUsers()
         {
            vm.filteredusers.forEach(function (obj)
            {
                AddContacts(obj.email);
            });
         }
         
         function ClearContacts()
         {
             $scope.usersToMessage = '';
         }
         
		function getRank(usertype)
		{
			if (usertype)
			{
                vm.typeranks.forEach(function (obj)
                {
                    if (obj.name == usertype.name)
                    {
                        vm.filteredrank = obj.ranks;
                    }

                });
			}
		}
         
		//Filters users based on parameters
		function filterUsers(usertype, userrank, unconfirmed, gmaillogin, mentor, multipleprojects, selectedusertype, selecteduserrank, SelectedProject, userproject)
		{
            //alert("gg");
			vm.filteredusers = vm.allusers;
            
            // n^2
            if (SelectedProject && userproject)
            {
                //alert("not null SelectedProject");
                studentsArray = [];
                
				vm.filteredusers.forEach(function (obj)
				{
                    SelectedProject.members.forEach(function (obj2)
                    {
                        //alert(obj.email);
                        //alert(obj2);
                        
                        // user is in project we selected
                        if (obj.email == obj2)
                        {
                            studentsArray.push(obj);
                            //alert(obj.email);
                        }
                        
                    });
				});
                
                vm.filteredusers = studentsArray;
            }
            
			if (usertype && selectedusertype)
			{
				usertype = selectedusertype.name;
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
			if (userrank && selecteduserrank)
			{
				userrank = selecteduserrank;
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
					if (obj.piApproval == false)
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
			if (mentor) // O(n^3) Very slow.
			{
				var tempArray = [];
				vm.filteredusers.forEach(function (obj)
				{
					vm.projects.forEach(function (proj)
					{
						var full = obj.firstName + " " + obj.lastName;
						if (proj.owner_name == full && tempArray)
						{
							var contains;
							tempArray.forEach(function (temp)
							{
								var full2 = temp.firstName + " " + temp.lastName;
								if (full2 == full)
								{
								contains = true;
								}
							});
							if (!contains)
							{
								tempArray.push(obj);
							}
						}
						else if (proj.owner_name == full)
						{
							tempArray.push(obj);
						}
					});
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
									if (counter > 1) 
									{
										if (tempArray)
										{
											var contains;
											tempArray.forEach(function (temp)
											{
												var full = obj.firstName + " " + obj.lastName;
												var full2 = temp.firstName + " " + temp.lastName;
												if (full2 == full)
												{
													contains = true;
												}
											});
											if (!contains)
											{
												tempArray.push(obj);
											}
										}
										else
										{
											tempArray.push(obj);
										}
									}
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
        
		//Out of scope function for Confirm/Reject unconfirmed users
		function userinUnconfirmedfunc(user){vm.userinunconfirmed = user;}
		
		//Loads all project information for active projects
		function loadProjects(){
			reviewStudentAppService.loadProjects().then(function(data){
				vm.projects = data;
			});
		}

        function getProjectById (){
            ProjectService.getProject(vm.id).then(function(data){
                $scope.project = data;
            });
        }
        
        function deploy_email_message(usersToMessage, MessageSubject, MessageBody)
        {
            // test the data passed from HTML form
            /*
            alert(usersToMessage);
            alert(MessageSubject);
            alert(MessageBody);
            */
            
            // first check that all fields have been filled out with some information at least before deplying
            // users to message field check
            if (!usersToMessage)
            {
                //alert("users to msg empty");
                return;
            }
            
            // message subject check
            if (!MessageSubject)
            {
                //alert("subject empty");
                return;
            }
                
            // message body check
            if (!MessageBody)
            {
                //alert("msg body empty");
                return;
            }

            swal({
                title: "Are you sure you wish to send this Message?",   
                text: "Press Send to send the Message!",   
                type: "success",   
                confirmButtonText: "Send",
                allowOutsideClick: true,
                showCancelButton: true
            }, function () {
                sendMessage(usersToMessage, MessageSubject, MessageBody);
                $location.path('/sendmessage/').replace();
            }
            );
        };

       function sendMessage(usersToMessage, MessageSubject, MessageBody)
       {
            var email_msg = 
            {
                recipient: usersToMessage,
                text: "Dear User, you have recieved a new message!\n\n\nFrom: " + profile.firstName + " " + profile.lastName + "\n"
                      + "Message Subject: " + MessageSubject + "\nMessage Text: " + MessageBody + "\n\nPlease reply to this message using the following form: http://vip.fiu.edu:8001/#/sendmessage/" + profile.firstName + "%20" + profile.lastName,
                      
                subject: "New Message from " + profile.firstName + " " + profile.lastName + "!",
                
                recipient2: "vlalo001@fiu.edu",
                subject2: "You have sent a new message",
                text2: "Your message to " + usersToMessage + " has been sent sucessfully. Thank you!"
            };
            
            User.nodeEmail(email_msg);
        };
    });