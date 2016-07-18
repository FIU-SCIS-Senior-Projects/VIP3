(function() {
    angular.module('vipHeader', ['toDoModule'])
    .directive('vipHeader', function (ToDoService,ProfileService)
    {
		

        return {
            templateUrl: 'features/header/headerTemplate.html',
            restrict: 'E',
            scope:{
                count: '='
            },
            controllerAs: 'header',
            controller: function ($rootScope) {
                var vm = this;
				
				$rootScope.$on('$viewContentLoaded', function() {
					console.log("Page refreshed");
					$rootScope.$broadcast('refresh');
				});
				
				ProfileService.loadProfile().then(function(data){
					if (data) {
						vm.current_user = data.firstName;
						vm.user_type = data.userType;
						var id = data._id;
						vm.logged_in = true;

						
						
						vm.count = 0;
						ToDoService.loadAllToDo()
							.then(function (data) {
								for(i = 0; i < data.data.length; i++) {
									if(data.data[i].read) {
										continue;
									} else {
										
										if (data.data[i].owner == vm.user_type) { //Only count the todo tasks related to the account type.
											if (!data.data[i].owner_id) {
												vm.count++;
											}
											else {
												if (data.data[i].owner_id) {
													if (data.data[i].owner_id == id) { // Or Only count the todo tasks if it is the recipient of the todo. 
														vm.count++;
													}
												}
											}
										}
										
										
									}
								}
								
						});
						
						
						$rootScope.$on('refresh', function () {
							console.log("View refreshed");
							vm.count = 0;
							ToDoService.loadAllToDo()
								.then(function (data) {
									for(i = 0; i < data.data.length; i++) {
										if(data.data[i].read) {
											continue;
										} else {
											
											if (data.data[i].owner == vm.user_type) { //Only count the todo tasks related to the account type.
												if (!data.data[i].owner_id) {
													vm.count++;
												}
												else {
													if (data.data[i].owner_id) {
														if (data.data[i].owner_id == id) { // Or Only count the todo tasks if it is the recipient of the todo. 
															vm.count++;
														}
													}
												}
											}
											
											
										}
									}
									
							});
							if (!$rootScope.$$phase) {
								$rootScope.$apply();
							}
						});

					}
				});

                

            }
        };
});
}());
