import React, { useState } from 'react';
import { Col, Form, Input, Row, Button, Typography } from 'antd';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthContext } from '../../../contexts/AuthContext';
import { firestore } from '../../../config/firebase';

const { Title } = Typography;
const { toastify } = window;

const initialState = { title: "", location: "", description: "", status: "incomplete" };

export default function AddTodo() {
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuthContext();

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();

        const { title, location, description, status } = state

        if (title.length < 3) return toastify("Please enter title properly", "error");

        setIsProcessing(true);
        try {
            const id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
            const formData = { title, location, description, status, user_id: user.uid, id, dateCreated: serverTimestamp() };

            await setDoc(doc(firestore, "todos", id), formData);

            toastify("Todo added successfully", "success");
            setState(initialState);
        } catch (error) {
            toastify('Something went wrong while adding a new todo', "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0077b6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card border border-2 rounded-2 w-100" style={{ maxWidth: '800px' }}>
                <Form className='p-5'>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Title level={2} className='text-center'>Add Todo</Title>
                        </Col>
                        <Col span={24}>
                            <Input type='text' placeholder='Title' name='title' value={state.title} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Input type='text' placeholder='Location' name='location' value={state.location} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Input.TextArea rows={5} placeholder='Description' name='description' value={state.description} style={{ resize: "none" }} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Button type='primary' block loading={isProcessing} htmlType='submit' onClick={handleSubmit}>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}
