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
						var id = data.id;
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
												if (data.data[i].owner_id == id) { // Or Only count the todo tasks if it is the recipient of the todo. 
													vm.count++;
												}
											}
										}
										
										
									}
								}
						});

						//alert("isLoggedIn cookie set");

						// user is logged in, set cookie to true
						document.cookie = "isLoggedIn=1";

						if (!checkCookie("destinationURL"))
						{
							//alert("No target destinationxxx");
						}

						// user needs to be redirected to target page in cookie
						// todo: sanitize cookie to make sure we only redirect to *.fiu.edu links
						else
						{
							// otherwise, redirect them to the url
							//alert(getCookie("destinationURL"));
							var cook = getCookie("destinationURL");

							//alert(cook);

							// clear the cookie

							document.cookie = "destinationURL" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

							window.location = cook;
						}
					}
				});

				function getCookie(cname) {
					var name = cname + "=";
					var ca = document.cookie.split(';');
					for(var i = 0; i <ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0)==' ') {
							c = c.substring(1);
						}
						if (c.indexOf(name) == 0) {
							return c.substring(name.length,c.length);
						}
					}
					return "";
				}

				function checkCookie(cookieName)
				{
					var username=getCookie(cookieName);
					if (username!="") {
						return true;
					} else {
						return false;
						}
				}

                
            }
        };
});
}());
