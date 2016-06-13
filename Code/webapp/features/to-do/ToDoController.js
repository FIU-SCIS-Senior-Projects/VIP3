(function() {
    angular.module('toDoModule')
    .controller('toDoController', toDoController);

    toDoController.$inject = ['ToDoService','ProfileService'];

    function toDoController (ToDoService,ProfileService) {
        var vm = this;
        vm.list = [];
        vm.personalCount = 0;
        vm.userCount = 0;
        vm.projectCount = 0;
        vm.studentCount = 0;

        vm.markedAsRead = function(todo) {
            ToDoService.markAsRead(todo._id)
                .then(function(data) {
                    todo.read = true;
                });
            if(todo.type == 'personal') vm.personalCount--;

            else if(todo.type == 'user') vm.userCount--;

            else if(todo.type == 'project') vm.projectCount--;

            else if(todo.type == 'student') vm.studentCount--;
        };

        function getToDo (profile) {
            ToDoService.loadAllToDo()
                .then(function(data) {
                    vm.list = data.data;
                    for(i = 0; i < vm.list.length; i++) {
                        if(vm.list[i].read) continue;
						
						if (vm.list[i].owner != profile.userType) continue;
						
						if (vm.list[i].owner_id) {
							if (vm.list[i].owner_id != profile._id) {
								continue;
							}
						}

                        if(vm.list[i].type == 'personal') vm.personalCount++;

                        else if(vm.list[i].type == 'user') vm.userCount++;

                        else if(vm.list[i].type == 'project') vm.projectCount++;

                        else if(vm.list[i].type == 'student') vm.studentCount++;
                    }
                });
        }
		
		ProfileService.loadProfile().then(function(data){
					if (data) {
						getToDo(data);
					}
					else {
						
					}
		});

        
    }
}());
