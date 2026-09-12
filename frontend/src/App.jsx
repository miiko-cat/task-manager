import { useEffect, useState } from "react"
import * as api from './api/tasks'
import TaskInput from "./components/TaskInput"
import TaskList from "./components/TaskList"
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadTasks() {
      try {
        const data = await api.fetchTasks()
        if (!ignore) setTasks(data)
      } catch (err) {
        console.error(err)
        if (!ignore) setError('タスクを読み込めませんでした。API が起動しているか確認してください。')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const addTask = async (title) => {
    try {
      const created = await api.createTask(title)
      setTasks((prev) => [...prev, created])
      setError(null)
    } catch (err) {
      console.error(err)
      setError('タスクを追加できませんでした。')
    }
  }

  const toggleTask = async (id) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return

    try {
      const updated = await api.updateTask(id, { done: !target.done })
      setTasks((prev) =>
        prev.map((task) =>
          (task.id === id ? updated : task)
        )
      )
    } catch (err) {
      console.error(err)
      setError('タスクを更新できませんでした。')
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id)
      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      )
      setError(null)
    } catch (err) {
      console.error(err)
      setError('タスクを削除できませんでした。')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>今日のタスク</h1>
        <p className="app-note">思いついたことをそのまま書き出す場所です。</p>
      </header>

      <TaskInput onAdd={addTask} />

      {error && (
        <p className="app-error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="task-empty">読み込み中...</p>
      ) : (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      )}
    </div>
  )
}

export default App
