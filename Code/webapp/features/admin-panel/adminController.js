(function () {
    'use strict';

    angular
        .module('admin')
        .controller('adminController', adminCtrl);

    adminCtrl.$inject = ['$window','$state', '$scope'];
    /* @ngInject */
    function adminCtrl($window,$state, $scope) {
        var vm = this;
        vm.profile;
		
		
		
        init();
        function init(){
            loadProjects();
			loadLogs();
        }
		
		function loadLogs()
		{
            reviewPPS.loadLog("student").then(function(data){
                vm.logs = data;
            });
        }
	}

})();
