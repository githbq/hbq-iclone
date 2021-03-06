![my love](./logo.png)

> 轻量级项目安装脚手架,可以自由拓展配置，配置文件保存在用户目录

## 安装   
```
$ npm i -g iclone-cli
```
---

## 命令   
### `iclone init [-u] [-t <templateName>] [-n <projectName>]`

> 根据提示创建一个新项目   
- 默认会执行`yarn install `
- 如果检测到当前系统没有安装`yarn`
    - 会自动执行`npm i -g yarn`
    - 并将`yarn` registry指向`https://registry.npm.taobao.org`
- 参数 `-u` uninstall ,添加此参数创建项目的时候不再执行装库行为
- 可以直接在命令上输入`-t [templateName]` `-n [projectName]` 否则会进行默认交互按提示输入**模板名**与**项目名**

### iclone add    
> 按照提示>添加一条模板配置       

### iclone delete    
> 按照提示>删除一条模板配置   

### iclone list   
> 查看当前模板配置   

### iclone config [-i]
- 初始化本地配置文件并且显示配置文件所在目录
- 直接执行iclone config 将显示当前本地配置所在地址
- 参数 `-i`  init,将本地配置恢复到原始配置

### 查看帮助  
> iclone || iclone --help  

----

## 更新纪录   
- `iclone init` 创建项目的时候 连同git init ,git add . git commit -am  ,yarn install 一并做了
- 现在配置文件会保存在 用户目录下的 .iclonerc 文件里了
    - 更新iclone-cli不会丢失模板配置
    - `iclone config` 查看配置文件地址


 
