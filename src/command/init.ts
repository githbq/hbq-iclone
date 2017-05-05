const exec = require('child_process').exec
import * as  chalk from 'chalk'
import * as  ioHelper from 'io-helper'
import common from './common'
const { prompt, stringify, exit, showError } = common;
export default {
    /**
     * 启动
     */
    async start(data) {
        await common.showTemplate();
        const config = common.getTemplate();
        //取得输入参数
        let { templateName, projectName } = await this.inputParams(data)
        let gitUrl = config.template[templateName].url
        let branch = config.template[templateName].branch
        const projectPath = ioHelper.pathTool.join(process.cwd(), projectName)
        //判断是否已存在
        await this.ensureExists(projectPath);
        //开始生成
        await this.generate({ projectPath, projectName, branch, gitUrl, templateName })
        exit()
    },
    /**
     * 
     * @param {*确认存在 存在提示是否删除} projectPath 
     */
    async ensureExists(projectPath) {
        const exists = ioHelper.existsSync(projectPath)
        if (exists) {
            console.log(chalk.red(`\n × 项目已存在,路径:${projectPath}`))
            let isDelete = await prompt('是否删除已存在的目录及文件:(y/n) ')
            if (isDelete.toLowerCase().indexOf('y') != -1) {
                await ioHelper.deleteFile(projectPath)
                console.log(chalk.green('\n √ 旧项目删除成功!'))
            } else {
                exit()
            }
        }
    },
    /**
     * 输入参数
     */
    async inputParams({ templateName, projectName }) {
        console.log(`$> init:templateName:${templateName},projectName:${projectName}`)

        const config = common.getTemplate()

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
     * @param {} param0 
     */
    async caseModule({ templateName, projectName, projectPath, gitUrl }) {
        if (templateName == 'module') { //如果空模块项目 做一些修改package操作
            const packagePath = ioHelper.pathTool.join(projectPath, 'package.json')
            let packageText = await ioHelper.readFile(packagePath)
            let packageData = JSON.parse(packageText)
            packageData.name = projectName
            packageData.description = projectName
            // packageData.repository.url = gitUrl
            packageData.keywords.push(projectName)
            packageData.bugs.url = gitUrl
            // packageData.homepage = `${gitUrl}#readme`
            return await ioHelper.saveFile(packagePath, stringify(packageData))
        }
    },
    async clone({ projectPath, projectName, branch, gitUrl }) {
        console.log(chalk.white('\n...开始生成项目'))
        let cmdStr = `git clone --depth=1 -b ${branch} ${gitUrl} ${projectName} --recursive`
        return new Promise((resolve, reject) => {
            exec(cmdStr, (error, stdout, stderr) => {
                ioHelper.deleteFile(ioHelper.pathTool.join(projectPath, '.git')).then(() => {
                    if (error) {
                        reject(error)
                        return
                    }
                    resolve()
                    console.log(chalk.green('\n √ 项目创建成功! \n 执行以下命令开干吧'))
                    console.log(`\n cd ${projectName} &&  git init &&  yarn \n`)
                })
            })
        })
    },
    //开始生成项目
    async generate({ templateName, projectPath, projectName, branch, gitUrl }) {
        try {
            await this.clone({ projectPath, projectName, branch, gitUrl })
            await this.caseModule({ projectPath, projectName, templateName, gitUrl });
        } catch (e) {
            showError(e)
        }
    }
}