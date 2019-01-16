const chalk = require('chalk')
const inquirer = require('inquirer')
const utils = require('./utils')

const current_branch = 'wk-v1.10'
const origin_branch = {
    default: 'dev',
    choices: ['dev', 'release']
}

inquirer.prompt([{
    type: 'list',
    default: origin_branch.default,
    name: 'branch',
    message: `which branch will you wanna merge the ${current_branch}?`,
    choices: origin_branch.choices
}]).then(answers => {
    let { branch } = answers
    utils.series([
        `git checkout ${branch}`,
        'git pull',
        `git merge ${current_branch}`,
        'git push',
        `git checkout ${current_branch}`,
        'git pull'
    ], function(err) {
        if (err) {
            console.log(chalk.red(err))
            process.exit(0)
        }
        console.log(chalk.green(`Git merge ${branch} finished!`))
        process.exit(0)
    })
}).catch(err => {
    console.log(chalk.red(err))
    process.exit(0)
})