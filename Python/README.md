# python

## tow

### 安装包 & 文档

[下载](https://www.python.org/downloads/)
[文档](https://docs.python.org/zh-cn/3/)

### pip 使用国内镜像源

C:\Users\xx\pip创建一个 pip.ini在pip.ini文件中输入以下内容：

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host = pypi.tuna.tsinghua.edu.cn
```

### print打印中文乱码

```python
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
```

### Python 完美解决 Import 'xx' could not be resolved resolvedPylance

1. 打开 vscode
2. 按快捷键 win: Ctrl + Shift + P 或 mac: Command + Shift + P，输入 Python: Select Interpreter
3. 选择对应的python版本
