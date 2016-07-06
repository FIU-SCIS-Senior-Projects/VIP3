
angular.module('contactController', ['ProjectProposalService', 'userService'])
    .controller('contactController', function($window,$location,$scope, User, $stateParams){

        var vm = this;
        vm.title = "";
        vm.issue = "";

        function send_msg() 
        {
            //Add if/else for topic type. Send VIP credits to mohsen and franciso only
    		var email_msg = 
                {
                    recipient: "dlope073@fiu.edu,mtahe006@fiu.edu,vlalo001@fiu.edu,jjens011@fiu.edu,mmart196@fiu.edu", 
                    text: issue, 
                    subject: "New technical support ticket issued: " + title
                };
                User.nodeEmail(email_msg);
                success_msg();
        };

        function success_msg()
         {
            swal({   
                title: "Ticket Issued!",   
                text: "Thank you for notifying us, we will address the issue as soon as possible.",   
                type: "success",   
                confirmButtonText: "Continue" ,
                allowOutsideClick: true,
                timer: 9000,
            });
        };
      });