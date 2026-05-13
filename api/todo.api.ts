import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IData, IPostPayload } from "@/store/todo.types"

const api = "https://6966216af6de16bde44c5161.mockapi.io/"

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: api }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query<IData[], void>({
      query: () => 'students',
      providesTags: ['Todo']
    }),
    deleteTodo: build.mutation<void, number>({
      query: (id) => ({
        url: `students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Todo']
    }),
    postTodo: build.mutation<void, IPostPayload>({
      query: (newTodo) => ({
        url: 'students',
        method: 'POST',
        body: newTodo
      }),
      invalidatesTags: ['Todo']
    })
  }),
})

export const { useGetTodosQuery, useDeleteTodoMutation, usePostTodoMutation } = todoApi