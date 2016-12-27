// entry.js
require("../style/style.css");
require("../style/test.scss");
document.write('It works.');
document.write(require('./module.js'));

// requirejs
// document.write(require('./module.js').name);