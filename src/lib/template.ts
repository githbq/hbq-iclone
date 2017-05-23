import * as pathTool from 'path'
import * as _ from 'lodash'
//获取当前用户目录 跨平台
import * as userHome from 'user-home'

import { consoleColor } from './consoleColor'
import { rootPath, cwd } from './consts'
import { io } from './io'
import { stringify } from './other'

//本地配置文件地址
export const localConfigPath = pathTool.join(userHome, '.iclonerc')
//本项目配置文件地址
export const templateFilePath = pathTool.join(rootPath, 'templates.json')

export async function getTemplate(self = false) {
    if (!self && !await io.exists(localConfigPath)) {
        await io.write(localConfigPath, getEmptyTemplate())
    }
    let configString = await io.read(self ? templateFilePath : localConfigPath)
    return JSON.parse(configString)
}
export async function getTemplateString(self = false) {
    const jsonString = stringify(await getTemplate(self))
    return jsonString
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
    consoleColor.yellow(`**********************当前模板配置**********************`, null, true)
    consoleColor.green(await getTemplateString(self), null, true)
    consoleColor.yellow(`*******************************************************`, null, true)
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