angular.module('ubucket.controllers', [])

.run(['$rootScope', function($rootScope){
    $rootScope.currentUser = {
      userModel: null
    };
}])

.controller('LoginCtrl', function($scope, $rootScope, Parse, $timeout, $location, $state) {
  $scope.response = '';

  $scope.register = function () {
    $state.go('register');
  };

  $scope.loadLogin = function() {
    $state.go('login');
  };

  $scope.process_sign_in = function (user) {
    if (user.email === "") return;
    if (user.password === "") return;

    window.scrollTo(0, 0);

    Parse.User.logIn(user.email.toLowerCase(), user.password, {
      success:function(user) {
        $rootScope.currentUser.userModel = user;
        console.log("LOG IN logged in as " + $rootScope.currentUser.userModel.getUsername());
        $state.go('tab.public-list');
      },
      error:function(user, error) {
        console.log("Unable to log in. Error!");
        $scope.response = "Login failed! Try again...";
        $state.go('login');
      }
    });
  };

  $scope.process_registration = function (user) {
    window.scrollTo(0, 0);

    if (user.email === "") return;
    if (user.password === "") return;

    newUser = new Parse.User();
    newUser.set("username", user.email.toLowerCase());
    newUser.set("password", user.password);
    newUser.set("email", user.email.toLowerCase());

    newUser.signUp(null, {
      success:function(newUser) {
        $rootScope.currentUser.userModel = newUser;
        $state.go('tab.public-list');
      },
      error:function(newUser, error) {
        console.log("Can't login. Connection failed perhaps.");
        $scope.response = "Registration failed! Email taken.";
      }
    });
  };

  $scope.process_reset = function (user) {
    window.scrollTo(0, 0);

    if (user.email === "") return;

    newUser = new Parse.User.requestPasswordReset(user.email.toLowerCase(), {
      success:function() {
        $scope.response = "Check your email!";
      },
      error:function(error) {
        console.log(error.message);
        $scope.response = "Could not reset password.";
      }
    });
  };
})

.controller('AboutCtrl', function($scope, $rootScope, $ionicModal, Parse, $timeout) {
  console.log("ABOUT logged in as " + $rootScope.currentUser.userModel.getUsername());
  var username = $rootScope.currentUser.userModel.getUsername();
  $scope.username = username;
  $scope.postnum = 0;
  $scope.togo = 0;
  $scope.completednum = 0;
  
  var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate');
  var query = new Parse.Query(BucketTodoPrivate);
  query.equalTo("whatUser", username);
  
  query.count({
      success: function(count) {
        // The count request succeeded. Show the count
        $timeout(function(){
          $scope.postnum = count;
        },0);
          
      },
      error: function(error) {
        // The request failed
      }
  });
  
  query.equalTo("done", false);
  query.count({
      success: function(count) {
        // The count request succeeded. Show the count
        $timeout(function(){
          $scope.togo = count;
        },0);
      },
      error: function(error) {
        // The request failed
      }
  });
  
  query.equalTo("done", true);
  query.count({
    success: function(count) {
    // The count request succeeded. Show the count
    $timeout(function(){
      $scope.completednum = count;
    },0);
    
    },
    error: function(error) {
      // The request failed
    }
  });
})

.controller('FeedbackCtrl', function($scope, $rootScope, Parse, $timeout, $location, $state) {
  console.log("FEEDBACK logged in as " + $rootScope.currentUser.userModel.getUsername());
  $scope.response = '';

  $scope.loadAbout = function() {
    $state.go('tab.about');
  };

  $scope.process_feedback = function (fback) {
    window.scrollTo(0, 0);

    if (fback === "") return;
    fback = fback.replace(/(<([^>]+)>)/ig,"");

    var FeedbackMessages = Parse.Object.extend('FeedbackMessages'),
    newFeedback = new FeedbackMessages();
    var dupeFeedback = new Parse.Query(FeedbackMessages);
    dupeFeedback.equalTo("message", fback);

    dupeFeedback.first({
      success: function(result) {
        if (typeof result != 'undefined') {
          // reject feedback
          $scope.response = "This has already been submitted!";
        } else {
          // accept feedback
          newFeedback.save({
            message     : fback,
            username    : $rootScope.currentUser.userModel.getUsername(),
          }, {
            success : function(object) {
              $timeout(function() {
                $scope.response = "Feedback sent. Thank you!";
              },0);
            },
            error : function (model, error) {
              $timeout(function(){
                $scope.response = "Uh oh... Couldn't submit feedback!";
              },0);
            }
          });
        }
      },
      error: function(object, error) {
        // unable to connect
        $scope.response = "Uh oh... Couldn't submit feedback!";
      }
    });
  };
})

.controller('PublicCtrl', function($scope, $rootScope, $ionicModal, Parse, $timeout) {
  console.log("PUBLIC logged in as " + $rootScope.currentUser.userModel.getUsername());
  $scope.notes = {};
  $scope.privateNotes = {};
  initializeFormFields();
  retrievePrivateNotes();

  $scope.addToPvt = function(note) {
    for (var i = 0; i < Object.keys($scope.privateNotes).length; i++) {
      if (note.title === $scope.privateNotes[i].title) {
        return false;
      }
    }
    return true;
  };

  function retrievePrivateNotes() {
    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    query = new Parse.Query(BucketTodoPrivate);
    query.equalTo("whatUser", $rootScope.currentUser.userModel.getUsername());

    query.find({
      success : function (results) {
        $timeout(function(){
          for (var i = 0; i < results.length; i++) {
            var titleStr = results[i].get('title');
            var userStr = results[i].get('whatUser');

            $scope.privateNotes[i] = {
              title   : titleStr,
              user    : userStr
            };
          }
        },0);
      },
      error : function (error) {
        $timeout(function(){
            alert("Could not retrieve private notes!");
        },0);
      }
    });
  }

  // When getting all notes from the database, it'll empty the notes array first
  function purgeNotes () {
    $scope.notes = {};
  }

  // When creating a new bucket story,
  // this function will initialize the form with this information
  function initializeFormFields () {
    $scope.currentNoteTitle = '';
    $scope.done = false;
    $scope.access = true;
  }

  // Given a query, this function will purge the notes array 
  // and push on new notes from the query.
  function populateNotesFromParseObjects(parseObjects) {
    purgeNotes();

    for (var i = 0; i < parseObjects.length; i++) {
      var title = parseObjects[i].get('title');
      var done = parseObjects[i].get('done');
      var voteCount = parseObjects[i].get('voteCount');
      var id = parseObjects[i].id;
      var results = parseObjects[i].get('commentCount');

      $scope.notes[id] = {
        title         : title,
        done          : done,
        upvote        : false,
        commentCount  : results,
        id            : id,
        voteCount     : voteCount
      };

      showUpvote(id);
    }
  }

  function showUpvote(id) {
    var user = Parse.User.current();
    
    var relation = user.relation("upvotes");
    var query = relation.query();
    query.equalTo("objectId", id);

    query.first().done(function(list) {
      var upvote = (list === undefined ? false : true);
      updateUpvoteStatus(upvote, id);
    });
  }

  function updateUpvoteStatus(vote, id) {
    $scope.$apply(function(scope) {
      scope.notes[id].upvote = vote;
    });
  }

  // This function connects to the database with a basic query.
  // If the query is successful, it will populate the notes from the query.
  // If the query is unsuccessful, it will display an error message.
  function getNotes () {
    var BucketTodo = Parse.Object.extend('BucketTodo'),
    query      = new Parse.Query(BucketTodo);

    query.find({
      success : function (results) {
        $timeout(function(){
            populateNotesFromParseObjects(results);
        },0);
      },
      error : function (error) {
        $timeout(function(){
            alert("Could not retrieve notes!");
        },0);
      }
    });
  }

  function successFunc(){
    initializeFormFields();
    $scope.taskModal.hide();
    window.location.reload(true);
  }

  // This function submits a story to the database.
  // Everything is accessed by $scope.[ng-Model].
  // When submitted, the form fields are initialized again,
  // and the notes are updated.
  $scope.submitter = function (currentTaskTitle, access) {

    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    newTodoPrivate = new BucketTodoPrivate();

    var BucketTodo = Parse.Object.extend('BucketTodo'),
    newTodo = new BucketTodo();

    newTitle = currentTaskTitle;
    newAccess = access;

    // strip tags to avoid XSS attacks
    newTitle = newTitle.replace(/(<([^>]+)>)/ig,"");
    if (newTitle === "") {
      initializeFormFields();
      return;
    }

    username = $rootScope.currentUser.userModel.getUsername();
    if(newAccess === true){
      newTodo.save({
        title         : newTitle,
        done          : false,
        voteCount     : 1,
        commentCount  : 0
      }, {
        success : function(object) {
          $timeout(function() {
          },0);
        },
        error : function (model, error) {
          $timeout(function(){
              alert('Error when submitting note!');
          },0);
        }
      });
    }

    newTodoPrivate.save({
        title       : newTitle,
        done        : false,
        makePublic  : newAccess,
        whatUser    : username
      }, {
        success : function(object) {
          $timeout(function() {
            successFunc();
          },0);
        },
        error : function (model, error) {
            $timeout(function(){
                alert('Error when submitting note!');
            },0);
        }
    });
  };

  $scope.toggleUpVote = function (note) {
    note.upvote = !note.upvote;

    var BucketTodo = Parse.Object.extend('BucketTodo');
    var query = new Parse.Query(BucketTodo);
    query.equalTo("title", note.title);

    query.first({
      success: function(result) {
        var voteDiff = parseVote(note.upvote);
        var id = note.id;

        $scope.$apply(function(scope) {
          scope.notes[id].voteCount += voteDiff;
        });

        result.increment("voteCount", voteDiff);
        result.save();

        updateUpvoteStatus(note.upvote, result.id);
        updateUpvoteRelation(result, note.upvote);
      },

      error: function(object, error) {
        console.log("Could not find note to update voteCount");
      }
    });
  };

  function updateUpvoteRelation(task, add) {
    var user = Parse.User.current();
    var relation = user.relation("upvotes");
    
    if (add) {
      relation.add(task);
    }
    else {
      relation.remove(task);
    }

    user.save();
  }

  function parseVote(upvote) {
    if (upvote) {
      return 1;
    }
    else {
      return -1;
    }
  }

  $scope.addToPrivate = function (note) {
    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    newTodoPrivate = new BucketTodoPrivate();

    var BucketTodo = Parse.Object.extend('BucketTodo'),
    newTodo = new BucketTodo();

    newTitle = note.title;
    pubID = note.id;

    // strip tags to avoid XSS attacks
    newTitle = newTitle.replace(/(<([^>]+)>)/ig,"");
    if (newTitle === "") {
      initializeFormFields();
      return;
    }

    var query = new Parse.Query(BucketTodoPrivate);
    query.equalTo("id", note.id);
    var username = $rootScope.currentUser.userModel.getUsername();

    query.find({
      success : function (result) {
        newTodoPrivate.save({
          title         : newTitle,
          done          : false,
          makePublic    : false,
          whatUser      : username
        }, {
          success : function(object) {
            $timeout(function() {
              alert("Added to private list.");
              removeNote = {
                title     : newTitle,
                whatUser  : username
              };
              $scope.privateNotes[Object.keys($scope.privateNotes).length] = removeNote;
              $scope.addToPvt(removeNote);
            },0);
          },
          error : function (model, error) {
            $timeout(function(){
              alert('Error when submitting note!');
            },0);
          }
        });
      },
      error : function (error) {
          alert("Could not connect to network.");
      }
    });
  };

  // This function runs every time a checkbox is clicked,
  // and it sends all form inputs at that moment.
  $scope.updateNoteStatus = function (changedNote) {
    var BucketTodo = Parse.Object.extend('BucketTodo'),
    query = new Parse.Query(BucketTodo);
    query.equalTo("title", changedNote.title);

    // .first will return only the first row (technically called object) when it's found
    query.first({
      success : function (result) {
        $timeout(function(){
            result.set("done", changedNote.done);
            result.save();
        },0);
      },
      error : function (error) {
        $timeout(function(){
            alert("Error when updating the note!");
        },0);
      }
    });
  };

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Open our new task modal
  $scope.newTask = function() {
    initializeFormFields();
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  initializeFormFields();
  getNotes();
})

.controller('PublicCommentsCtrl', function($scope, $rootScope,$ionicModal, $stateParams, Parse, $timeout) {
  console.log("COMMENTS logged in as " + $rootScope.currentUser.userModel.getUsername());
  $scope.comments = [];
  $scope.children = [];
  initializeFormFields();

  // When getting bucket story from the database, it'll empty the comments array first
  function purgeNotes() {
    var i = $scope.comments.length;
    while(i--) {
      $scope.comments.pop();
    }
  }

  // When getting the comments for the story from the database, it'll
  // empty the children array first
  function purgeComments() {
    var i = $scope.children.length;
    while(i--) {
      $scope.children.pop();
    }
  }

  // When called this will populate the comment array with the information
  // of the bucket story we are looking at by parseObject
  function populateNotesFromParseObject(parseObject) {
    purgeNotes();

    $scope.comments.push({
      title       : parseObject.get('title'),
      done        : parseObject.get('done'),
      upvote      : false,
      id          : parseObject.id,
      voteCount   : parseObject.get('voteCount'),
      commentCount: parseObject.get('commentCount')
    });

    showUpvote(parseObject.id);
  }

  // When called this will populate the children array with the information
  // of the comments we are looking which are the parseObject
  function populateCommentsFromParseObject(parseObject) {
    purgeComments();
    for( var i = 0, L = parseObject.length; i < L; i++) {
      $scope.children.push({
        title     : parseObject[i].get('title'),
        id        : parseObject[i].id,
        timestamp : parseObject[i].createdAt.getMonth() +
          "/" + parseObject[i].createdAt.getDate(),
        });
    }
  }

  // When creating a new bucket story,
  // this function will initialize the form with this information
  function initializeFormFields () {
    $scope.currentTaskTitle = '';
    $scope.done = false;
    $scope.access = false;
  }

  function showUpvote(id) {
    var user = Parse.User.current();
    
    var relation = user.relation("upvotes");
    var query = relation.query();
    query.equalTo("objectId", id);

    query.first().done(function(list) {
      var upvote = (list === undefined ? false : true);
      updateUpvoteStatus(upvote);
    });
  }

  function updateUpvoteStatus(vote) {
    $scope.$apply(function(scope) {
      scope.comments[0].upvote = vote;
    });
  }

  // This function connects to the database with a basic query.
  // If the query is successful, it will populate the comments array from the query.
  // If the query is unsuccessful, it will display an error message.
  function getNotes() {
    var BucketTodo = Parse.Object.extend('BucketTodo'),
        query      = new Parse.Query(BucketTodo);
    query.get($stateParams.noteId, {
      success : function (results) {
        $timeout(function(){
          if (typeof results != 'undefined') {
            populateNotesFromParseObject(results);
          }
        },0);
      },
      error : function (error) {
        $timeout(function(){
          alert("Could not retrieve notes!");
        },0);
      }
    });
  }

  // This function connects to the database with a basic query.
  // If the query is successful, it will populate the children array from the query.
  // If the query is unsuccessful, it will display an error message.
  // The array will be sorted by date
  function getComments() {
    var comments = Parse.Object.extend('comments'),
    query = new Parse.Query(comments);
    query.equalTo("parent", $stateParams.noteId);
    query.ascending("createdAt");

    query.find({
      success : function (results) {
        $timeout(function(){
          if (typeof results != 'undefined') {
            populateCommentsFromParseObject(results);
          }
        },0);
      },
      error : function (error) {
        $timeout(function(){
          alert("Could not retrieve notes!");
        },0);
      }
    });
  }

  $scope.toggleUpVote = function (note) {
    note.upvote = !note.upvote;

    var BucketTodo = Parse.Object.extend('BucketTodo');
    var query = new Parse.Query(BucketTodo);
    query.equalTo("title", note.title);

    query.first({
      success: function(result) {
        var voteDiff = parseVote(note.upvote);

        $scope.$apply(function(scope) {
          scope.comments[0].voteCount += voteDiff;
        });

        result.increment("voteCount", voteDiff);
        result.save();

        updateUpvoteStatus(note.upvote, result.id);
        updateUpvoteRelation(result, note.upvote);
      },

      error: function(object, error) {
        console.log("Could not find note to update voteCount");
      }
    });
  };

  function updateUpvoteRelation(task, add) {
    var user = Parse.User.current();
    var relation = user.relation("upvotes");

    if (add) {
      relation.add(task);
    } else {
      relation.remove(task);
    }

    user.save();
  }

  function parseVote(upvote) {
    if (upvote) {
      return 1;
    }
    else {
      return -1;
    }
  }

  function successFunc(){
    initializeFormFields();
    $scope.taskModal.hide();
    window.location.reload(true);
    }

  // This function submits a story to the database.
  // Everything is accessed by $scope.[ng-Model].
  // When submitted, the form fields are initialized again,
  // and the notes are updated.
  $scope.submitter = function (currentTaskTitle) {

    var BucketTodo = Parse.Object.extend('BucketTodo');
    var query = new Parse.Query(BucketTodo);
    query.ascending("createdAt");

    var Comment = Parse.Object.extend("comments");
    var myComment = new Comment();

    var newTitle = currentTaskTitle;

    // strip tags to avoid XSS attacks
    newTitle = newTitle.replace(/(<([^>]+)>)/ig,"");
    if (newTitle === "") {
      initializeFormFields();
      return;
    }

    myComment.set("title", newTitle);
    myComment.set("parent", $stateParams.noteId);
    myComment.save();

    query.get($stateParams.noteId, {
      success: function(result) {
        result.increment("commentCount");
        result.save();
        
        successFunc();
        getNotes();
        getComments();
      },
      error: function(object, error) {
        console.log("Could not find note to update voteCount");
        alert("Unable to connect to network.");
      }
    });
    
  };

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Open our new task modal
  $scope.newTask = function() {
    initializeFormFields();
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  initializeFormFields ();
  getNotes();
  getComments();
})

//PRIVATE BUCKETLIST CONTROLLER
.controller('PrivateCtrl', function($scope, $rootScope, $ionicModal, Parse, $timeout, $state) {
  console.log("PRIVATE logged in as " + $rootScope.currentUser.userModel.getUsername());
  $scope.tasks = [];
  initializeFormFields();

  // When getting all notes from the database, it'll empty the notes array first
  function purgeNotes () {
    var i = $scope.tasks.length;
    while (i--) {
      $scope.tasks.pop();
    }
  }

  // When creating a new bucket story,
  // this function will initialize the form with this information
  function initializeFormFields () {
    $scope.currentTaskTitle = '';
    $scope.done = false;
    $scope.access = false;
  }

  // Given a query, this function will purge the notes array 
  // and push on new notes from the query.
  function populateNotesFromParseObjects(parseObjects) {
    purgeNotes();
    for (var i = 0, L = parseObjects.length; i < L; i++) {
      $scope.tasks.push({
        title     : parseObjects[i].get('title'),
        id        : parseObjects[i].id,
        done      : parseObjects[i].get('done'),
        makePublic: parseObjects[i].get('makePublic')
      });
    }
  }

  // This function connects to the database with a basic query.
  // If the query is successful, it will populate the notes from the query.
  // If the query is unsuccessful, it will display an error message.
  function getNotes () {
    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    query = new Parse.Query(BucketTodoPrivate);
    query.equalTo("whatUser", $rootScope.currentUser.userModel.getUsername());

    query.find({
      success : function (results) {
        $timeout(function(){
          populateNotesFromParseObjects(results);
        },0);
      },
      error : function (error) {
        $timeout(function() {
          alert("Could not retrieve notes!");
        },0);
      }
    });
  }

  function successFunc(){
    initializeFormFields();
    $scope.taskModal.hide();
    window.location.reload(true);
  }

  // This function submits a story to the database.
  // Everything is accessed by $scope.[ng-Model].
  // When submitted, the form fields are initialized again,
  // and the notes are updated.
  $scope.submitter = function (currentTaskTitle, access) {
    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    newTodoPrivate = new BucketTodoPrivate();

    var BucketTodo = Parse.Object.extend('BucketTodo'),
    newTodo = new BucketTodo();

    newTitle = currentTaskTitle;
    newAccess = access;

    // strip tags to avoid XSS attacks
    newTitle = newTitle.replace(/(<([^>]+)>)/ig,"");
    if (newTitle === "") {
      initializeFormFields();
      return;
    }
    username = $rootScope.currentUser.userModel.getUsername();
    if(newAccess === true){
      newTodo.save({
        title           : newTitle,
        done            : false,
        voteCount       : 1,
        commentCount    : 0
      }, {
        success : function(object) {
          $timeout(function() {
          },0);
        },
        error : function (model, error) {
          $timeout(function(){
              alert('Error when submitting note!');
          },0);
        }
      });
    }

    newTodoPrivate.save({
      title       : newTitle,
      done        : false,
      makePublic  : newAccess,
      whatUser    : username
      }, {
        success : function(object) {
          $timeout(function() {
            successFunc();
          },0);
        },
        error : function (model, error) {
          $timeout(function(){
              alert('Error when submitting note!');
          },0);
        }
    });
  };

  $scope.remaining  = function () {
    var count = 0;

    angular.forEach($scope.tasks, function(task) {
      count += task.done ? 1 : 0;
    });

    return count;
  };

  $scope.progress  = function (remain) {
    return Math.round((remain / $scope.tasks.length) * 100);
  };

  $scope.getProgressColor = function(remain) {
    var color = "#FFF";
    
    if (remain === 0) {
      color = "#333";
    }

    return color;
  };

  $scope.getProgressMargin = function(remain) {
    var margin = "0px";

    if (remain === 0) {
      margin = "5px";
    }

    return margin;
  };

  // This function runs every time a checkbox is clicked,
  // and it sends all form inputs at that moment.
  $scope.updateNoteStatus = function (changedNote) {
    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate'),
    query = new Parse.Query(BucketTodoPrivate);
    query.equalTo("title", changedNote.title);
    query.equalTo("whatUser", $rootScope.currentUser.userModel.getUsername());

    // .first will return only the first row (technically called object) when it's found
    query.first({
      success : function (result) {
        $timeout(function(){
          result.set("done", changedNote.done);
          result.save();
        },0);
      },
      error : function (error) {
        $timeout(function(){
          alert("Error when updating the note!");
        },0);
      }
    });
  };

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

   // Open our edit task modal
  $scope.editTask = function() {
    $scope.editModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

    // Close the edited task modal
  $scope.closeEditTask = function() {
    $scope.editModal.hide();
  };


$scope.itemButtons = [
  {
    text: 'Delete',
    type: 'button-assertive',
    onTap: function(task) {
      deleteEvent(task);
    }
  }
];

function deleteEvent(task){
  var clickedButton = confirm("Are you sure you want to delete this?");
  if(clickedButton === true){
    console.log("BEFORE DELETE logged in as " + $rootScope.currentUser.userModel.getUsername());
    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
    console.log("AFTER DELETE logged in as " + $rootScope.currentUser.userModel.getUsername());

    var BucketTodoPrivate = Parse.Object.extend('BucketTodoPrivate');
    var query = new Parse.Query(BucketTodoPrivate);
    var thisId = task.id;

    query.get(thisId, {
      success: function(result) {
        // The object was retrieved successfully.
        result.destroy({});
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
      }
    });
  }
  else{
    return;
  }
}

  //DELETE ITEM FROM LIST WITH PROMPT
  $scope.onItemDelete = function(task) {
    deleteEvent(task);
  };

  initializeFormFields();
  getNotes();

});