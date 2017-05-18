import { _, prompt, showTemplate, getTemplate, writeTemplate, io, localConfigPath, consoleColor } from '../lib'
/**
 * 配置文件初始化
 */
export default {
    /**
     * 删除
     */
    async start(data = { init: false }) {
        if (data.init) {
            //读取项目内的模板
            const config = await getTemplate(true)
            //写入到项目外的模板
            await writeTemplate(config, false)
            consoleColor.green('配置文件初始化完成!', true)
        }
        consoleColor.yellow(`配置文件地址：${localConfigPath}`)
        consoleColor.green(`执行 iclone list 查看当前配置`)
    },
    command: [
        'config', '初始化本地配置文件', {
            init: {
                alias: ['i'],
                boolean: true,
                default: false,
                describe: '是否初始化本地配置文件'
            },
        }
    ]
}