import * as  chalk from 'chalk'
import common from './common'
const { prompt, exit, showError } = common
export default {
    /**
     * 删除
     */
    async start({ templateName }) {
        await common.showTemplate();
        console.log(`\n $> templateName:${templateName} \n `)
        const config = common.getTemplate()

        !templateName && (templateName = await prompt('模板名称: '))

        if (config.template[templateName]) {
            delete config.template[templateName]
        } else {
            console.log(chalk.red('模板不存在!'))
            exit()
        }

        try {
            await common.writeTemplate(config)
            console.log(chalk.green('模板已删除!'))
            console.log(chalk.grey('当前模板配置:'))
            await common.showTemplate()
        } catch (e) {
            showError(e)
        }
        exit()
    }
}