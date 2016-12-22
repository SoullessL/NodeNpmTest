// entry.js
require("../style.css");
document.write('It works.');
document.write(require('./module.js'));

// requirejs
// document.write(require('./module.js').name);