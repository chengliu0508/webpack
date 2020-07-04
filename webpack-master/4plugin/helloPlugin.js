function helloPlugin(options){
    helloPlugin.prototype.apply = function(compiler){
        compiler.plugin('compilation',function(compilation){
            compilation.plugin('optimize',function(){
                console.log('assets are being optimized')
            })
        })
    }
}