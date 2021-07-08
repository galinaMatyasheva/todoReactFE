import Task from "./Task/Task";
import "./App.scss";

const App = () => {
  return (
    <div className="app">
      <main className="app-body">
        <h1>Todo list</h1>
        <Task />
      </main>
    </div>
  );
};

export default App;
