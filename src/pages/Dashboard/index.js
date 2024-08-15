import React, { useState } from 'react';
import { HomeOutlined, UserOutlined, OrderedListOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Routes from './Routes'
import { Link } from 'react-router-dom';

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label, };
}
const items = [
  getItem(<Link to='/dashboard' style={{ textDecoration: "none" }}>Home</Link>, '1', <HomeOutlined />),
  getItem(<Link to='/dashboard/users' style={{ textDecoration: "none" }}>Users</Link>, '2', <UserOutlined />),

  getItem('Todos', 'sub2', <OrderedListOutlined />,
    [
      getItem(<Link to='/dashboard/todos' style={{ textDecoration: "none" }}>Show Todos</Link>, '6', <EyeOutlined />),
      getItem(<Link to='/dashboard/todos/add-todo' style={{ textDecoration: "none" }}>Add Todo</Link>, '8', <PlusOutlined />)
    ]),
];


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ minHeight: '100vh', }} >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>

      <Layout>
        <Content>
          <Routes />
        </Content>
      </Layout>
    </Layout>
  );
};
