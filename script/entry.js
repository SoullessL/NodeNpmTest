// entry.js
require("../style/style.css");
require("../style/test.scss");
require("core.js");
document.write('It works!');
document.write(require('./module.js'));

Promise.resolve(32).then(x => console.log(x));
