import * as pathTool from 'path'
import * as  stringifyOrigin from 'json-stringify-pretty-compact'
import { prompt } from 'prompt-promise2'
import * as  _ from 'lodash'
import * as  chalk from 'chalk'
import spawn from 'spawn-helper'
import * as fs from 'fs-extra-promise'
//获取当前用户目录 跨平台
import * as userHome from 'user-home'

export const cwd = process.cwd().replace(/\\/g, '/')
export const localConfigPath = pathTool.join(userHome, '.iclonerc')
/**
 * 公共属性及方法
 */
export function exec(cmd: string, opt?: any) {
    return spawn.exec(cmd, opt)
}

export const rootPath = pathTool.join(__dirname, '..')
export const templateFilePath = pathTool.join(rootPath, 'templates.json')
export async function getTemplate(self = false) {
    if (!self && !await io.exists(localConfigPath)) {
        await io.write(localConfigPath, getEmptyTemplate())
    }
    let configString = await io.read(self ? templateFilePath : localConfigPath)
    return JSON.parse(configString)
}
export async function getTemplateString(self = false) {
    return stringify(await getTemplate(self))
}
/**
 * 空模板
 */
export function getEmptyTemplate() {
    return {
        template: {}
    }
}
export async function showTemplate(self = false) {
    console.log('\n')
    console.log(`***************************`)
    console.log(chalk.green(await getTemplateString(self)))
    console.log(`***************************`)
    console.log('\n')
}
/**
 * 
 * @param content 内容
 * @param self 是否读取项目配置 否则读取用户配置
 */
export async function writeTemplate(content, self = false) {
    content = _.isString(content) ? content : stringify(content)
    return await io.write(self ? templateFilePath : localConfigPath, content)
}
export function stringify(obj) {
    return stringifyOrigin(obj)
}
export async function prompt(describe) {
    let value = await prompt(describe)
    return _.trim(value)
}
export const io = {
    pathTool,
    read(path) {
        path = pathTool.join.apply(null, [].concat(path))
        return fs.readFileAsync(path, 'utf8')
    },
    write(path, content, options: any = { fromRoot: false, fromCwd: false }) {
        path = pathTool.join.apply(null, [].concat(path))
        path = pathTool.join.apply(null, (options.fromRoot ? [rootPath] : options.fromCwd ? [cwd] : []).concat(path))//考虑多路径处理
        //对对象进行 美化格式处理
        content = _.isObject(content) ? stringify(content) : content
        return fs.outputFileAsync(path, content)
    }, delete(path) {
        path = pathTool.join.apply(null, [].concat(path))
        return fs.removeAsync(path)
    },
    exists(path) {
        path = pathTool.join.apply(null, [].concat(path))
        return fs.existsAsync(path)
    }
}

export function exit() {
    process.exit()
}
export function showError(e) {
    throw e
    // console.error(e.stack)
    // console.error(e.message)
}
export function urlResolve(url) {
    return url.replace(/[\u0000-\u0019]/g, '')
}


export default { localConfigPath, io, cwd, exec, templateFilePath, rootPath, getTemplate, getTemplateString, showTemplate, stringify, prompt, writeTemplate, exit, showError, urlResolve }