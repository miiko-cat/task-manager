import { useState } from "react";

function TaskInput({ onAdd }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmed = title.trim()
    if (trimmed === '' ) return

    onAdd(trimmed)
    setTitle('')
  }

  return (
    <form className="task-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例: 山田さんに見積もりを送る"
          aria-label="タスクの内容"
        />
        <button type="submit">追加</button>
    </form>
  )
}

export default TaskInput