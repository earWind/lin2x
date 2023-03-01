import React from "react";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "class组件" };
    this.title520 = this.title520.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount - 组件已经被渲染到 DOM 中");
  }

  shouldComponentUpdate() {
    console.log("shouldComponentUpdate");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  title520() {
    this.setState({
      title: this.state.title + " 520",
    });
  }

  toTitle() {
    this.setState({
      title: "title",
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <p>{this.props.name}</p>
        <button onClick={this.title520}>title 520</button>
        <button
          onClick={() => {
            this.toTitle();
          }}
        >
          toTitle
        </button>
      </div>
    );
  }
}

export default Page;
