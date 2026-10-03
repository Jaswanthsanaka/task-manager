import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => {
        console.log("Data from backend:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  function addTask() {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: task
      }
    ]);

    setTask("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));
  }

  return (
    <div>
      <h1>Task Manager</h1>

      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      <h2>Tasks</h2>

      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            {item.title}

            <button onClick={() => deleteTask(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;