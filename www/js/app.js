// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ubucket' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ubucket.services' is found in services.js
// 'ubucket.controllers' is found in controllers.js
angular.module('ubucket', ['ionic', 'ubucket.services', 'ubucket.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
      })

    .state('register', {
      url: '/register',
          templateUrl: 'templates/register.html',
          controller: 'LoginCtrl'
      })

    .state('reset', {
      url: '/reset',
          templateUrl: 'templates/reset.html',
          controller: 'LoginCtrl'
      })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // the public tab has its own child nav-view and history
    .state('tab.public-list', {
      url: '/public',
      views: {
        'public-tab': {
          templateUrl: 'templates/public-list.html',
          controller: 'PublicCtrl'
        }
      }
    })

    .state('tab.public-comments', {
      url: '/public/:noteId',
      views: {
        'public-tab': {
          templateUrl: 'templates/public-comments.html',
          controller: 'PublicCommentsCtrl'
        }
      }
    })

    .state('tab.private', {
      url: '/private',
      views: {
        'private-tab': {
          templateUrl: 'templates/private-list.html',
          controller: 'PrivateCtrl'
        }
      }
    })

    .state('tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    })

    .state('feedback', {
    url: '/feedback',
        templateUrl: 'templates/feedback.html',
        controller: 'FeedbackCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
