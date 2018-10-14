    var correct = "1,2,3,4,5,6,7,8,9";
    var correctArray = [                             // The array which is solved from sudoku sample.
        [9, 3, 2, 8, 4, 1, 5, 6, 7],
        [6, 4, 7, 3, 2, 5, 9, 8, 1],
        [1, 5, 8, 9, 7, 6, 2, 4, 3],
        [4, 7, 1, 6, 8, 2, 3, 5, 9],
        [5, 2, 6, 4, 3, 9, 7, 1, 8],
        [8, 9, 3, 1, 5, 7, 6, 2, 4],
        [7, 1, 4, 2, 6, 3, 8, 9, 5],
        [2, 8, 5, 7, 9, 4, 1, 3, 6],
        [3, 6, 9, 5, 1, 8, 4, 7, 2]
    ];

    function checkRows(array) {
        var newArray = [];
        array = newArray;
         
        var valid = true;
        newArray.forEach(function(row) {
           
            if (row.sort().toString() !== correct) {
                valid = false;
            }
        });
        
        console.log(valid);
        return valid
    }

    function checkCols(array) {
        var colArray = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for (var i = 0; i <= 8; i++) {
            array.forEach(function(col) {
                colArray[i].sort().push(col[i]);
            });
        }
        console.log(colArray);
        return checkRows(colArray);
    }

    function checkSudoku() {
        checkRows(correctArray);
        checkCols(correctArray);
    }
    checkSudoku();