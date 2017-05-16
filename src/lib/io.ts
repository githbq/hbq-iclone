import * as pathTool from 'path'
import * as fs from 'fs-extra-promise'
import * as _ from 'lodash'

import { rootPath, cwd } from './consts'
import { stringify } from './other'

export const io = {
    pathTool,
    resolveOptions(path: string, options: any = { fromRoot: false, fromCwd: false }) {
        path = pathTool.join.apply(null, [].concat(path))
        // 考虑多路径处理
        path = pathTool.join.apply(null, (options.fromRoot ? [rootPath] : options.fromCwd ? [cwd] : []).concat(path))
        return path
    },
    read(path: string, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        return fs.readFileAsync(path, 'utf8')
    },
    write(path: string, content, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        // 对对象进行 美化格式处理
        content = _.isObject(content) ? stringify(content) : content
        return fs.outputFileAsync(path, content)
    }, delete(path) {
        path = pathTool.join.apply(null, [].concat(path))
        return fs.removeAsync(path)
    },
    exists(path) {
        path = pathTool.join.apply(null, [].concat(path))
        return fs.existsAsync(path)
    },
}