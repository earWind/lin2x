# 1.数字
# 1.1 整数 int
a = 1
# 1.2浮点数 float
b = 1.2

# 2.字符串
c = 'str'
# 字符串可以索引
print(c[1])
# len内置方法可获取长度
print(len(c))

# 3.列表
d = [1, 2]
e = [3, 4]
# 合并
f = d + e
# 浅拷贝
g = f[:]
# append
g.append(5)
# 赋值
g[1:2] = ['two', 'three']
# 清空
g[:] = []
