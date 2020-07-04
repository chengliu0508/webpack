const loaderUtils = require('loader-utils')
module.exports =function(source){
    const options = loaderUtis.getOptions(this)
    return 'module.exports = ' + JSON.stringify(source);
}