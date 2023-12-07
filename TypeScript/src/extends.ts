{
    // extends typescript逻辑运算

    // 这里我们就对入参 T 进行了类型约束
    type Foo<T extends string> = T;

    // 这里我们就对入参 T 增加了默认值
    type Foo1<T extends string = 'hello world'> = T;

    // 条件判断 三元运算
    // T extends U ? X : Y;
    type IsNumber<N> = N extends number ? 'yes, is a number' : 'no, not a number';
}