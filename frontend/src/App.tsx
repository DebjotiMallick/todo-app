import "./App.css";
import Todo from "./components/Todo";

export default function App() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My TODO List</h1>
      <Todo />
    </div>
  );
}
