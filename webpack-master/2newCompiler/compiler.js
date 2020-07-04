const path = require('path');

const fs = require('fs');

const ejs = require('ejs');

// babylon 主要把源码转换成ast

const babylon = require('babylon');

// @babel/traverse

const traverse = require('@babel/traverse').default;

// @babel/types

const t = require('@babel/types');

// @babel/generator

const generator = require('@babel/generator').default;

class Compiler {

    constructor(config) {

        this.config = config;

        // 需要保存入口文件的路径

        this.entryId;

        // 需要保存所有模块的依赖

        this.modules = {};

        // 入口路径

        this.entry = config.entry;

        // 工作路径

        this.root = process.cwd();

    }

    run() {

        // 执行并且创建模块的依赖关系

        this.buildModule(path.resolve(this.root, this.entry), true);

        // 发射一个打包后的文件

        this.emitFile()

    }

    /**

    * 根据路径来获取文件的内容

    */

    getSource(modulePath) {

        const content = fs.readFileSync(modulePath, 'utf8');

        return content;

    }

    /**

    * 构建模块

    */

    buildModule(modulePath, isEntry) {

        // 拿到模块的内容

        const source = this.getSource(modulePath);

        // 拿到模块的id modulePath - this.root

        const moduleName = './' + path.relative(this.root, modulePath);

        if (isEntry) {

            this.entryId = moduleName

        }

        // 解析，需要把source源码进行改造，返回一个依赖列表

        const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName));

        this.modules[moduleName] = sourceCode;

        // 把相对路径和模块中的内容 对应起来

        dependencies.forEach(dep => {

            // 附模块的递归加载

            this.buildModule(path.join(this.root, dep), false);

        });

    }

    /**

    * 解析文件

    */

    parse(source, parentPath){

        // AST 解析语法树

        const ast = babylon.parse(source);

        const dependencies = [];

        traverse(ast, {

            CallExpression(p) {

                // 对应的节点

                const {node} = p;

                if (node.callee.name === 'require') {

                    node.callee.name = '__webpack_require__';

                    // 模块的引用名字

                    let moduleName = node.arguments[0].value;

                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')

                    moduleName = './' + path.join(parentPath, moduleName);

                    dependencies.push(moduleName);

                    node.arguments = [t.stringLiteral(moduleName)]

                }

            }

        });

        const sourceCode = generator(ast).code;

        return {

            sourceCode,

            dependencies

        }

    }

    /**

    * 发射文件

    */

    emitFile() {

        // 拿到输出的目录

        const main = path.join(this.config.output.path, this.config.output.filename);

        const templatStr = this.getSource(path.join(__dirname, 'main.ejs'));

        const code = ejs.render(templatStr, { entryId: this.entryId, modules: this.modules })

        this.assets = {};

        // 资源中，路径对应的代码

        this.assets[main] = code;

        fs.writeFileSync(main, this.assets[main]);

    }

}

module.exports = Compiler