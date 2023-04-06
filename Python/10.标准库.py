import reprlib
from timeit import Timer
import zlib
from datetime import date
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
        line = line.decode()  # Convert bytes to a str
        f.write(line)

# 日期和时间
now = date.today()
print(now)
print(now.strftime("%m-%d-%y. %d %b %Y is a %A on the %d day of %B."))
birthday = date(1964, 7, 31)
print(birthday)

# 数据压缩
s = b'witch which has which witches wrist watch'
len(s)

t = zlib.compress(s)
print(len(t))
print(zlib.decompress(t))
print(zlib.crc32(s))

# 性能测量
print(Timer('t=a; a=b; b=t', 'a=1; b=2').timeit())
print(Timer('a,b = b,a', 'a=1; b=2').timeit())

# 格式化输出
reprlib.repr(set('supercalifragilisticexpialidocious'))
