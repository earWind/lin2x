# python

## tow

### 安装包

[download](https://www.python.org/downloads/)

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
