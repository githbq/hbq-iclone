import * as  ioHelper from 'io-helper'
import * as  stringify from "json-stringify-pretty-compact"
import { prompt } from 'prompt-promise2'
import * as  _ from 'lodash'
import * as  chalk from 'chalk'
/**
 * 公共属性及方法
 */
export default {
    templateFilePath: ioHelper.pathTool.join(__dirname, '../../', 'templates.json'),
    rootPath: ioHelper.pathTool.join(__dirname, '..'),
    getTemplate() {
        return require(this.templateFilePath)
    },
    getTemplateString() {
        return stringify(this.getTemplate())
    },
    async showTemplate() {
        console.log('\n')
        console.log(`***************************`)
        console.log(chalk.green(await this.getTemplateString()))
        console.log(`***************************`)
        console.log('\n')
    },
    stringify(obj) {
        return stringify(obj);
    },
    async prompt(describe) {
        let value = await prompt(describe)
        return _.trim(value)
    },
    async writeFile(path, content) {
        return await ioHelper.writeFile(path, content)
    },
    async writeTemplate(content) {
        content = _.isString(content) ? content : this.stringify(content)
        return await this.writeFile(this.templateFilePath, content)
    },
    exit() {
        process.exit()
    },
    showError(e) {
        throw e
        // console.error(e.stack)
        // console.error(e.message)
    },
    urlResolve(url) {
        return url.replace(/[\u0000-\u0019]/g, '')
    }
}