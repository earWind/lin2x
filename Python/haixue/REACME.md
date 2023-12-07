# pyqt5打包成exe，程序有图标，但是双击打开的窗口左上角没有显示小图标

打包命令后,exe程序有图标,双击打开没有图标,解决方法:

1. 创建images.qrc文件
在txt文件中写入

```txt
<RCC>
  <qresource prefix="/">
    <file>ico1.ico</file>
  </qresource>
</RCC>
```

保存,修改文件后缀为.qrc

2. 生成py文件，这个py文件把图片保存成二进制

`pyrcc5 -o images.py images.qrc`

3. 导入模块

```py
import images
MainWindow.setWindowIcon(QIcon(':/ico1.ico'))
```

## pyinstaller 打包 ddddocr 记录

参考

[pyinstaller 打包 ddddocr 库 踩坑记录。](https://zhuanlan.zhihu.com/p/456894600)
[ddddocr正确的打包方式](https://code84.com/795049.html)
[Python之查看pip安装包site-package的位置](https://blog.csdn.net/qq_24256877/article/details/108327246)

1. Python之查看pip安装包site-package的位置

```py
  from distutils.sysconfig import get_python_lib
  print(get_python_lib()) # C:\Users\Administrator\AppData\Local\Programs\Python\Python39\Lib\site-packages
```

2. 打包

执行 `pyinstaller -w -F main.py -p C:\Users\Administrator\AppData\Local\Programs\Python\Python39\Lib\site-packages`；加上 `-w` 就是不程序运行时不显示命令行窗口
main.py 需要打的文件
C:\Users\Administrator\AppData\Local\Programs\Python\Python39\Lib\site-packages 自己电脑site-package路径

3. 修改main.spec

```spec
  datas=[
    ('C:/Users/Administrator/AppData/Local/Programs/Python/Python39/Lib/site-packages/onnxruntime/capi/onnxruntime_providers_shared.dll','onnxruntime\\capi'),
    ('C:/Users/Administrator/AppData/Local/Programs/Python/Python39/Lib/site-packages/ddddocr/common.onnx','ddddocr'),
    ('C:/Users/Administrator/AppData/Local/Programs/Python/Python39/Lib/site-packages/ddddocr/common_old.onnx','ddddocr')
  ]
```

然后执行 `pyinstaller main.spec`


# webdriver.Chrome 报错
python安装目录 print(sys.executable)
[driver = webdriver.Chrome()报错](https://blog.csdn.net/weixin_42403127/article/details/85255891)
[最新ChromeDriver下载](https://googlechromelabs.github.io/chrome-for-testing/)