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

function GameController($scope,$resource,$cookieStore,$location){
		//initialization: 

		$scope.autoCheck="yes"; //make autocheck available when page load
		$scope.notCompile = 'false'; //hide not compile warning before the game loaded
		$scope.advancedCheck = "false";
    $scope.qid = $cookieStore.get("name").id; //retrieve quest id from Storyboard page
		$scope.source = []; //initialize the solution drag and drop field

		$scope.sourceEmpty = function() {
			return $scope.source.length == 0;
		}
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
        $("#example").popover({
            placement: 'bottom',
        });
        $('#startVideo').trigger('click');
        $scope.solvedProblems = 0;
        $scope.skip_problem_count = 0;
        $scope.current_problem_index = 0;
        $scope.permutation_lines = {origional: []};
        $scope.line_outcome;

        $scope.assign_id = function() {
            $scope.permutation_lines = {origional: []};
            //Loop through the permutation and add all of the lines of code
            for (var i = 0; i < $scope.game.problems.problems[$scope.current_problem_index].lines.length ; i++) {
                $scope.permutation_lines.origional.push({"content": $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt(i)],"id": (i+1)});
            }
            $scope.line_outcome = $scope.permutation_lines;
        }

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
          $scope.NewQuestGame = $resource('/jsonapi/create_quest_game/:questID');
          $scope.NewQuestGame.get({'questID':questID}, function(response){
              $scope.game = response;
              $scope.fetch($scope.game.gameID);
              //$scope.update_remaining_problems();
              $scope.update_quest();
              //alert("reply for create quest game in game model");
              //Update the parent game model by calling game fetch method. 
          });
          /*
          $scope.CreateGameModel.get({}, function(response){

            $scope.game = response;
            //Fetch the game from game ID. 
            $scope.fetch($scope.game.gameID);
            $scope.update_remaining_problems();
          });
          */
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
          var counter = 0;
          if ($scope.remaining_problems.length>0){
            //Todo:If you are already on the problem, you don't need to reload it. 
            $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
            $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
            $scope.solution = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
            $scope.solution_check_result = null;
            if (counter == 0){
              $scope.assign_id();
            }
            counter++;
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
            $scope.source = [];
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
        //Mobile Problem Methods
        //If the user selects a correct permutation. 
        //You can mark the permutation correct and post to the server. 
        //This will result in the game proceeding. 

        //$scope.$watch('solution_check_result', function() {
            //alert("Hi");
        //}); // initialize the watch

        $scope.check_permutation = function() {
          //$scope.permutation
          //$scope.tests
          //alert("permutation="+$scope.permutation);
          //Update the solution with the permutations of lines.
          $scope.permutation = "";
          $scope.permutation_lines = "";
          //Loop through the permutation and add all of the lines of code
          for (var i = 0; i < $scope.game.problems.problems[$scope.current_problem_index].lines.length - 1; i++) {
            //alert(parseInt($scope.permutation[i]));
            $scope.permutation_lines += $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt(i)]+"\n";
          }

          for (var i = 0; i < $scope.source.length; i++) {
            //alert(parseInt($scope.permutation[i]));
            $scope.permutation += "" + $scope.source[parseInt(i)].id;
          }

          //Then put the resulting combination of lines in the solution model. 
          $scope.solution = $scope.permutation_lines;
          $scope.solution_check_result =  {"error":"This solution will not compile."};
          $scope.ner = {"error":"This solution will not compile."};

          var nonErrorResult = $scope.game.problems.problems[$scope.current_problem_index].nonErrorResults[$scope.permutation];
    		  var autocheck = $scope.autoCheck;
    		  var advancedcheck = $scope.advancedCheck;
    		  
    		  if(autocheck=="yes"){
        		  if(nonErrorResult){
        			$scope.notCompile = 'false';
        			$scope.solution_check_result = nonErrorResult;
        			$scope.ner = nonErrorResult;
        			
        			//If the solution passes, then call verify for the solution to progress in the game. 
        			if(nonErrorResult.solved){
        				$('#pop_info_Pane').modal('show');
        				if($scope.solvedProblems < $scope.game.numProblems){
        					$scope.solvedProblems += 1;
        				}
        				if($scope.solvedProblems == 10){
        					document.getElementById("endVideo").style.visibility="visible";
        					$('#endVideo').trigger('click');
        				}
        				//$scope.check_solution_for_game();
        			}
        			else{
        				$('#pop_info_Pane2').modal('show');
        			}
        		  }
        		  else{
        				$scope.notCompile = 'true';
        		  }
    		  }
    		  else if(autocheck=="no" && advancedcheck == "yes"){
  	        $scope.notCompile = 'false';
    			  if(nonErrorResult){
    				$scope.notCompile = 'false';
    				$scope.solution_check_result = nonErrorResult;
    				$scope.ner = nonErrorResult;
    				
    				//If the solution passes, then call verify for the solution to progress in the game. 
    				if(nonErrorResult.solved){
    					//$('#pop_info_Pane').modal('show');
    					$scope.skip_problem();
    					if($scope.solvedProblems < $scope.game.numProblems){
    						$scope.solvedProblems += 1;
    					}
    					if($scope.solvedProblems == $scope.game.numProblems){
    						document.getElementById("endVideo").style.visibility="visible";
    						$('#endVideo').trigger('click');
    					}
    					//$scope.check_solution_for_game();
    				}
    			  }
    			}
        };

        $scope.update_quest = function() {
          var currentNumVideos = 1;
          $resource('/jsonapi/quest/:questID').get({"questID":$scope.game.questID},
          function(response){
            $scope.quest = response;
            //alert("Retrieved quest. Could check for video unlocks here.");
          });
        };

        $scope.create_quest_game($scope.qid);
        //$scope.fetch(1798);
}