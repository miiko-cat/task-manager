import { useState } from "react"

function App() {
  const [tasks, setTasks] = useState([])

  const addTask = (title) => {
    const newTask = { 
      id: crypto.randomUUID(), 
      title, 
      done: false
    }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === id ? { ...task, done: !task.done } :task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>今日のタスク</h1>
        <p className="app-note">思いついたことをそのまま書き出す場所です。</p>
      </header>

      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  )
}

export default App
