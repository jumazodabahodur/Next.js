import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Todo {
  id: string;
  text?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  // Updated base URL to use the new project provided by the user
  baseQuery: fetchBaseQuery({ baseUrl: 'https://6966216af6de16bde44c5161.mockapi.io/' }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      // Changed resource from 'todos' to 'students' as per the new URL
      query: () => 'students',
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: 'students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `students/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
})

export const { 
  useGetTodosQuery, 
  useAddTodoMutation, 
  useUpdateTodoMutation, 
  useDeleteTodoMutation 
} = todoApi