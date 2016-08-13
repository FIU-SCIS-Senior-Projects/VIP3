angular.module('MessengerController', ['ProjectProposalService', 'userService','toDoModule', 'MessengerService'])
    .controller('MessengerController', function($window,$location,$scope, User, ProfileService, ProjectService, ToDoService, $stateParams, MessengerService, reviewStudentAppService){
        
		var profile;
        var curr_profile;
		var vm = this;
        vm.userTypeNew;
        
		ProfileService.loadProfile().then(function(data){
            if (data) {
                $scope.done = true;
                profile = data;
                curr_profile = data.email;
                vm.userTypeNew = data.userType;
                //alert(vm.userTypeNew);
                if (profile.userType == "Student") {
                    //$location.path("/");
                    //$location.path('/').replace();
                }
            }
            else {
                $scope.done = true;
                profile = null;
                $location.path("login");
                //$location.path('login').replace();
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
        vm.ShowDiv = ShowDiv;
		
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
        
        vm.SearchMessage = "Search for Contacts";
        
        my_id = $stateParams.user_id;
        
        // identifier for whether or not this is a reply to an email
        is_a_reply = $stateParams.is_reply_to_email;
        
        OriginalSubject = $stateParams.original_subject;
		
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
        
        // if this is a reply to an email, add "Re: " and the original message subject, and update message body too
        if (is_a_reply == 1)
        {
            //alert("this is a reply");
            $scope.MessageSubject = "Re: " + OriginalSubject;
            $scope.MessageBody = "Type your reply to '" + $scope.MessageSubject + "' here.";
        }
        
        // not a reply, use standard text template
        else
        {
            $scope.MessageSubject = "Type the Subject of your Message here.";
            
            // not a reply, so clear msg field, unless name specified
            $scope.usersToMessage = "";
            $scope.MessageBody = "Type the Body of your Message here.";
        }
        
        init();
        
        function init ()
        {            
            if (vm.users == null)
            {
                loadUsers();
            }

            //alert(vm.users);

            loadProjects();
        }
        
        // function to show/hide the filter
        function ShowDiv ()
        {            
            if (document.getElementById("vlad_new").style.cssText == "height: 420px; overflow: hidden;")
            {
                console.log("the menu is showing, hide it " + document.getElementById("vlad_new").style.cssText);
                document.getElementById("vlad_new").style = "display:none;";
                vm.SearchMessage = "Search for Contacts";
            }
            
            else
            {
                console.log("the menu is hidden, unhide it " + document.getElementById("vlad_new").style.cssText);
                document.getElementById("vlad_new").style = "height: 420px; overflow:hidden;";
                vm.SearchMessage = "Hide Search";
            }
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
                         if (my_id == obj.email)
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
                alert("Message sent successfully");
                $location.path('/').replace();
            }
            );
            

            
        };
        
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
                        //alert("found param " + my_id);
                         //alert(my_id + " vs " + obj.firstName + " " + obj.lastName);
                         if (my_id == obj.email)
                         {
                            //alert("found id " + my_id + " email is " + obj.email);
                            $scope.usersToMessage = obj.email;
                            
                            // grab the users ID
                            usersToMessageId = obj._id;
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
        
		//Load all user information
		function DispatchAllToDoNotifications(EmailsList, MessageSender, MessageURL)
		{
			MessengerService.loadAllUsers().then(function(data)
            {
				vm.allusers = data;
                
                // iterate through all users
				vm.allusers.forEach(function (obj)
				{
                    // if current users email is contained in our list of emails, we need to send this person a todo notification
                    if (EmailsList.indexOf(obj.email) >= 0)
                    {
                        //tempArray2.push(obj);
                        //alert("the email " + obj.email + " is in the list " + EmailsList);
                       
                        var todo = {owner: obj.userType , owner_id: obj._id, todo: obj.firstName + ", you have recieved a new message from " + MessageSender + "! It is very important that you reply as soon as possible.", type: "message", link: MessageURL };
                        ToDoService.createTodo(todo).then(function(success)
                        {
                            // alert("todo added successfully");
                        }, function(error)
                        {
                            // alert("failed to add todo");
                        });
                    }
				});
			});
        }

       function sendMessage(usersToMessage, MessageSubject, MessageBody)
       {
            // build email URL
            var EmailURL = "http://vip.fiu.edu/#/sendmessage/" + profile.email + "/" + "1/" + encodeURIComponent(MessageSubject.trim());
           
            var email_msg = 
            {
                // doing this for privacy concerns from Pi
                recipient: "fiuvipmailer@gmail.com",
                
                // we message all of the users using bcc, because they way they only see the fiuvipmailer@gmail.com email address, and not the email address of all the people who are also included on that email
                bcc: usersToMessage,
                text: "Dear User, you have recieved a new message!\n\n\nFrom: " + profile.firstName + " " + profile.lastName + "\n"
                      + "Message Subject: " + MessageSubject + "\nMessage Text: " + MessageBody + "\n\nPlease reply to this message using the following form: " + EmailURL,
                      
                subject: "New Message from " + profile.firstName + " " + profile.lastName + "!",
                
                recipient2: curr_profile,
                subject2: "You have sent a new message",
                text2: "Your message to " + usersToMessage + " has been sent sucessfully. Thank you!"
            };
            
            User.nodeEmail(email_msg);
            
            // send todo notifications to all of the users we just emailed, so they know to check their emails
            DispatchAllToDoNotifications(usersToMessage, curr_profile, EmailURL);
            
            // after the email has been sent, add a to-do for all of the recipients
            // need: all users ids by cross-referencing the target emails in usersToMessage to the database and extracting the ids
            
            /*
            var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "/#/to-do" };
            ToDoService.createTodo(todo).then(function(success)  {
                
            }, function(error) {
                
            });
            var todo2 = {owner: "Pi/CoPi", todo: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval.", type: "project", link: "/#/reviewproject" };
            ToDoService.createTodo(todo2).then(function(success)  {
                
            }, function(error) {
                
            });
            */
        };
    });