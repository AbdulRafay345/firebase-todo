import React, { useState } from 'react'
import { Col, Form, Input, Row, Button, Typography } from 'antd'
import { useAuthContext } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

const { Title } = Typography
const { toastify, isEmail } = window
const initialState = { email: "", password: "" }

export default function Register() {

  const [state, setState] = useState(initialState)
  const { login, isProcessing } = useAuthContext()

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()

    let { email, password } = state

    if (!isEmail(email)) return toastify("Please enter a valid email", "error")
    if (password.length < 6) return toastify("Password must be at least 6 characters", "error")

    login(email, password)
  }

  return (
    <div className="auth" style={{ minHeight: '100vh', backgroundColor: '#0077b6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card border border-2 rounded-2 w-100" style={{ maxWidth: '380px' }}>
        <Form className='p-5'>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={2} className='text-center'>Login</Title>
            </Col>
            <Col span={24}>
              <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password placeholder='Password' name='password' onChange={handleChange} />
              <Link className='text-black small' style={{textDecoration:"none"}} to='/auth/forgot-password'>Forgot-Password</Link>
            </Col>
            <Col span={24}>
              <Button type='primary' block loading={isProcessing} htmlType='submit' onClick={handleSubmit}>Login</Button>
            </Col>
            <Col span={24}>
              <p className='small text-center'>Don't have an account? <Link to="/auth/register" className='text-black'>Register</Link></p>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}