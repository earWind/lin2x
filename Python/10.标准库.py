from urllib.request import urlopen
import glob
import os

print(os.getcwd())
# print(dir(os))
# print(help(os))

print(glob.glob('*.py'))


# 互联网访问
f = open('D:\_git\lin2x\Python\workfile.txt', 'w', encoding="utf-8")
with urlopen('https://www.baidu.com/') as response:
    for line in response:
        line = line.decode()
        print(type(line))
        f.write(line)
