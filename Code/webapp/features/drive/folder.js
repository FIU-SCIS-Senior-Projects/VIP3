function createFolder() {
		  authorize('1089996737629-vod05ou76bu67ople23qa65jjlso2kjj.apps.googleusercontent.com', function () {
		  var folderName = document.getElementById('folderName');
	      var name = folderName.value;
		  make(name,"", function() {
				var message = document.getElementById('output');
				message.value = 'Made folder' + folderName + '.';
		  });
	  }, function () {
		  alert('Error');
	  });
}

angular.module('folder', []).controller('fld', function ($scope) {

		load();
});