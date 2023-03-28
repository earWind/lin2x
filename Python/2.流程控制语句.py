# if
x = 16

if x < 18:
    print('children')
elif x == 18:
    print('youth')
else:
    print('man')

if 1 in [1, 2]:
    print('in [1, 2]')

# for
animals = ['cat', 'doge']
for i in animals:
    print(i)

# range
for i in range(2):
    print(i)

print(list(range(2)))

# enumerate 可以获取 index
for i, v in enumerate(animals):
    print(i, v)

# break、continue

# match


def http_status(status):
    match status:
        case 400:
            return '400'
        case 404:
            return '404'


print(http_status(404))

# 定义函数，定义 函数使用关键字 def，定义返回数据类型 -> list


def fib(n=2000) -> list:
    """
      斐波那契数列
      :param n: number
    """
    a, b, res = 0, 1, []

    while a < n:
        # print(a, end=' ')
        res.append(a)
        a, b = b, a+b
    return res


print(fib())

# 形参为 **name 形式时，接收一个字典；*name 形参接收一个 元组

# 函数多返回值


def moreRes():
    return 1, 2


a, b = moreRes()

# 函数关键字传参


def user_info(name, age, gender):
    return f'{name} +{age}+{gender}'


user_info(name='Jack', age=16, gender='女')
# 参数顺序不重要
user_info(gender='女', name='Jack', age=16)

# 匿名函数


def sum(fnc):
    return fnc(1, 2)


def add(a, b):
    return a+b


print(sum(add))
print(sum(lambda x, y: x + y))
