import { Col, Form, Input, Row, Button, Typography } from 'antd'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, firestore } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

const { Title } = Typography
const { toastify, isEmail } = window
const initialState = { fullName: "", email: "", password: "", confirmPassword: "" }

export default function Register() {

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()

    let { fullName, email, password, confirmPassword } = state

    if (fullName.length < 3) return toastify("Please enter your full name", "error")
    if (!isEmail(email)) return toastify("Please enter a valid email", "error")  // Negated condition
    if (password.length < 6) return toastify("Password must be at least 6 characters", "error")
    if (confirmPassword !== password) return toastify("Passwords don't match", "error")
    
    setIsProcessing(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await updateProfile(auth.currentUser, { displayName: fullName })
        await setDoc(doc(firestore, "users", user.uid), {
          name: fullName,
          email: email,
          uid: user.uid
        });
        toastify("User registered succesfully","success")
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use": 
            toastify("Email already registered", "error"); 
            break;
          default: 
            toastify('Something went wrong while adding a new user', "error"); 
            break;
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
              <Title level={2} className='text-center'>Register</Title>
            </Col>
            <Col span={24}>
              <Input type='text' placeholder='Enter Full Name' name='fullName' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password placeholder='Password' name='password' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password placeholder='Confirm Password' name='confirmPassword' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type='primary' block loading={isProcessing} htmlType='submit' onClick={handleSubmit}>Register</Button>
            </Col>
            <Col span={24}>
              <p className='small text-center'>Already have an account? <Link to="/auth" className='text-black'>Login</Link></p>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}
