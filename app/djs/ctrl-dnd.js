function dndCtrl($scope) {

    $scope.model = [
        {
            "id": 1,
            "value": "Learn Javascript."
        },
        {
            "id": 2,
            "value": "Learn Python."
        },
        {
            "id": 3,
            "value": "Learn Beginner Python."
        },
        {
            "id": 4,
            "value": "Learn Java."
        }
    ];

    $scope.source = [
        {
            "id": 5,
            "value": "What do you mean \"brought it bowling\"? I didn't rent it shoes."
        },
        {
            "id": 6,
            "value": "Keep your ugly fucking goldbricking ass out of my beach community! "
        },
        {
            "id": 7,
            "value": "What the fuck are you talking about? I converted when I married Cynthia!"
        },
        {
            "id": 8,
            "value": "Ja, it seems you forgot our little deal, Lebowski."
        }
    ];

    // watch, use 'true' to also receive updates when values
    // change, instead of just the reference
    $scope.$watch("model", function(value) {
        console.log("Model: " + value.map(function(e){return e.id}).join(','));
    },true);

    // watch, use 'true' to also receive updates when values
    // change, instead of just the reference
    $scope.$watch("source", function(value) {
        console.log("Source: " + value.map(function(e){return e.id}).join(','));
    },true);


    $scope.sourceEmpty = function() {
        return $scope.source.length == 0;
    }

    $scope.modelEmpty = function() {
        return $scope.model.length == 0;
    }

}