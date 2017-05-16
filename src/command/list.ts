import { showTemplate } from '../lib'
export default {
    /**
     * 显示列表
     */
    async start({ self }) {
        await showTemplate(self)
    },
    command: [
        'list', '查看当前配置',
        {
            self: {
                describe: '配置文件保存到项目里面,这会随着重装而消失，作者使用用来发布代码',
                default: false,
                boolean: true,
                alias: ['s']
            },
        }
    ]
}