import * as  chalk from 'chalk'
import * as _ from 'lodash'
import { localConfigPath, showError, urlResolve, prompt, getTemplate, showTemplate, writeTemplate, io } from '../common'

export default {
    /**
     * 新增
     */
    async start({ templateName, gitUrl, branch, description, self }) {
        await showTemplate(self)

        !templateName && (templateName = await prompt('模板名称: '))

        !gitUrl && (gitUrl = await prompt('Git地址: '))

        !branch && (branch = await prompt('分支: '))

        !description && (description = await prompt('描述: '))
        let config: any = {}
        config = await getTemplate(self)

        if (!config.template[templateName]) {
            const url = urlResolve(gitUrl)
            config.template[templateName] = { description, branch, url }
        } else {
            console.log(chalk.red('模板已存在!'))
            return
        }
        await writeTemplate(config, self)

        console.log(chalk.green('\n模板添加成功!\n'))
        console.log(chalk.grey('当前模板配置:'))
        await showTemplate(self)
        console.log('\n')
    },
    command: ['add', '添加配置', {
        self: {
            describe: '配置文件保存到项目里面,这会随着重装而消失，仅供作者使用用来发布代码',
            default: false,
            boolean: true,
            alias: ['s']
        },
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