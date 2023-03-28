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

# 定义函数，定义 函数使用关键字 def

# 斐波那契数列


def fib(n=2000) -> list:
    a, b, res = 0, 1, []

    while a < n:
        # print(a, end=' ')
        res.append(a)
        a, b = b, a+b
    return res


print(fib())


# 形参为 **name 形式时，接收一个字典；*name 形参接收一个 元组
