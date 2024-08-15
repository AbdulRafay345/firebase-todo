import React from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import Auth from '../pages/Auth'

export default function PrivateRoute({ Components }) {
  const { state } = useAuthContext()

  if(!state.isAuthenticated){
    return <Auth/>
  }

  return (
    <Components />
  )
}
