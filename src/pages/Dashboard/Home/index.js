import { Button } from 'antd'
import React from 'react'
import { useAuthContext } from '../../../contexts/AuthContext'

export default function Home() {
  const { logout } = useAuthContext()
  return (
    <div className='p-3'>
      <h1>Home Dashboard</h1>
      <Button type='primary' onClick={logout}>Logout</Button>
    </div>
  )
}
