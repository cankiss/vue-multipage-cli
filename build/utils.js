/**
 * some tools for webpack
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const dotenv = require('dotenv')
const chalk = require('chalk')
const shell = require('shelljs')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')
const pages_path = path.resolve(__dirname, '../src/pages')

exports.resolve = dir => path.join(__dirname, '..', dir)

exports.formatEnvData = env => {
    let dotenvPath = fs.existsSync(exports.resolve('.env.' + env + '.local')) ?
        exports.resolve('.env.' + env + '.local') :
        exports.resolve('.env.' + env),
        envData = dotenv.parse(fs.readFileSync(dotenvPath));

    return Object.keys(envData).reduce((obj, key) => {
        let pKey = `process.env.${key}`
        process.env[key] = obj[pKey] = JSON.stringify(envData[key])
        return obj
    }, {})
}

exports.getFileName = (postfix = 'js') => glob.sync(pages_path + '/*').reduce((allPath, filePath) => {
    let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1)
    allPath[fileName] = `${filePath}/${fileName}.${postfix}`
    return allPath
}, {})

exports.htmlWebpackPluginEntries = () => {
    let entriesHtml = exports.getFileName('html'),
        confArr = Object.keys(entriesHtml).map(fileName => {
            return {
                template: entriesHtml[fileName],
                filename: fileName + '.html',
                chunks: [fileName],
                debuger: process.env.debuger
            }
        });
    return confArr.map(item => new HtmlWebpackPlugin(item))
}

exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.generateStyleLoaders = function(options) {
    const output = [],
        { sourceMap, extract } = options,
        generateLoaders = (loader, loaderOption = {}) => {
            const
                firstLoader = extract ? miniCssExtractPlugin.loader : 'vue-style-loader',
                cssLoader = {
                    loader: 'css-loader',
                    options: {
                        sourceMap
                    }
                },
                postcssLoader = {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap
                    }
                },
                otherLoader = loader ? {
                    loader: loader + '-loader',
                    options: Object.assign({}, {
                        sourceMap
                    }, loaderOption)
                } : []
            return [firstLoader, cssLoader, postcssLoader].concat(otherLoader)
        },
        loaders = {
            css: generateLoaders(),
            less: generateLoaders('less').concat({
                loader: "style-resources-loader",
                options: {
                    patterns: path.resolve(__dirname, "../src/assets/css/variable.less"),
                    injector: "append"
                }
            }),
            sass: generateLoaders('sass', {
                indentedSyntax: true
            }),
            scss: generateLoaders('sass'),
            stylus: generateLoaders('stylus'),
            styl: generateLoaders('stylus')
        }

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

exports.generateBabelLoader = targets => {
    return {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [exports.resolve('src')],
        options: {
            presets: [
                ['@babel/preset-env', {
                    modules: false,
                    useBuiltIns: 'entry',
                    targets
                }]
            ]
        }
    }
}

/**
 * for git merge & create files
 */

//look up all os process
exports.viewProcessMessage = function(name, cb) {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    childProcess.exec(cmd, function(err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        stdout.split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[processMessage.length - 1]
            if (processName === name) {
                return cb(processMessage[1]) //processMessage[1]进程id
            }
        })
    })
}

// execute a single shell command where "cmd" is a string
exports.exec = function(cmd, cb) {
    // this would be way easier on a shell/bash script :P
    var parts = cmd.split(/\s+/g);
    var p = childProcess.spawn(parts[0], parts.slice(1), {
        stdio: 'inherit'
    });
    p.on('exit', function(code) {
        var err = null;
        if (code) {
            err = new Error('command "' + cmd + '" exited with wrong status code "' + code + '"');
            err.code = code;
            err.cmd = cmd;
        }
        if (cb) cb(err);
    });
};


// execute multiple commands in series
// this could be replaced by any flow control lib
exports.series = function(cmds, cb) {
    var execNext = function() {
        let cmd = cmds.shift();
        console.log(chalk.blue('run command: ') + chalk.magenta(cmd));
        shell.exec(cmd, function(err) {
            if (err) {
                cb(err);
            } else {
                if (cmds.length) execNext();
                else cb(null);
            }
        });
    };
    execNext();
};