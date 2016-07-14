
angular.module('contactController', ['userService'])
    .controller('contactController', function($window,$location,$scope, User, $stateParams){

        var vm = this;
        vm.title = "";
        vm.issue = "";
        vm.option = "";
        vm.email = "";

        $scope.send = function send() 
        {
            if(vm.title != "" && vm.option != "" && vm.issue != "")
            {
                if(vm.option == "Technical issue")
                {
                    //, dlope073@fiu.edu, mtahe006@fiu.edu, vlalo001@fiu.edu, mmart196@fiu.edu
                    var email_msg = 
                    {
                        recipient: "jjens011@fiu.edu, mtahe006@fiu.edu, dlope073@fiu.edu, vlalo001@fiu.edu, mmart196@fiu.edu", 
                        text: vm.issue + "  -------You can reply to the user if necessary at: " + vm.email, 
                        subject: "(VIP) Technical Issue: " + vm.title
                    };
                    
                    User.nodeEmail(email_msg);
                    success_msg();
                    return;
                }

                if(vm.option == "Vip Educational credits")
                {
                    var email_msg = 
                    {
                        recipient: "fortega@cis.fiu.edu, mtahe006@fiu.edu", 
                        text: vm.issue + "  -------You can reply to the user if necessary at: " + vm.email, 
                        subject: "(VIP) New Question: " + vm.title
                    };
                    User.nodeEmail(email_msg);
                    success_msg();
                    return;
                }
            }
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
            }, function(){
                $window.location.reload();
            }
            );
        };
      });