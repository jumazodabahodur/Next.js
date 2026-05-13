import { IData, IPostPayload } from "@/store/todo.types"

const api = "https://6966216af6de16bde44c5161.mockapi.io/students"

export const getTodos = async (): Promise<IData[]> => {
  const res = await fetch(api)
  if (!res.ok) throw new Error("Failed to fetch todos")
  return res.json()
}

export const postTodo = async (newTodo: IPostPayload): Promise<IData> => {
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo)
  })
  if (!res.ok) throw new Error("Failed to post todo")
  return res.json()
}

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${api}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete todo")
}

export const updateTodo = async (id: number, updatedTodo: IPostPayload): Promise<IData> => {
  const res = await fetch(`${api}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTodo)
  })
  if (!res.ok) throw new Error("Failed to update todo")
  return res.json()
}
