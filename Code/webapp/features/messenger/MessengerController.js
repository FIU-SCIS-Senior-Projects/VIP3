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
         
         function ClearContacts()
         {
             $scope.usersToMessage = '';
         }
		
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