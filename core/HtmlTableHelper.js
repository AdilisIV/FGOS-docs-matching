var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
const removeSuffix = require('remove-suffix')


function extractCodeName(str) {
    const regex = /([\u0400-\u04FF]*\s\d*\.)|([\u0400-\u04FF]*\-\d*\.)|([\u0400-\u04FF]*\s\d*\s)/g;
    let m;

    if ((m = regex.exec(str)) !== null) {
        var result = m[0];
        result = removeSuffix(result, '.')[0]
        result = removeSuffix(result, ' ')[0]

        var re = /\s/gi;
        var result = result.replace(re, '-');

        return result
    }

    return null
}

function remove_duplicates(arr) {
    var a = []
    for (i in arr) {
        if (a.indexOf(i) == null) {
            a.append(i)
        }
    }
    
    return a
}


exports.searchDiscAndCodeInTable = function(htmlTableStr) {
    $ = cheerio.load(htmlTableStr);

    cheerioTableparser($);
    var matrix = $("table").parsetable(true, true, true);

    var transposedMatrix = transpose(matrix)
    transposedMatrix.splice(0, 2);

    // console.log(matrix);
    //
    // ->

    // {
    //     "Корпоративные информационные системы\": [\"ОПК-7\", \"ПК-1\"], 
    //     "Информационная безопасность и защита информации\": [\"ОПК-4\", \"ОПК-7\", \"ПК-4\"],
    //     "Администрирование информационных систем\": [\"ПК-4\"]
    // }

    var result = {}
    var curDis = transposedMatrix[0][0]
    var curDisCodes = []


    for(let i = 0; i < transposedMatrix.length; i++) {

        if (transposedMatrix[i][0] == curDis) {
            curDisCodes.push(extractCodeName(transposedMatrix[i][1]))
        } else {
            result[curDis] = curDisCodes
            curDisCodes = []
        }
        curDis = transposedMatrix[i][0]
    }

    result[curDis] = curDisCodes
    return result
}

function transpose( matrix ) {
	
	var result = new Array( matrix[ 0 ].length );
	
	for ( var i = 0; i < result.length; i++ ) {
		
		result[ i ] = new Array( matrix.length );
		for ( var j = 0; j < result[ i ].length; j++ ) {
			
			result[ i ][ j ] = matrix[ j ][ i ];
		}
	}
	
	return result;
}
