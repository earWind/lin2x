# lin2x

前端学习笔记

vscode 配置
// vscode 默认启用了根据文件类型自动设置 tabsize 的选项
"editor.detectIndentation": false,
// 重新设定 tabsize
"editor.tabSize": 2,
// 每次保存的时候自动格式化 -- 这里不是按照 eslint 格式化所有不打开
// "editor.formatOnSave": true,
"eslint.validate": [
"javascript",
"javascriptreact",
"html",
"vue"
],
// 每次保存的时候将代码按 eslint 格式进行修复
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
// 去掉代码结尾的分号
"prettier.semi": true,
// 使用单引号替代双引号
"prettier.singleQuote": true,
// 让函数(名)和后面的括号之间加个空格
"javascript.format.insertSpaceBeforeFunctionParenthesis": true,
"[html]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},

http://10.28.64.161:8083/zentao/bug-view-198.html
http://10.28.64.183/users/sign_in
