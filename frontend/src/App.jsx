import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Get tasks from MongoDB through our backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => {
        console.log("Tasks from backend:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("Error getting tasks:", error);
      });
  }, []);

  // Add a new task
  async function addTask() {
    if (task.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: task
        }
      );

      console.log("Task added:", response.data);

      // Add the task returned by MongoDB to the screen
      setTasks([...tasks, response.data]);

      // Clear input
      setTask("");
    } catch (error) {
      console.log("Error adding task:", error);
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
  
      setTasks(tasks.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  }
  async function toggleTask(id, completed) {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          completed: !completed
        }
      );
  
      setTasks(
        tasks.map((item) =>
          item._id === id ? response.data : item
        )
      );
    } catch (error) {
      console.log("Error updating task:", error);
    }
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
          <li key={item._id}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => toggleTask(item._id, item.completed)}
          />
        
          <span
            style={{
              textDecoration: item.completed ? "line-through" : "none"
            }}
          >
            {item.title}
          </span>
        
          <button onClick={() => deleteTask(item._id)}>
            Delete
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;