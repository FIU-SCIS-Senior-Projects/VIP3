angular.module('MessengerController', ['ProjectProposalService', 'userService','toDoModule'])
    .controller('MessengerController', function($window,$location,$scope, User, ProfileService, ProjectService, ToDoService, $stateParams){
        
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
        vm.disciplines = [];
        vm.editingMode = false;
        vm.sendMessage = deploy_email_message;

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
        
        function deploy_email_message()
         {
            swal({   
                title: "Are you sure you wish to send this Message?",   
                text: "Press Continue to send the Message!",   
                type: "success",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                showCancelButton: true
            }, function () {
                sendMessage();
            }
            );
        };

       function sendMessage() {
            alert("alive!");
			/*
			$scope.project.owner = profile._id; // Set the project owner to the person who proposed the project used later for contacting the faculty member.
			$scope.project.owner_email = profile.email;
			$scope.project.owner_rank = profile.userType;
			$scope.project.owner_name = profile.firstName + " " + profile.lastName;
			var obj = document.getElementById('teamImage');
			if (obj.files.length == 0) {
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
							$scope.project.status='modified';
							$scope.project.id = $stateParams.id;
							$scope.project.edited = true;
							ProjectService.editProject($scope.project, $stateParams.id)
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
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. You can do this by logging into VIP. Approve Projects Here: http://vip.fiu.edu/#/reviewproject", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
								}, function (error) {
									error_msg();
								});
					}
					else{
							$scope.project.status='pending';
							$scope.project.id = $stateParams.id;
							$scope.project.edited = true;
							ProjectService.editProject($scope.project, $stateParams.id)
								.then(function(data){
									success_msg();
									var todo = {owner: profile.userType , owner_id: profile._id, todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.", type: "project", link: "/#/to-do" };
									ToDoService.createTodo(todo).then(function(success)  {
										
									}, function(error) {
										error_msg();
										
									});
									var todo2 = {owner: "Pi/CoPi", todo: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval.", type: "project", link: "/#/reviewproject" };
									ToDoService.createTodo(todo2).then(function(success)  {
										
									}, function(error) {
										
									});
									var email_msg = 
									{
										recipient: profile.email, 
										text: "Dear " + profile.firstName + ", thank you for proposing " + $scope.project.s  + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.\n\nProject:" + $scope.project.title + "\nStatus: Pending" , 
										subject: "Project Proposal Submission Pending", 
										recipient2: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu",  
										text2: "Dear PI, " + profile.firstName + " " + profile.lastName  + " has proposed a project titled: " + $scope.project.title +  ", please approve or deny the project as it requires your approval. Approve Projects Here: http://vip.fiu.edu/#/reviewproject", 
										subject2: "Faculty Has Proposed New Project: " + $scope.project.title 
									};
									User.nodeEmail(email_msg);
								}, function(error) {
									error_msg();
								});
					}

				}
				r.readAsDataURL(f);
			}    */
        };
    });