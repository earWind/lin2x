import json

# 1.格式化字符串字面值
year = 2016
event = 'Referendum'
print(f'Results of the {year} {event}')

# str函数返回供人阅读的值，repr则生成适于解释器读取的值
print(str(year) + event, repr(year) + event)

# 读写文件
# f = open('workfile', 'w', encoding="utf-8")
# 在处理文件对象时，最好使用 with 关键字。优点是，子句体结束后，文件会正确关闭，即便触发异常也可以
with open('D:\_git\lin2x\Python\workfile.txt', 'r', encoding="utf-8") as fr:

    for line in fr:
        print(line, end='')

    # fr.readline()
    # fr.read()
    fr.close()

with open('D:\_git\lin2x\Python\workfile.txt', 'w', encoding="utf-8") as fw:
    # fw.write('aa111')
    fw.close()


# 使用 json 保存结构化数据
dum = {"type": "simple", "list": ["1", 2], "isTreu": True}
json.dump(dum, open('D:\_git\lin2x\Python\dumpfile.json', 'w'), indent=4)

dumps = [1, 'simple', 'list']
print(json.dumps(dumps))

load = json.load(open('D:\_git\lin2x\Python\dumpfile.json', 'r'))
print(load)
