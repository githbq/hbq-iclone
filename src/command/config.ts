import * as  chalk from 'chalk'
import * as _ from 'lodash'
import { prompt, showError, showTemplate, getTemplate, writeTemplate, io, localConfigPath } from '../common'
/**
 * 配置文件初始化
 */
export default {
    /**
     * 删除
     */
    async start() {
        //读取项目内的模板
        const config = await getTemplate(true)
        //写入到项目外的模板
        await writeTemplate(config, false)
        console.log(`配置文件初始化完成：${localConfigPath}`)
    },
    command: [
        'config', '初始化配置', {
        }
    ]
}