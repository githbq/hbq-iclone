import * as  chalk from 'chalk'
import { showError, urlResolve, prompt, getTemplate, showTemplate, writeTemplate } from '../common'
export default {
    /**
     * 新增
     */
    async start({ templateName, gitUrl, branch, description }) {
        const config = await getTemplate()
        await showTemplate()
        console.log(`\n $> templateName:${templateName},gitUrl:${gitUrl},branch:${branch} \n`)

        !templateName && (templateName = await prompt('模板名称: '))

        !gitUrl && (gitUrl = await prompt('Git地址: '))

        !branch && (branch = await prompt('分支: '))

        !description && (description = await prompt('描述: '))

        if (!config.template[templateName]) {
            const url = urlResolve(gitUrl)
            config.template[templateName] = { description, branch, url }
        } else {
            console.log(chalk.red('模板已存在!'))
            return
        }
        await writeTemplate(config)
        console.log(chalk.green('模板添加成功!\n'))
        console.log(chalk.grey('当前模板配置: \n'))
        await showTemplate()
        console.log('\n')
    },
    command: ['add', '添加配置', {
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
    }]
}