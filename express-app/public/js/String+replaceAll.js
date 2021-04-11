// function escapeRegExp(string) {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }
// function replaceAll(str, match, replacement) {
//     return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
// }

// // String.prototype.replaceAll = function (match, replacement) {
// //     return this.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
// // }