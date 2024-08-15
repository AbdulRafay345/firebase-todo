import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TodoTable from './TodoTable'
import AddTodo from './AddTodo'

export default function Todos() {
  return (
    <Routes>
        <Route index element={<TodoTable/>}/>
        <Route path='/add-todo' element={<AddTodo/>}/>
    </Routes>
  )
}
