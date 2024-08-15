import React, { useState } from 'react'
import { Col, Form, Input, Row, Button, Typography } from 'antd'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { Link } from 'react-router-dom'

const { Title } = Typography
const { toastify, isEmail } = window
const initialState = { email: "" }

export default function Register() {

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()

    let { email } = state

    if (!isEmail(email)) return toastify("Please enter a valid email", "error")  // Negated condition

    setIsProcessing(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toastify("Reset password email sended", "success")
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential": toastify("Invalid email", "error"); break;
          default: toastify("Something went wrong while sending reset password email", "error"); break;
        }
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <div className="auth" style={{ minHeight: '100vh', backgroundColor: '#0077b6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card border border-2 rounded-2 w-100" style={{ maxWidth: '380px' }}>
        <Form className='p-5'>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={2} className='text-center'>Forgot Password</Title>
            </Col>
            <Col span={24}>
              <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type='primary' block loading={isProcessing} htmlType='submit' onClick={handleSubmit}>Submit</Button>
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
