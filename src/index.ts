#!/usr/bin/env node --harmony                      
import * as  yargs from 'yargs'
import initCommand from './command/init'
import addCommand from './command/add'
import listCommand from './command/list'
import deleteCommand from './command/delete'

let argv = yargs
    .command('init', '初始化新项目', {
        template: {
            alias: ['t', 'templateName'],
            default: '',
            describe: '模板'
        },
        name: {
            alias: ['n', 'projectName'],
            default: '',
            describe: '项目名称'
        }
    },
    (argv) => {
        initCommand.start(argv)
    })
    .help()
    .command('add', '添加配置', {
        template: {
            alias: ['t', 'templateName'],
            default: '',
            describe: '模板'
        },
        url: {
            alias: ['u', 'gitUrl'],
            default: '',
            describe: 'git地址'
        },
        branch: {
            alias: ['b'],
            default: '',
            describe: 'git分支'
        }
    }, (argv) => {
        addCommand.start(argv)
    })
    .help()
    .command('delete', '删除配置', {
        template: {
            alias: ['t', 'templateName'],
            default: '',
            describe: '模板'
        }
    },
    (argv) => {
        deleteCommand.start(argv)
    })
    .help()
    .command('list', '查看当前配置', (argv) => { 
        listCommand.start(argv)
    })
    .help()
    .argv

if (!argv._.length) {
    yargs.showHelp()
}