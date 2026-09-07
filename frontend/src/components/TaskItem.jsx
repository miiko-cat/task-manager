function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.done ? 'task-item is-done' : 'task-item'}>
      <label className="task-item-label">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-item-title">{task.title}</span>
      </label>

      <button
        type="button"
        className="task-item-delete"
        onClick={() => onDelete(task.id)}
      >
        削除
      </button>
    </li>
  )
}

export default TaskItem