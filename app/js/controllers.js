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
    $scope.path_progress = {};

    $scope.update_path_details = function(){
        $scope.player_paths = $resource('/jsonapi/get_my_paths').get();
        $scope.current_paths = $resource('/jsonapi/get_current_paths').get();
        $scope.other_paths = $resource('/jsonapi/get_other_paths').get();
    };

    $scope.update_path_progress = function(pathID){
        $scope.PathModel = $resource('/jsonapi/get_path_progress/:pathID');

        //Including details=1 returns the nested problemset progress.
        $scope.PathModel.get({"pathID":pathID,"details":1}, function(response){
            $scope.path_progress[pathID] = response;
        });
        ///jsonapi/get_path_progress/10030, 2462233, 6920762
    }; 
}

function ProblemsetController($scope,$resource){
    $scope.pathID = null;
    $scope.problemsets = null;
    
    $scope.ProblemsetModel = $resource('/jsonapi/problemsets/:pathID');
    
    $scope.get_problemsets = function(){
        $scope.problemsets = $scope.ProblemsetModel.get({"pathID":$scope.pathID});
    };
}

function ProblemController($scope,$resource){
    $scope.problemsetID = null;
    $scope.problems = null;

    $scope.ProblemsetProgress = $resource('/jsonapi/get_problemset_progress/:problemsetID');
    $scope.ProblemModel = $resource('/jsonapi/problems/:problemsetID');
    

    $scope.get_progress = function(){
        $scope.progress = $scope.ProblemsetProgress.get({"problemsetID":$scope.problemsetID});
    };

    $scope.get_problems = function(){
        //Including ?details=1 will return if the problem has been solved. 
        //$scope.problems = $scope.ProblemModel.get({"problemsetID":$scope.problemsetID});
        $scope.problems = $scope.ProblemModel.get({"problemsetID":$scope.problemsetID, "details":1});
    };
}


function BadgeController($scope,$resource){
        $scope.playerBadges = $resource('/jsonapi/badges_for_current_player').get();
}


function GameController($scope,$resource){
        //$scope.currentProblem
        //$scope.game = $resource('test_data/python_game.json').get();
        //$scope.mobile_game = $resource('test_data/mobile_python_game.json').get();
        
        /*
        To play a game via the SingPath API you must do the following. 
        1. Create a game using create_practice_game and get the gameID in the response. 
        2. Call check_solution_for_game() for a problem until the player correctly solves the problem. 
        3. Call fetch(gameID) to get the updated status of the game after correct solves. 
        4. Redirect the player to the proper page once the game is completed. 
        */
        $scope.skip_problem_count = 0;
        $scope.current_problem_index = 0;
        $scope.permutation = "12345"; 
        
        $scope.create_practice_game = function(pathID,LevelID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game');
          
          $scope.CreateGameModel.get({}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

        $scope.create_path_game = function(pathID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/pathID/:pathID/numProblems/:numProblems');
          //alert(pathID+" "+numProblems);
          $scope.CreateGameModel.get({"pathID":pathID,"numProblems":numProblems}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

        $scope.create_problemset_game = function(problemsetID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/numProblems/:numProblems');
          
          $scope.CreateGameModel.get({"problemsetID":problemsetID,"numProblems":numProblems}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

        $scope.create_resolve_problemset_game = function(problemsetID){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/resolve');
          
          $scope.CreateGameModel.get({"problemsetID":problemsetID}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };         
        /*
        Create Tournament Game.
        
        */

        $scope.create_quest_game = function(questID){
          $scope.CreateGameModel = $resource('/jsonapi/create_quest_game');
          
          $scope.CreateGameModel.get({}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };
        
        $scope.fetch = function(gameID){
          $scope.GameModel = $resource('/jsonapi/game/:gameID');
          
          $scope.GameModel.get({"gameID":gameID}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

        $scope.update_remaining_problems = function(){
          $scope.remaining_problems = [];
          //loop through problems and find unsolved. Add to remaining_problems.
          for (var i = 0; i < $scope.game.problemIDs.length; i++) {
            if($scope.game.solvedProblemIDs.indexOf($scope.game.problemIDs[i])<0){
              $scope.remaining_problems.push($scope.game.problemIDs[i]);
            }
          }
          //Update the current problem index based on remaining problems and items skipped. 
          $scope.move_to_next_unsolved_problem();
        };

        $scope.move_to_next_unsolved_problem = function(){
          if ($scope.remaining_problems.length>0){
            //Todo:If you are already on the problem, you don't need to reload it. 
            $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
            $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
            $scope.solution = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
            $scope.solution_check_result = null;
          }else{
            $scope.current_problem=null;
            $scope.current_problem_index = null;
            $scope.solution = null;
            $scope.solution_check_result = null;
          }

        }
        $scope.skip_problem = function(){
          if ($scope.remaining_problems.length>1){
            $scope.skip_problem_count += 1;
            $scope.move_to_next_unsolved_problem();
          }
        }

        $scope.check_solution_for_game = function() {
          //$scope.solution
          //$scope.current_problem
          //$scope.game.gameID
          //alert($scope.solution+" "+$scope.current_problem+" "+$scope.game.gameID);

          $scope.SaveResource = $resource('/jsonapi/verify_for_game');
       
          $scope.theData = {user_code:$scope.solution,
                            problem_id:$scope.current_problem,
                            game_id:$scope.game.gameID};
          
          var item = new $scope.SaveResource($scope.theData);
          item.$save(function(response) { 
                  $scope.solution_check_result = response;
                  if($scope.solution_check_result.last_solved){
                    $scope.fetch($scope.game.gameID);//To update game status.
                  }
          });

        };
        $scope.verify_solution = function() {
          //$scope.solution
          //$scope.tests
          $scope.solution_check_result = $resource('/jsonapi/check_code_with_interface').get();
        };
        //Mobile Problem Methods
        //If the user selects a correct permutation. 
        //You can mark the permutation correct and post to the server. 
        //This will result in the game proceeding. 

        $scope.check_permutation = function() {
          //$scope.permutation
          //$scope.tests
          //alert("permutation="+$scope.permutation);
          //Update the solution with the permutations of lines.
          $scope.permutation_lines = "";
          //Loop through the permutation and add all of the lines of code
          for (var i = 0; i < $scope.permutation.length; i++) {
            //alert(parseInt($scope.permutation[i]));
            $scope.permutation_lines += $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt($scope.permutation[i])-1]+"\n";
          }
          //Then put the resulting combination of lines in the solution model. 
          $scope.solution = $scope.permutation_lines;
          $scope.solution_check_result =  {"error":"This solution will not compile."};
          $scope.ner =  {"error":"This solution will not compile."};
          
          var nonErrorResult = $scope.game.problems.problems[$scope.current_problem_index].nonErrorResults[$scope.permutation];
          if(nonErrorResult){
        
            $scope.solution_check_result = nonErrorResult;
            $scope.ner = nonErrorResult;
            //If the solution passes, then call verify for the solution to progress in the game. 
            if(nonErrorResult.solved){
              $scope.check_solution_for_game();
              //alert("All solved. Checking solution for game."+nonErrorResult.solved);
            }
          }
   
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

function TournamentController($scope,$resource,$http){
    $scope.TournamentModel = $resource('/jsonapi/list_open_tournaments');
    $scope.TournamentHeatGameModel = $resource('/jsonapi/create_game/heatID/:heatID');
    
    $scope.TournamentHeatModel = $resource('/jsonapi/get_heat_ranking');
    $scope.tournamentID = null;
    //$scope.heatID = 12883052;
    $scope.heat = null;
    
    //A method to fetch a generic model and id. 
    //Pass in ID
    $scope.fetch_heat = function(heatID){
          $scope.TournamentHeatModel.get({"heatID":heatID}, function(response){
              $scope.heat = response;
          });
    };

    $scope.create_heat_game = function(){
          $scope.TournamentHeatGameModel.get({"heatID":$scope.heat.heatID}, function(response){
              $scope.game = response;
          });
    };

    $scope.fetch_tournaments = function(){
          $scope.TournamentModel.query({}, function(response){
              $scope.tournaments = response;
          });
    };

    $scope.register_for_tournament = function(){
        //Use a normal form post for this legacy API.
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $http.post("/jsonapi/verify_tournament_password", {
            tournamentID: $scope.tournamentID,
            password: $scope.tournamentPassword
        }).success(function (data, status, headers, config) {
            $scope.registration_response = data;
        }).error(function (data, status, headers, config) {
            $scope.registration_response = data;
        });
    };

    $scope.play_tournament = function(){
          alert("Preparing to launch tournament game.");
          //$scope.TournamentModel.query({}, function(response){
          //    $scope.tournaments = response;
          //});
    };

    
}
