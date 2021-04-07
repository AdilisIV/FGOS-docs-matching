// 'use strict'
// function findAllSubstringIndexes() {

// }

exports.findAllSubstringIndexes = (str, substring) => {
    if (str === '' || substring === '') return []
    const indexes = []
    for (let i = 0, len = str.length - substring.length + 1; i < len; i++) {
        if (substring.localeCompare(str.substr(i, substring.length)) === 0) {
            indexes.push(i)
        }
    }

    return indexes
}