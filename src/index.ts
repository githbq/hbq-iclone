import * as requireDir from 'require-dir'
import * as  yargs from 'yargs'
export function start() {
    const commands = requireDir('./command')
    Object.keys(commands).forEach(key => {
        const result = commands[key].default
        if (result && !(/^(common|index|_)/.test(key))) {
            yargs.command.apply(null, result.command.slice(0, 3).concat((argv) => {
                result.start(argv)
            })).help()
        }
    })
    let argv = yargs.version().argv
    if (!argv._.length) {
        yargs.showHelp()
    }
    return { argv, yargs }
}

start()