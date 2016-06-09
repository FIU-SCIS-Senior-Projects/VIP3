(function() {
    angular.module('vipHeader', ['toDoModule'])
    .directive('vipHeader', function (ToDoService,ProfileService) {
        return {
            templateUrl: 'features/header/headerTemplate.html',
            restrict: 'E',
            scope:{
                count: '='
            },
            controllerAs: 'header',
            controller: function () {
                var vm = this;
				ProfileService.loadProfile().then(function(data){
					if (data) {

						vm.current_user = data.firstName;
						vm.user_type = data.userType;
						vm.logged_in = true;
					}
				});
				
				
                vm.count = 0;
                ToDoService.loadAllToDo()
                    .then(function (data) {
                        for(i = 0; i < data.data.length; i++) {
                            if(data.data[i].read) {
                                continue;
                            } else {
                                vm.count++;
                            }
                        }
                    });
            }
        };
});
}());
