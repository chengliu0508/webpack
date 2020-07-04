const path = require('path');

const config = require(path.resolve('webpack.config.js'));

const Compiler = require('./compiler');

const compiler = new Compiler(config);

compiler.run();