import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../contexts/AuthContext';

export default function Home() {
  const { state } = useAuthContext()
  return (
    <>
      <div className='text-center bg-primary' style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
        <h2 className='text-white py-2'>Welcome</h2>

        <h4 className='text-white'>Go to website <Link to='/dashboard' className='text-white'><ArrowRightOutlined /></Link></h4>

        <h3 className='text-white fw-bold pb-3'>OR</h3>

        <div className='d-flex justify-content-center'>
          <div className="mx-2">
            <Link to={state.isAuthenticated?"/dashboard":"/auth/register"} className='btn btn-dark w-100 text-center'>Register</Link>
          </div>
          <div className="mx-2">
            <Link to={state.isAuthenticated?"/dashboard":"/auth"} className='btn btn-danger w-100'>Login</Link>
          </div>
        </div>

      </div>
    </>
  )
}
