{
    // 类型守卫
    function logValue(x: Date | string) {
        if (x instanceof Date) {
            console.log(x.toUTCString())
        } else {
            console.log(x)
        }
    }

    class A {
       
    }

    function isA(x:any): x is boolean {
        return (x instanceof A)
    }

    console.log(isA(1))
}