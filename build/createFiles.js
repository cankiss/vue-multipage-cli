const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const PAGES_PATH = path.resolve(__dirname, '../src/pages')
const TEMP_PATH = path.resolve(__dirname, './temp')

inquirer
    .prompt([{
        type: 'input',
        name: 'fileName',
        message: 'please input the file name what you want:',
        validate: function(input) {
            let done = this.async();
            if (!input.trim()) {
                done('File name is not a null!')
            }

            if (fs.existsSync(PAGES_PATH + '/' + input)) {
                done('File name is exited!')
            }
            done(null, true)
        }
    }])
    .then(answers => {
        let { fileName } = answers;
        readFiles(fileName).then(arr => {
            writeFiles(fileName, arr)
        })
    })
    .catch(err => {
        console.log(err);
    })

const readFiles = name => new Promise((resolve, reject) => {
    fs.readdir(TEMP_PATH, (e, files) => {
        if (e) reject(e)
        resolve(files.map(item => {
            let postfix = item.substring(item.lastIndexOf('.') + 1),
                text = fs.readFileSync(TEMP_PATH + '/' + item, 'utf8').toString(),
                newText = text.replace(/{{name}}/g, name)
            return {
                postfix,
                newText
            }
        }))
    })
})

const writeFiles = (name, arr) => new Promise((resolve, reject) => {
    fs.mkdir(PAGES_PATH + '/' + name, err => {
        if (err) reject(err)
        arr.forEach(item => {
            let fileName = item.postfix === 'vue' ? `${PAGES_PATH}/${name}/app.vue` :
                `${PAGES_PATH}/${name}/${name}.${item.postfix}`
            fs.writeFileSync(fileName, item.newText)
        })
    })
})