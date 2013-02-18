'use strict';

/* Controllers */
//The index controller is mainly used for logging all clicks. 
//Logging to Google Analytics and SingPath
function IndexController($scope,$resource,$location,$window){
    
    $scope.location = $location;
    $scope.log_event = function($event){
        
        $scope.clicked = $event.target.name;
        //Log event to Google Analytics
        //This will log from 127.0.0.1 but not local host. 
        $window._gaq.push(['_trackPageview', $scope.clicked]);
        //This is how you log to the SingPath backend.
        $scope.Log = $resource('/jsonapi/log_access');
        var item = new $scope.Log({"page":"index1.html",
                                   "event":$scope.clicked,
                                   "date":1357529747177});
        $scope.item = item.$save(); 
    };

}

function Ctrl($scope) {
  $scope.color = 'blue';
}

function PlayerController($scope,$resource){
        $scope.player = $resource('/jsonapi/player').get();        
}

function InterfaceController($scope,$resource){
        $scope.interfaces = $resource('/jsonapi/interfaces').get();
}

function PathController($scope,$resource){
        $scope.paths = $resource('/jsonapi/get_game_paths').get();
}


function GameController($scope,$resource){
        $scope.current_problem = {};
        $scope.game = $resource('test_data/python_game.json').get();
        //$scope.mobile_game = $resource('test_data/mobile_python_game.json').get();
        
        $scope.create_practice_game = function(pathID,LevelID,difficulty,numProblems){
          $scope.game = $resource('/jsonapi/create_game').get();

        };
        $scope.create_quest_game = function(questID){
          $scope.game = $resource('/jsonapi/create_quest_game').get();

        };
        
        $scope.check_solution_for_game = function(solution, problemID, gameID) {
          //Need to do this one as a post. 
          //$scope.solution_check_result = $resource('/jsonapi/verify_solution.php');
          $scope.SaveResource = $resource('/jsonapi/verify_solution.php');
       
          $scope.theData = {user_code:"oops =317",
                            problem_id:10033,
                            game_id:14101372};
                            
          var item = new $scope.SaveResource($scope.theData);
          item.$save(function(response) { 
                  $scope.solution_check_result = response;
                });

        };
        $scope.verify_solution = function(solution, tests) {
          $scope.verify_result = $resource('/jsonapi/check_code_with_interface').get();
        };
}

//The quest controller returns a players quests or specific quest
function QuestController($scope,$resource){
    $scope.quests = [];
    //$scope.quest = {"name":"Quest 1","image": "http://someimage.com/someimage.jpg"};  
    
    $scope.QuestModel = $resource('/jsonapi/quest/:id');
    
    //A method to fetch a generic model and id. 
    
    $scope.fetch = function(id){
      $scope.quest = $scope.QuestModel.get({'id':id});
    };

    $scope.list = function(){
      $scope.quests = $scope.QuestModel.query();
      //$scope.QuestModel.query({}, function(response){
      //    $scope.quests = response;
      //});
    };
    
    $scope.list();

}

//This could be used for development.
//Just create methods to pass in and set the model and id. 
function StoryController($scope,$resource){
    //$scope.location = $location;
		$scope.StoryModel = $resource('/jsonapi/stories');
    
    $scope.story = {"name":"My Cool Story", 
                    "url": "ae_DKNwK_ms"};  
		//A method to fetch a generic model and id. 
    $scope.fetch_stories = function(){
          $scope.StoryModel.query({}, function(response){
              $scope.stories = response;
              //alert("There are "+$scope.stories.length+" stories.");
          });
    };
    $scope.add = function(){
          //Wait for the response and then update phones.
          $scope.AddStory = $resource('/jsonapi/add_story');

          var new_story = new $scope.AddStory($scope.story);
          new_story.$save(function(response){
              //$scope.story = response;
              $scope.fetch_stories();
          });
    };
    $scope.fetch_stories();
}
