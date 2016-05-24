/**
 * Created by tmoore on 4/4/16.
 */
angular
    .module('userRegistrationController', ['userService'])
    .controller('registrationController', function (User) {
        var vm = this;

        vm.Users = [
            {
                name: 'Faculty/Staff',
                ranks: [
                    'Instructor',
                    'Assitant Professor',
                    'Associate Professor',
                    'Full Professor',
                    'Administrator',
                    'Director'

                ]
            },
            {
                name: 'Pi/CoPi',
                ranks: [
                    'PI',
                    'CoPI',
                    'Coordinator',
                    'External Member'
                ]
            },
            {
                name: 'Student',
                ranks: [
                    'Freshman',
                    'Sophmore',
                    'Junior',
                    'Senior',
                    'Masters',
                    'PhD',
                    'postDoc'
                ]
            }

        ];

        vm.Colleges = [
            {
                name: 'Architecture + The Arts ',
                schools: [
                    'Architecture',
                    'Interior Architecture',
                    'Landscape Architecture and Environmental Urban Design',
                    'Art and Art History',
                    'Communication Arts',
                    'School of Music',
                    'Theatre']
            },
            {
                name: 'Arts and Sciences & Education',
                schools: [
                    'Biological Sciences',
                    'Chemistry and Biochemistry',
                    'Earth and Environment',
                    'English',
                    'Mathematics and Statistics',
                    'Philosophy',
                    'Physics',
                    'Psychology',
                    'Teaching and Learning',
                    'Leadership and Professional Studies',
                    'School of Education',
                    'School of Enviroment, Arts & Society',
                    'School of Integrated Science & Humanity'

                ]
            },
            {
                name: 'Business',
                schools: [
                    'Decision Sciences and Information Systems',
                    'Alvah H. Chapman Jr. Graduate School of Business',
                    'R. Kirk Landon Undergraduate School of Business',
                    'Finance',
                    'Management and International Business',
                    'Marketing',
                    'School of Accounting',
                    'Real Estate'
                ]
            },
            {
                name: 'Chaplin School of Hospitality and Tourism Management',
                schools: [
                    'Hospitality and Tourism Management'
                ]
            },
            {
                name: 'Engineering & Computing',
                schools: [
                    'School of Computing and Information Sciences',
                    'OHL School of Construction',
                    'Department of Biomedical Engineering',
                    'Department of Civil and Environment Engineering',
                    'Department of Electrical and Computer Engineering',
                    'Department of Mechanical and Materials Engineering'
                ]
            },
            {
                name: 'Herbert Wertheim College of Medicine',
                schools: [
                    'Cellular Biology and Pharmacology',
                    'Human and Molecular Genetics',
                    'Immunology',
                    'Medical and Population Health Sciences Research'
                ]
            },
            {
                name: 'Journalism and Mass Communication',
                schools: [
                    'Advertising and Public Relations',
                    'Journalism Broadcasting and Digital Media'
                ]
            },
            {
                name: 'Law',
                schools: [
                    'College of Law'
                ]
            },
            {
                name: 'Nicole Wertheim College of Nursing & Health Sciences',
                schools: [
                    'Biostatistics',
                    'Dietetics and Nutrition',
                    'Environmental and Occupational Health',
                    'Epidemiology',
                    'Health Policy and Management',
                    'Health Promotion and Disease Prevention'
                ]

            },
            {
                name: 'Robert Stempel College of Public Health & Social Work',
                schools: [
                    'School of Social Work'
                ]
            },
            {
                name: 'Steven J. Green School of International and Public Affairs',
                schools: [
                    'Criminal Justice',
                    'Economics',
                    'Global and Sociocultural Studies',
                    'History',
                    'Modern Languages',
                    'Public Administration',
                    'Religious Studies'
                ]
            }
        ];
        vm.userType = vm.Users[1];
        vm.college = vm.Colleges[1];

        vm.onchange = function(value) { 
            if(value==="Student") { 
            alert("A student does need to register.You may simply login with your .fiu.edu account."); 
        } }
        vm.saveUser = function () {

            vm.processing = true;
            // initialize both message to be returned by API and object ID to be used in verification
            vm.message = '';
            vm.objectId = '';


            if(vm.userData == undefined)
            {
                alert("Please fill out all fields.");
                return;
            }


            //START OF FORM INPUT VALIDATION FUNCTIONS //
            if (!first_validation(vm.userData.firstName)) {
                return; // no first name.. go back to form
            }

            if(!last_validation(vm.userData.lastName))
            {
                return; // no last name.. go back to form
            }

           // check for email
            if (vm.userData.email == undefined) {
                alert("Please enter an email address.")
                return;
            }

            if(vm.userData.userType == undefined)
            {
                alert("Please select User Type");
                return false;
            }


            // convert email to lower case
            var inputEmail = vm.userData.email;
            vm.userData.email = inputEmail.toLowerCase();

            // call email validation function
            if(!email_validation(vm.userData.email,vm.userData.userType.name))
            {
                return; // invalid email.. go back to form
            }

            // validate password
            if(!pass_validation(vm.userData.password, vm.userData.passwordConf))
            {
                return; // password validation failed.. return to form
            }

            // validate User Type
            if(!userType_validation(vm.userData.userType.name))
            {
                return;// return to form.. block a student from registering
            }

            if (!rank_validation(vm.userData.rank))
            {
                return;// return to form..did not enter rank
            }

           if(!pid_validation(vm.userData.pantherID,vm.userData.userType.name))
           {
               return; // invalid panther id, return to form
           }

            if(!gender_validation(vm.userData.gender))
            {
                return; // go back to from
            }

            if(vm.userData.college == undefined)
            {
                alert("Please select your College.");
                return false;
            }


            if(vm.userData.department == undefined)
            {
                alert("Please select your Department.");
                return false;
            }

            //END OF FORM INPUT VALIDATION FUNCTIONS //


            // solution for now to set user type.. might change when data comes from DB
            vm.userData.userType = vm.userData.userType.name;

            // solution for now to set college.. might change when data comes from DB
            vm.userData.college = vm.userData.college.name;

            // call user service which makes the post from userRoutes
            User.create(vm.userData)
                                // data contains what we got back from the service and API
                .success(function(data){
                vm.processing = false;

                    //Here we have the user ID so we can send an email to user
                    vm.objectId = data.objectId;
                    vm.userData.recipient = vm.userData.email;
                    vm.userData.text = "Dear "+vm.userData.firstName +",\n\nWelcome to FIU's VIP Project!"+
                       " Please verify your email with the link below and standby for your account to be verified by the PI.\n\n http://vip-dev.cis.fiu.edu/vip/verifyEmail/" + vm.objectId +"";
                    vm.userData.subject = "Welcome to FIU VIP Project!";
                    User.nodeEmail(vm.userData);
                    vm.message = data.message; // message returned by the API
                     // clear the form
                    vm.userData = {};

                    // send email to PI for approval
                    vm.userData.recipient2 = "sadjadi@cs.fiu.edu"; // NEED TO PUT MAIN PI EMAIL HERE FOR NOW
                    vm.userData.text2 = "Dear PI/CoPI,"+
                        " A new user is attempting to register, please accept or reject using the following link:\n\ http://vip-dev.cis.fiu.edu/#/verifyuser/" + vm.objectId +"";
                    vm.userData.subject2 = "User Registration Request";
                    User.nodeEmail(vm.userData);

                    //TODO LINK IS THIS ONE//
                    var todoLink = "http://vip-dev.cis.fiu.edu/#/verifyuser/"+ vm.objectId ;

            })
        };
    });

function email_validation(uemail, userType) {

    // check for length 0
    var uemail_len = uemail.length;
    if (uemail_len == 0) {
        alert("Email should not be empty.");
        return false;
    }
    var uemail_source = uemail.substring(uemail_len - 8, uemail_len);
    // if its not a co/copi and it snot an fiu email.. alert !
    if (uemail_source.toLowerCase() != "@fiu.edu" && userType != "Pi/CoPi") {
        alert("Email should be an @fiu.edu account.")
        return false;
    }
    return true;
}

//Makes sure first name is only letters
function first_validation(first) {
    if (first == undefined) {
        alert("First name should not be empty.")
        return false;
    }
    var first_len = first.length;
    if (first_len == 0) {
        alert("First Name should not be empty.");
        return false;
    }
    var letters = /^[A-Za-z]+$/;
    if (first.match(letters)) {
        return true;
    } else {
        alert('First name must contain alphabet characters only.')
        return false;
    }
    return true;
}

//Makes sure last name is only letters
function last_validation(last) {
    if (last == undefined) {
        alert("Last name should not be empty.")
        return false;
    }
    var last_len = last.length;
    if (last_len == 0) {
        alert("Last Name should not be empty.");
        return false;
    }
    var letters = /^[A-Za-z]+$/;
    if (last.match(letters)) {
        return true;
    } else {
        alert('Last name must contain alphabet characters only.');
        return false;
    }
    return true;
}

//Makes sure panther ID is only numbers and of correct length
//NEED TO FIX PID BEING ENTERED AS A LETTER
function pid_validation(pid,userType) {

    if(userType == "Pi/CoPi" )
    {
        return true;
    }


    if (pid == undefined) {
        alert("Panther ID should not be empty.")
        return false;
    }
    var numbers = /[0-9]/;
    if (pid.match(numbers)) {
    } else {
        alert('PID must have numeric characters only');
        return false;
    }
    var pid_len = pid.length;
    if (pid_len != 7) {
        alert("Please enter your 7 digit Panther-ID.");
        return false;
    }
    return true;
}

//Confirms that both passwords entered are correct.
function pass_validation(pass, passconf) {

    var message="The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one of !@#$%&amp;*()";


    if (pass == undefined || passconf == undefined) {
        alert("Please fill in both password fields.")
        return false;
    }
    var pass_len = pass.length;
    if (pass_len == 0) {
        alert("Please fill in the Password field.");
        return false;
    }

    if(pass != passconf)
    {
        alert("Passwords do not match.");
        return false;
    }

    // check for string password
    if(!isStrongPwd(pass)) {

        alert(message);

        return false;
    }


    return true;
}

// function to cehck for a strong password .. will be called in passconf
function isStrongPwd(password) {

    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var lowercase = "abcdefghijklmnopqrstuvwxyz";

    var digits = "0123456789";

    var splChars ="!@#$%&*()";

    var ucaseFlag = contains(password, uppercase);

    var lcaseFlag = contains(password, lowercase);

    var digitsFlag = contains(password, digits);

    var splCharsFlag = contains(password, splChars);

    if(password.length>=8 && ucaseFlag && lcaseFlag && digitsFlag && splCharsFlag)
        return true;
    else
        return false;

}

// checks the is trong password function
function contains(password, allowedChars) {

    for (i = 0; i < password.length; i++) {

        var char = password.charAt(i);

        if (allowedChars.indexOf(char) >= 0) { return true; }

    }

    return false;
}
//Verifies the user selected a user Type
function userType_validation(userType) {

    if (userType == "Student") {
        alert("A student does need to register.You may simply login with your .fiu.edu account.")
        return false;
    }

    return true;
}

function rank_validation(rank)
{

    if(rank == undefined)
    {
        alert("Rank should not be empty.")
        return false;
    }
    if (rank == "Default") {
        alert("Rank is a required field.")
        return false;
    }

    return true;
}

function gender_validation(gender) {
    //Sex is no longer required for registration
    return true;
    if(gender == undefined)
    {
        alert("Gender should not be empty.")
        return false;
    }
    if (gender != "Male" || gender != "Female") {
        alert("Please select a Gender.")
        return false;
    }

    return true;
}




