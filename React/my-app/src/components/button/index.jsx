import { useState } from "react";

function Button(props) {
  const [count, setCount] = useState("default");

  return (
    <button className={count} onClick={() => setCount(count + 1)}>
      {props.text}
    </button>
  );
}

export default Button;
