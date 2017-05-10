import common from './common'
export default {
    /**
     * 显示列表
     */
    async start(argv) {
        await common.showTemplate()
    },
    command: [
        'list', '查看当前配置'
    ]
}