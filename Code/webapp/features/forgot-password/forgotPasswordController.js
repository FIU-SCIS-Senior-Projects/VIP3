/**
 * Created by Victoriano on 20/4/16.
 */
angular
    .module('forgotPasswordController', ['forgotPasswordService'])
    .controller('forgotPasswordController', function (forgotPasswordService, $state, $location) {

        var vm = this
        vm.operationSuccess = false

        vm.flags = {}
        vm.flags.emailValid = true
        vm.flags.emailVerified = true

        vm.user = {
            email: null
        }

        vm.processEmail = function () {

            vm.flags.emailValid = true
            vm.flags.emailVerified = true

            var addr = vm.user.email
            if (!validateEmail(addr)) {
                vm.user.email = ''
                return;
            }

            forgotPasswordService.verifyEmail(vm.user.email, function (_id) {
                vm.flags.emailVerified = true

                vm.operationSuccess = true

            }, function () {
                vm.flags.emailVerified = false
            })
        }

        function validateEmail(email) {
            var flag = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email)
            vm.flags.emailValid = flag
            return flag
        }

    })
    .controller('forgotPasswordPublishController', function (forgotPasswordService, $state, $location) {

        if (!($location.search() && $location.search().auth_id && $location.search().code)) {
            $location.path('/').replace();
        }

        var vm = this
        vm.operationSuccess = false
        vm.loading = true

        vm.state = null

        vm.flags = {}
        vm.flags.invalidCode = false;
        vm.flags.invalidChallenge = false
        vm.flags.mismatchPassword = false

        vm.user = {
            _id: $location.search().auth_id,
            code: $location.search().code
        }
        vm.challenge = {
            password: null,
            confirmPassword: null
        }

        forgotPasswordService.validateVerificationCode(vm.user._id, vm.user.code, function () {
            vm.loading = false
        }, function () {
            vm.flags.invalidCode = true
            // alert('invalid reset password request. Please try again at a later time')
        })

        vm.processPassword = function () {
            if (vm.user._id) {
                if (!validatePassword()) {
                    return;
                }

                forgotPasswordService.resetUserPassword(vm.user._id, vm.challenge.password, function () {

                    vm.operationSuccess = true

                }, function () {
                    alert('Error occured. Please try agian at a later time')
                })
            } else {
                alert('invalid reset password request. Please try again at a later time')
            }
        }

        function validatePassword() {
            var flag = false

            vm.flags.mismatchPassword = !vm.challenge.password || !(vm.challenge.password == vm.challenge.confirmPassword)
            
            
            vm.flags.invalidChallenge = false
            if (!vm.flags.mismatchPassword) {
                vm.flags.invalidChallenge = !challengePasswordStregnth(vm.challenge.password)
            }

            // if (vm.flags.mismatchPassword) {
            //     vm.challenge.confirmPassword = ''
            // }

            return !vm.flags.invalidChallenge && !vm.flags.mismatchPassword
        }

        function challengePasswordStregnth(pwd) {
            
            console.log(pwd)
            
            var array = [];
            array[0] = /[A-Z]/g.test(pwd);
            array[1] = /[a-z]/g.test(pwd);
            array[2] = /\d/g.test(pwd);
            array[3] = hasSpecialChars(pwd)

            var sum = 0;
            for (var i= 0; i < array.length; i++) {
                sum += array[i] ? 1 : 0;
            }
            console.log("sum", sum)
            
            return pwd.length >= 8 && sum == 4
            
            function hasSpecialChars (string) {
                return  string.indexOf('!') != -1 ||
                        string.indexOf('@') != -1 ||
                        string.indexOf('#') != -1 ||
                        string.indexOf('$') != -1 ||
                        string.indexOf('%') != -1 ||
                        string.indexOf('&') != -1 ||
                        string.indexOf('*') != -1 ||
                        string.indexOf('(') != -1 ||
                        string.indexOf(')') != -1
            }
        }


    })

