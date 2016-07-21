(function() {
    angular.module('toDoModule')
    .controller('toDoController', toDoController);

    toDoController.$inject = ['$rootScope','$scope','ToDoService','ProfileService'];

    function toDoController ($rootScope,$scope,ToDoService,ProfileService) {
		
        var vm = this;
		vm.done = false;
        vm.list = [];
        vm.personalCount = 0;
        vm.userCount = 0;
        vm.projectCount = 0;
        vm.studentCount = 0;
		vm.message = 0;
		
		

        vm.markedAsRead = function(todo) {
            ToDoService.markAsRead(todo._id)
                .then(function(data) {
                    todo.read = true;
					$rootScope.$broadcast('refresh');
                });
            if(todo.type == 'personal') vm.personalCount--;

            else if(todo.type == 'user') vm.userCount--;

            else if(todo.type == 'project') vm.projectCount--;

            else if(todo.type == 'student') vm.studentCount--;
			
			else if (todo.type == 'message') vm.message--;
			
			
			
        };

        function getToDo (profile) {
            ToDoService.loadAllToDo()
                .then(function(data) {
                    vm.list = data.data;
                    for(i = 0; i < vm.list.length; i++) {
                        if(vm.list[i].read) continue;
						
						if (vm.list[i].owner != profile.userType) {
							vm.list[i] = null; // Make null so it ignores it in ng-repeat the null value doesn't persist i.e not stored in db.
							continue;
						} 
						
						if (vm.list[i].owner_id) {
							if (vm.list[i].owner_id != profile._id) {
								vm.list[i] = null; // Make null so it ignores it in ng-repeat the null value doesn't persist i.e not stored in db.
								continue;
							}
						}

                        if(vm.list[i].type == 'personal') vm.personalCount++;

                        else if(vm.list[i].type == 'user') vm.userCount++;

                        else if(vm.list[i].type == 'project') vm.projectCount++;

                        else if(vm.list[i].type == 'student') vm.studentCount++;
						
						else if (vm.list[i].type == 'message') vm.message++;
                    }
	
					vm.done = true;
                });
        }
		
		ProfileService.loadProfile().then(function(data){
					if (data) {
						getToDo(data);
					
					}
					else {
						vm.done = true;
					}
		});

        
    }
}());
