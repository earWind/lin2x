from dataclasses import dataclass


class Dog:
    """A simple example class"""
    kind = 'kind'
    tricks = []

    def __init__(self, kind):
        self.kind = kind

    def add_trick(self, trick):
        self.tricks.append(trick)

    __add_trick = add_trick


xiaobai = Dog('bai')
xiaobai.add_trick('a')
xiaohei = Dog('hei')
xiaohei.add_trick('b')
print(xiaobai.tricks)  # [a,b] 修改小黑影响了小白

# 继承


class BigDog(Dog):
    def __init__(self, kind):
        super().__init__(kind)


xiaohong = BigDog('hong')
print(xiaohong.kind)


# 装饰器
@dataclass
class Employee:
    name: str
    dept: str
    salary: int


john = Employee('john', 'computer lab', 1000)

print(john.dept)

# 迭代器
it = iter('abc')
print(next(it))
print(next(it))

# 生成器


def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]


for char in reverse('golf'):
    print(char)
