import {
  useState,
  useEffect,
  useContext,
  Fragment,
  createContext,
  useReducer,
} from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const btnContext = createContext({
  color: "red",
  flex: 1,
});

function Page(props) {
  const title = "函数组件";
  const [count, setCount] = useState(0);
  const books = ["钢铁是怎样炼成的", "老人与海", "简爱"];
  const [name, setName] = useState("");
  const theme = useContext(btnContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  function changeCount(num) {
    setCount(count + num);
  }

  function x2(num) {
    return num * 2;
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(name);
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  function getTitle() {
    return <p>{title}</p>;
  }

  // useEffect - 相当于vue的watch
  useEffect(() => {
    const timer = setInterval(() => {
      count < 5 && setCount(count + 1);
    }, 1000);

    // 可以返回一个函数用于清除副作用（如定时器，每次值发生改变都会调用生成一个定时器）
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <Fragment>
      <div className="container">
        <div>
          <h3>props</h3>
          {getTitle()}
          <p>{props.name}</p>
        </div>

        <div>
          <h3>事件绑定 条件渲染</h3>
          <button onClick={() => changeCount(-1)}>-</button>
          <span>{x2(count)}</span>
          {count <= 5 && <button onClick={() => changeCount(+1)}>+</button>}
        </div>

        <div>
          <h3>列表</h3>
          {books.map((item) => (
            <span key={item}>《{item}》</span>
          ))}
        </div>

        <div>
          <h3>表单 受控组件</h3>
          <form onSubmit={handleSubmit}>
            <label>
              名字：
              <input type="text" value={name} onChange={handleChange} />
            </label>
            <input type="submit" value="提交" />
          </form>
        </div>
      </div>

      <div>
        <h3>hook</h3>
        基础 useState useEffect useContext
        <p style={{ color: theme.color }}>useContext</p>
        <div>
          useReducer-类似redux
          <button onClick={() => dispatch({ type: "decrement" })}>-</button>
          {state.count}
          <button onClick={() => dispatch({ type: "increment" })}>+</button>
        </div>
      </div>

      <hr />
    </Fragment>
  );
}

export default Page;
