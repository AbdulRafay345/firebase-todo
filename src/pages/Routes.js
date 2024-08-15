import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import { useAuthContext } from '../contexts/AuthContext'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'

export default function Index() {
    const { state } = useAuthContext()
    return (
        <Routes>
            <Route path='/*' element={<Frontend />} />
            <Route path='auth/*' element={!state.isAuthenticated ? <Auth /> : <Navigate to="/" />} />
            <Route path='dashboard/*' element={<PrivateRoute Components={Dashboard} />} />
        </Routes>
    )
}
