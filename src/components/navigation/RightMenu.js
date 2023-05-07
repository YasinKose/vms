import React from 'react';
import {Menu} from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';

const RightMenu = ({user}) => {
  const navigate = useNavigate();
  const items = [
    {
      label: user ? user.name + ' ' + user.surname : '',
      key: '1',
      icon: <UserOutlined />,
      children: [
        {
          label: 'Çıkış Yap',
          key: 'log-out',
          icon: <LogoutOutlined/>,
        }
      ]
    },
  ]

  const onClick = (e) => {
    if(e.key === 'log-out') {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  return (
    <Menu onClick={onClick} items={items} mode='inline'/>
  );
};

export default RightMenu;