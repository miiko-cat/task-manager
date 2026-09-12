const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  // fetch は 404 や 500 でも例外を投げないので、自分で確認
  if (!response.ok) {
    throw new Error(`API エラー: ${response.status} ${response.statusText}`)
  }

  // 204 No Content には本文がないので json() を呼べない
  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function fetchTasks() {
  return request('/tasks')
}

export function createTask(title) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

export function updateTask(id, changes) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' })
}