import * as  chalk from 'chalk'
import { prompt, showError, showTemplate, getTemplate, writeTemplate } from '../common'
export default {
    /**
     * 删除
     */
    async start({ templateName }) {
        await showTemplate()
        console.log(`\n $> templateName:${templateName} \n `)
        const config = getTemplate()

        !templateName && (templateName = await prompt('模板名称: '))

        if (config.template[templateName]) {
            delete config.template[templateName]
        } else {
            console.log(chalk.red('模板不存在!'))
            return
        }
        await writeTemplate(config)
        console.log(chalk.green(`模板:${templateName} 已删除!`))
        console.log(chalk.grey('当前模板配置:'))
        await showTemplate()

    },
    command: [
        'delete', '删除配置', {
            template: {
                alias: ['t', 'templateName'],
                default: '',
                describe: '模板'
            }
        }
    ]
}