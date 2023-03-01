// 泛型 类型通过使用的时候传入
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("mystring");
let output1 = identity(1); // 类型推导

// 使用泛型变量
let arr: string[] = [];
let arr1: Array<string> = [];

// 泛型类型 泛型接口
interface GenericIdentityFn {
  <T>(arg: T): T;
}
let myIdentity: GenericIdentityFn = identity;

interface GenericIdentityFn1<T> {
  (arg: T): T;
}
let myIdentity1: GenericIdentityFn1<string> = identity;

// 泛型类
class GenericNumber<T> {
  z: T;
  constructor(x: T) {
    this.z = x;
    this.add = (x: T): T => {
      return x;
    };
  }
  add: (x: T) => T;
}
let myGenericNumber = new GenericNumber<number>(1);
myGenericNumber.z = 0;
myGenericNumber.add = function (x) {
  return x * this.z;
};

// 泛型约束 使用继承约束传入的类型
// demo1
interface Lengthwise {
  length: number;
}
function loggingIndentity<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}
// demo2 - 入参必须为 Info 的属性
type Info = {
  address: string;
  lon: number;
  lat: number;
};
function getInfo<T extends keyof Info>(key: T): Info[T] {
  const data: Info = {
    address: "",
    lon: 0,
    lat: 0,
  };
  return data[key];
}
