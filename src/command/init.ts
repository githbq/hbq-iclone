import * as  pathTool from 'path'
import { cwd, io, prompt, exec, showTemplate, getTemplate, consoleColor, confirm } from '../lib'
/**
 * 是否操作项目自身配置
 */
let isSelf = false
let cmdData
export default {
    /**
     * 启动
     */
    async start(data) {
        cmdData = data
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
            consoleColor.red(`项目已存在,路径:${projectPath}`, false)
            let isDelete = await prompt('是否删除已存在的目录及文件:(y/n) ')
            if (isDelete.toLowerCase().indexOf('y') !== -1) {
                await io.delete(projectPath)
                consoleColor.green('旧项目删除成功!', true)
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
            consoleColor.red('模板不存在!', false)
            return await this.inputParams({ templateName: '', projectName })
        }
        if (!projectName) {
            consoleColor.red('请输入项目名称!', false)
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
        consoleColor.white('...开始生成项目')
        let cmdStr = `git clone --depth=1 -b ${branch} ${gitUrl} ${projectName} --recursive`
        await exec(cmdStr)
        consoleColor.green(`正在删除原始.git版本信息`)
        await io.delete([projectPath, '.git'])
        await this.caseModule({ projectPath, projectName, templateName, gitUrl })
        consoleColor.green(`正在执行：git init && git add . && git commit - am "init"`)
        await exec('git init && git add . && git commit -am "init"', { cwd: projectPath })
        //添加 参数 -u 不安装库
        if (cmdData.uninstall) {
            console.log(`已跳过装库步骤`)
        } else {
            try {
                const version = await exec('yarn --version')
            } catch (e) {
                const installYarnCmdStr = `npm i -g yarn`
                const setTaobaoRegistry = `yarn config set registry https://registry.npm.taobao.org`
                consoleColor.yellow('检测到未安装 yarn')
                consoleColor.start(installYarnCmdStr)
                await exec(installYarnCmdStr, { preventDefault: true })
                consoleColor.start(setTaobaoRegistry)
                await exec(setTaobaoRegistry, { preventDefault: true })
            }
            consoleColor.green(`正在执行：yarn install`)
            await exec('yarn install', { cwd: projectPath })
        }
        consoleColor.green('项目生成成功', true)
        consoleColor.green(`执行 cd ${projectPath} 开干吧`)
    },
    //开始生成项目
    async generate({ templateName, projectPath, projectName, branch, gitUrl }) {
        await this.clone({ projectPath, projectName, branch, gitUrl, templateName })
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
            },
            uninstall: {
                alias: ['u'],
                boolean: true,
                default: false,
                describe: '不安装库'
            }
        }
    ]
}