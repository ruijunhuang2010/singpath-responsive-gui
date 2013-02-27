function dndCtrl($scope) {

    $scope.model = [
        {
            "id": 1,
            "value": "def iterquad ():"
        },
        {
            "id": 2,
            "value": "for i in range(5):"
        },
        {
            "id": 3,
            "value": "yield (i*i)"
        },
        {
            "id": 4,
            "value": "for j in iterquad():"
        },
        {
            "id": 5,
            "value": "print j"
        },
        {
            "id": 6,
            "value": "def quadcube (x):"
        },
        {
            "id": 7,
            "value": "a, b = quadcube(3)"
        }
    ];

    $scope.source = [
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