'use strict'

exports.findAllSubstringIndexes = function(str, substring) {
    if (str === '' || substring === '') return []
    var indexes = []
    for (var i = 0, len = str.length - substring.length + 1; i < len; i++) {
        if (substring.localeCompare(str.substr(i, substring.length)) === 0) {
            indexes.push(i)
        }
    }

    return indexes
}