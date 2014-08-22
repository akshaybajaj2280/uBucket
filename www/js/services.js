angular.module('ubucket.services', [])

/**
 * Parse factory used to connect to the Parse database. Includes private key information.
 */
.factory('Parse', function ($window) {
    $window.Parse.initialize("KEY", "KEY");
    return $window.Parse;
})

// .factory('ParseUser', function (Parse) {
//     var ParseUser = {};

//     function setUser(user) {
//         ParseUser = user;
//     }

//     function getUser() {
//         return ParseUser;
//     }
//     // var ParseUser = {
//     //     user :  the user model from Parse ,
//     //     login : function () {},
//     //     logout : function () {}
//     // };

//     return ParseUser;
// })
;
