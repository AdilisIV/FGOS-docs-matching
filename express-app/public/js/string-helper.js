'use strict'

exports.findAllSubstringIndexes = function(str, substring) {
    if (str === '' || substring === '') return []
    var indexes = []
    for (let i = 0, len = str.length - substring.length + 1; i < len; i++) {
        if (substring.localeCompare(str.substr(i, substring.length)) === 0) {
            indexes.push(i)
        }
    }

    return indexes
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.replaceAll = function (str, match, replacement) {
    return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
}