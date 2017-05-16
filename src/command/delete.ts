import * as  chalk from 'chalk'
import * as _ from 'lodash'
import { prompt, showTemplate, getTemplate, writeTemplate, io, localConfigPath, consoleColor } from '../lib'
/**
 * 是否操作项目自身配置
 */
let isSelf = false
export default {
    /**
     * 删除
     */
    async start({ templateName, self }) {
        isSelf = self
        await showTemplate(isSelf)
        let config: any = await getTemplate(isSelf)
        !templateName && (templateName = await prompt('模板名称: '))
        if (config.template[templateName]) {
            delete config.template[templateName]
        } else {
            console.log(chalk.red('模板不存在!'))
            return
        }
        await writeTemplate(config, isSelf)
        consoleColor.green(`模板:${templateName} 已删除!`)
        consoleColor.grey('当前模板配置:')
        await showTemplate(isSelf)

    },
    command: [
        'delete', '删除配置', {
            self: {
                describe: '配置文件保存到项目里面,这会随着重装而消失，作者使用用来发布代码',
                default: false,
                boolean: true,
                alias: ['s']
            },
            template: {
                alias: ['t', 'templateName'],
                default: '',
                describe: '模板'
            }
        }
    ]
}