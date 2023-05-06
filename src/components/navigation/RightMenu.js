import React from 'react';
import {Menu, Avatar} from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const RightMenu = ({user}) => {
  const router = useRouter();
  const items = [
    {
      label: user ? user.name + ' ' + user.surname : '',
      key: '1',
      icon: <UserOutlined />,
      children: [
        {
          label: 'Logout',
          key: 'log-out',
          icon: <LogoutOutlined/>,
        }
      ]
    },
  ]

  const onClick = (e) => {
    if(e.key === 'log-out') {
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  return (
    <Menu onClick={onClick} items={items} mode='inline'/>
  );
};

export default RightMenu;