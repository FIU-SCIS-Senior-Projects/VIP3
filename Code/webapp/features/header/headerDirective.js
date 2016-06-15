(function() {
    angular.module('vipHeader', ['toDoModule'])
    .directive('vipHeader', function (ToDoService,ProfileService)
    {

		// if redirect cookie exists, navigate the user back to the page they were at
		if (document.cookie.indexOf("destinationURL") > -1)
		{
			//alert(getCookie("destinationURL"));
			window.location = getCookie("destinationURL");
		}

		function getCookie(name) {
		  var value = "; " + document.cookie;
		  var parts = value.split("; " + name + "=");
		  if (parts.length == 2) return parts.pop().split(";").shift();
		}

		// delete cookie
		document.cookie = "destinationURL" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

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
