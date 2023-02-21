import "./App.css";
import ThreeSphere from "./three-sphere";

function App() {
  return (
    <>
      <nav>
        <a href="/">Rotating Sphere</a>
        <ul>
          <li>Explore</li>
          <li>Create</li>
        </ul>
      </nav>
      <h1 className="title">Spin it!</h1>
      <ThreeSphere />
    </>
  );
}

export default App;
