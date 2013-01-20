function dndCtrl($scope) {

    $scope.model = [
        {
            "id": 1,
            "value": "x=1"
        },
        {
            "id": 2,
            "value": "x=2"
        },
        {
            "id": 3,
            "value": "x=3"
        },
        {
            "id": 4,
            "value": "x=4"
        },
        {
            "id": 5,
            "value": "x=5"
        },
        {
            "id": 6,
            "value": "x=6"
        },
        {
            "id": 7,
            "value": "x=7"
        }
    ];

    $scope.source = [
        {
            "id": 1,
            "value": "y=2"
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