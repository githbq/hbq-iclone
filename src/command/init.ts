import * as  chalk from 'chalk'
import * as  pathTool from 'path'
import { cwd, io, prompt, exec, showError, showTemplate, getTemplate } from '../common'
let isSelf = false
export default {
    /**
     * 启动
     */
    async start(data) {
        isSelf = data.self
        await showTemplate(isSelf)
        const config = await getTemplate(isSelf)
        //取得输入参数
        let { templateName, projectName } = await this.inputParams(data)
        let gitUrl = config.template[templateName].url
        let branch = config.template[templateName].branch
        const projectPath = pathTool.join(cwd, projectName)
        //判断是否已存在
        if (await this.ensureExists(projectPath) === false) {
            //由上层去exit
            return
        }
        //开始生成
        await this.generate({ projectPath, projectName, branch, gitUrl, templateName })
    },
    /**
     * 
     * @param {*确认存在 存在提示是否删除} projectPath 
     */
    async ensureExists(projectPath) {
        const exists = await io.exists(projectPath)
        if (exists) {
            console.log(chalk.red(`\n × 项目已存在,路径:${projectPath}`))
            let isDelete = await prompt('是否删除已存在的目录及文件:(y/n) ')
            if (isDelete.toLowerCase().indexOf('y') !== -1) {
                await io.delete(projectPath)
                console.log(chalk.green('\n √ 旧项目删除成功!'))
            } else {
                return false
            }
        }
    },
    /**
     * 输入参数
     */
    async inputParams({ templateName, projectName }) {
        console.log(`$> init:templateName:${templateName},projectName:${projectName}`)

        const config = await getTemplate(isSelf)

        !templateName && (templateName = await prompt('模板名称(默认module): '))

        !projectName && (projectName = await prompt('项目名称: '))

        templateName = templateName || 'module'
        if (!config.template[templateName]) {
            console.log(chalk.red('\n × 模板不存在!'))
            return await this.inputParams({ templateName: '', projectName })
        }
        if (!projectName) {
            console.log(chalk.red('\n × 请输入项目名称!'))
            return await this.inputParams({ templateName, projectName: '' })
        }
        console.log(`$> now:templateName:${templateName},projectName:${projectName}`)
        return { templateName, projectName }
    },
    /**
     * 处理 module 模板
     * @param {}   
     */
    async caseModule({ templateName, projectName, projectPath, gitUrl }) {
        if (templateName === 'module') { //如果空模块项目 做一些修改package操作
            const packagePath = pathTool.join(projectPath, 'package.json')
            let packageText = await io.read(packagePath)
            let packageData = JSON.parse(packageText)
            packageData.name = projectName
            packageData.description = projectName
            packageData.repository = gitUrl
            packageData.keywords = packageData.keywords || []
            packageData.keywords.push(projectName)
            return await io.write(packagePath, packageData)
        }
    },
    async clone({ projectPath, projectName, branch, gitUrl, templateName }) {
        console.log(chalk.white('\n...开始生成项目'))
        let cmdStr = `git clone --depth=1 -b ${branch} ${gitUrl} ${projectName} --recursive`
        await exec(cmdStr)
        console.log(chalk.green(`ok`))
        console.log(chalk.green(`正在删除原始.git版本信息`))
        await io.delete([projectPath, '.git'])
        console.log(chalk.green(`ok`))
        await this.caseModule({ projectPath, projectName, templateName, gitUrl })
        console.log(chalk.green(`正在执行：git init && git add . && git commit - am "init"`))
        await exec('git init && git add . && git commit -am "init"', { cwd: projectPath })
        console.log(chalk.green(`正在执行：yarn install`))
        await exec('yarn install', { cwd: projectPath })
        console.log(chalk.green('\n项目生成成功'))
        console.log(chalk.green(`\n执行 cd ${projectPath} 开干吧`))
    },
    //开始生成项目
    async generate({ templateName, projectPath, projectName, branch, gitUrl }) {
        try {
            await this.clone({ projectPath, projectName, branch, gitUrl, templateName })
        } catch (e) {
            showError(e)
        }
    }, command: [
        'init', '初始化新项目', {
            template: {
                alias: ['t', 'templateName'],
                default: '',
                describe: '模板'
            },
            name: {
                alias: ['n', 'projectName'],
                default: '',
                describe: '项目名称'
            }
        }
    ]
}