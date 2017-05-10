import * as pathTool from 'path'
import * as  stringify from 'json-stringify-pretty-compact'
import { prompt } from 'prompt-promise2'
import * as  _ from 'lodash'
import * as  chalk from 'chalk'
import spawn from 'spawn-helper'
import * as fs from 'fs'

export const cwd = process.cwd().replace(/\\/g, '/')
/**
 * 公共属性及方法
 */
export function exec(cmd: string, opt?: any) {
    return spawn.exec(cmd, opt)
}
export const templateFilePath = pathTool.join(__dirname, '../../', 'templates.json')
export const rootPath = pathTool.join(__dirname, '..')
export function getTemplate() {
    return require(templateFilePath)
}
export function getTemplateString() {
    return stringify(getTemplate())
}
export async function showTemplate() {
    console.log('\n')
    console.log(`***************************`)
    console.log(chalk.green(await getTemplateString()))
    console.log(`***************************`)
    console.log('\n')
}
export function stringify(obj) {
    return stringify(obj);
}
export async function prompt(describe) {
    let value = await prompt(describe)
    return _.trim(value)
}
export async function writeFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) reject(err);
            resolve({ path, content })
        })
    })

}
export async function writeTemplate(content) {
    content = _.isString(content) ? content : stringify(content)
    return await writeFile(templateFilePath, content)
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


export default { cwd, exec, templateFilePath, rootPath, getTemplate, getTemplateString, showTemplate, stringify, prompt, writeFile, writeTemplate, exit, showError, urlResolve }