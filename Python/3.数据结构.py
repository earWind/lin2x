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
