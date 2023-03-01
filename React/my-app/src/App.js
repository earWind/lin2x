import "./styles/App.css";
import Page1 from "./views/page1";
import Page2 from "./views/page2";

function App() {
  return (
    <div className="App">
      <Page1 name="Mr.Lin" />
      <Page2 name="Mr.Lin" />
    </div>
  );
}

export default App;
