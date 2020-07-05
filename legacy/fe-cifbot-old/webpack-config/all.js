// test/all.js
var core = require.context('../core', true, /\.js$/);
core.keys().forEach(core);

var app = require.context('../features', true, /\.js$/);
app.keys().forEach(app);