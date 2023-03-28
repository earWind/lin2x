# 1.列表详解
a = []
# 在末尾追加
a.append(1)
# 扩展
a.extend([2])
# 在指定位置插入
a.insert(2, 3)
# 删除第一个值为xx的元素
a.remove(3)
# 删除列表中指定位置的元素，并返回被删除的元素。未指定位置时，删除并返回列表的最后一个元素
print(a.pop(1))
# 返回列表中第一个值为 x 的元素的零基索引
print(a.index(1))
# 返回列表中元素 x 出现的次数
a.count(1)
# sort 排序
# reverse 翻转
# copy 浅拷贝
# clear 清空
print(a)

# 2.del语句
b = [1, 2, 3, 4, 5, 6, 7]
del b[0]
del b[1:2]
del b[:]

# 3.元组和序列
# 定义单个元素的元祖  (1,) 需要加上一个 ,
# 元组是不可变的
c = (1, 2, 'haha')
c1 = tuple()
print(c, c[0], c.index('haha'), c.count(2))


# 4.字符串
d = 'str'
# index replace split  count len
# 去除空格
d.strip()

# 5.切片
f = 'hello world !'
# 从第一个开始到第三个，步长为1
f[1:3]
# 从头到尾，步长为1
f[:]
# 从头到尾，步长为2
f[::2]
# 从头开始，步长为-1，等同于将系列反转
f[::-1]
# 从第一个开始到第三个，步长为-1
f[1:3:-1]

# 6.集合
# 不支持下标索引
g = {'apple', 'orange', 'apple', }
# 创建一个空集合
g1 = set()
# 添加
g1.add('banana')
# 合并
g2 = g.union(g1)
# remove pop clear len
print(g1)
print('apple' in g)

# 7.字典
h = {'name': 'jack', 'code': 1}
h['age'] = 18
# sorted 反向list
print(list(h), sorted(h))
i = dict([('sape', 4139), ('jack', 4098)])
print(i)
# items方法可同时取出键和对应的值
for k, v in i.items():
    print(k, v)
# keys方法可以获取所有的key
for k in i.keys():
    print(k)
# pop clear len

# 8.set() 去除序列中的重复元素
