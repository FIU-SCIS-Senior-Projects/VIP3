/**
 * Created by Victoriano on 4/20/16.
 */

angular.module('forgotPasswordService', [])

    .factory('forgotPasswordService', function ($http) {

        // create a new object
        var factory = {};

        factory.verifyEmail = function (email, onSuccess, onError) {
            $http.post('/support/recover/validate_email', { email: email }).then(function (res) {
                if (res.data && res.data.validated) {
                    onSuccess ? onSuccess(res.data._id) : 0
                } else {
                    onError ? onError() : 0
                }
            })
        }

        factory.validateVerificationCode = function (user_id, verification_code, onSuccess, onError) {
            $http.post('/support/recover/verify_code', { user_id: user_id, code: verification_code }).then(function (res) {
                if (res.data && res.data.validated) {
                    onSuccess ? onSuccess() : 0                    
                } else {
                    var e = res.data.error || null
                    onError ? onError(e) : 0
                }
            })
        }
        
        factory.resetUserPassword = function (user_id, password, onSuccess, onError) {
            $http.post('/support/recover/publish_password', { user_id: user_id, password: password }).then(function (res) {
                if (res.data && res.data.validated) {
                    onSuccess ? onSuccess() : 0                    
                } else {
                    var e = res.data.error || null
                    onError ? onError(e) : 0
                }
            })
        }

        // return our entire factory object
        return factory;


    });
