import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Users from './Users'
import Todos from './Todos'

export default function Index() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/todos/*" element={<Todos />} />
        </Routes>
    )
}
