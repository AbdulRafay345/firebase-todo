import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Tag, Space, Modal, Button, Form, Row, Col, Input } from 'antd';
import { getDocs, collection, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from '../../../config/firebase';

const { Title, Paragraph } = Typography;
const { toastify } = window;

const initialState = { updatedTitle: '', updatedDescription: '', updatedLocation: '' };

export default function TodoTable() {
    const [dataSource, setDataSource] = useState([]);
    const [state, setState] = useState(initialState);
    const [isLoading, setIsloading] = useState(false);
    const [currentTodo, setCurrentTodo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (todo) => {
        setCurrentTodo(todo);
        setState({
            updatedTitle: todo.title,
            updatedDescription: todo.description,
            updatedLocation: todo.location,
        });
        setIsModalOpen(true);
    };
    const handleOk = () => {
        updateSubmit(currentTodo);
        setIsModalOpen(false);
    };
    const handleCancel = () => { setIsModalOpen(false); };


    const fetchData = async () => {
        setIsloading(true);
        const querySnapshot = await getDocs(collection(firestore, "todos"));
        const data = querySnapshot.docs.map(doc => ({
            key: doc.id,
            title: doc.data().title,
            location: doc.data().location,
            description: doc.data().description,
            status: doc.data().status,
            id: doc.data().id,
        }));
        setDataSource(data);
        setIsloading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleComplete = async (todo) => {

        try {
            const docRef = doc(firestore, "todos", todo.id);
            await setDoc(docRef, { status: 'complete', dateUpdated: serverTimestamp() }, { merge: true });
            setDataSource(s => s.map(item => item.id === todo.id ? { ...item, status: 'complete', dateUpdated: serverTimestamp() } : item));
            toastify('Todo marked as complete', "success");
        } catch (error) {
            console.error("Error updating document: ", error);
            toastify('Failed to mark todo as complete', "error");
        }
    };

    const handleChange = (e) => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const updateSubmit = async (todo) => {

        const { updatedTitle, updatedDescription, updatedLocation } = state;

        const formData = {
            title: updatedTitle,
            description: updatedDescription,
            location: updatedLocation,
            dateUpdated: serverTimestamp()
        };

        try {
            const docRef = doc(firestore, "todos", todo.id);
            await setDoc(docRef, formData, { merge: true });
            setDataSource(s => s.map(item => item.id === todo.id ? { ...item, ...formData } : item));
            toastify("Todo updated successfully", "success");
        } catch (err) {
            console.error(err.code);
            toastify("Something went wrong while updating the todo", "error");
        }
    };

    const handleDelete = async (todo) => {
        try {
            setDataSource(s => (s.filter(item => item.id !== todo.id)));
            await deleteDoc(doc(firestore, "todos", todo.id));
            toastify("Todo deleted successfully", "success");
        } catch (err) {
            console.error(err.code);
            toastify("Something went wrong while deleting the todo", "error");
        }
    };

    const columns = [
        { title: "#", dataIndex: "index", render: (_, __, c) => c + 1 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Description', dataIndex: 'description', key: 'description',
            render: (text) => (
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                    {text}
                </Paragraph>
            ),
        },
        { title: 'Id', dataIndex: 'id', key: 'id' },
        {
            title: 'Status', key: 'status', dataIndex: 'status',
            render: (text) => <Tag color={text === 'complete' ? 'success' : 'warning'} className='text-capitalize'>{text}</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type='primary' style={{background:"#008000"}} onClick={() => handleComplete(record)}>Complete</Button>
                    <Button  onClick={() => showModal(record)}>Update</Button>
                    <Button type='primary' danger onClick={() => handleDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', padding: '20px' }}>
                <Title>Todos</Title>
                <Card style={{ width: '90%', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', overflowY: 'auto', maxHeight: '80vh' }}>
                    <Table columns={columns} dataSource={dataSource} pagination={false} loading={isLoading} />
                </Card>
            </div>

            {/* Update Modal */}
            <Modal
                title="Update Todo"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={
                    <>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type='primary' onClick={handleOk}>Update</Button>
                    </>
                }
            >
                <Form className='p-5'>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input type='text' placeholder='Title' name='updatedTitle' value={state.updatedTitle} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Input type='text' placeholder='Location' name='updatedLocation' value={state.updatedLocation} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Input.TextArea rows={4} placeholder='Description' name='updatedDescription' value={state.updatedDescription} style={{ resize: "none" }} onChange={handleChange} />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}
