import * as  chalk from 'chalk'
import * as _ from 'lodash'
import { prompt, showError, showTemplate, getTemplate, writeTemplate, io, localConfigPath } from '../common'
let isSelf = false
export default {
    /**
     * 删除
     */
    async start({ templateName, self }) {
        isSelf = self
        await showTemplate(isSelf)
        let config: any

        !templateName && (templateName = await prompt('模板名称: '))
        config = await getTemplate(isSelf)
        if (config.template[templateName]) {
            delete config.template[templateName]
        } else {
            console.log(chalk.red('模板不存在!'))
            return
        }
        await writeTemplate(config, isSelf)
        console.log(chalk.green(`模板:${templateName} 已删除!`))
        console.log(chalk.grey('当前模板配置:'))
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