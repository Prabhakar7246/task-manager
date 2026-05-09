import { useState, useEffect } from "react";
import bgImage from "./assets/task_manager_bg.jpg";
import cardImage from "./assets/task_manager_card_bg.jpg";

function App() {
  //states
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState("all");

  const [position, setPosition] = useState({ x: 500, y: 200 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },[tasks]);
    useEffect(() => {
  const interval = setInterval(() => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.timeLeft > 0
        ? { ...t, timeLeft: t.timeLeft - 1 }
        : !t.completed && !t.expired
          ? { ...t, expired: true }
          : t
        )
      );
    }, 1000);

  return () => clearInterval(interval);
}, []);
  
// functions
// add tasks
  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([
  ...tasks,
  {
    text: task,
    completed: false,
    expired: false,
    timeLeft: Number(time) * 60
  }
]);
    setTask("");
    setTime("");
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  const toggleComplete = (indexToToggle) => {
    setTasks(
      tasks.map((task, index) =>
        index === indexToToggle
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });
  const handleMouseDown = (e) => {
  setDragging(true);

  setOffset({
    x: e.clientX - position.x,
    y: e.clientY - position.y
  });
};

const handleMouseUp = () => {
  setDragging(false);
};

const handleMouseMove = (e) => {
  if (dragging) {
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  }
};
  return (
    // Task manager outer div
    <div
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      {/* Task manager inner card div */}
      <div
        onDoubleClick={handleMouseDown}
        style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grab",
        backgroundImage: `url(${cardImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(217, 16, 16, 0.1)",
        width: "90%",
        maxWidth: "350px"
      }}>
        <h2 style={{ textAlign: "center" }}>Task Manager</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
            style={{
            flex: 1,
            padding: "10px",
            minWidth: 0
            }}
          />
          <input
             type="number"
             value={time}
             onChange={(e) => setTime(e.target.value)}
             placeholder="Min"
             style={{
                 width: "70px",
                 padding: "10px"
              }}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <div style={{ margin: "15px 0", textAlign: "center" }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")} style={{ marginLeft: "5px" }}>Completed</button>
          <button onClick={() => setFilter("pending")} style={{ marginLeft: "5px" }}>Pending</button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTasks.map((t, index) => (
            <li key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px"
            }}>
              <span
                onClick={() => toggleComplete(index)}
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  cursor: "pointer"
                }}
              >
                <>
                {t.text}

                {t.expired ? (
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    TASK EXPIRED
                  </span>
                 ) : (
              <span>
                 {" "}
                 ({Math.floor(t.timeLeft / 60)}:
                 {String(t.timeLeft % 60).padStart(2, "0")})
              </span>
               )}
             </>
              </span>

              <button onClick={() => deleteTask(index)}>ᴰᴱᴸᴱᵀᴱ</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;