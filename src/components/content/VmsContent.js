import {Button, Col, Layout, Menu, Row} from 'antd';
import styles from '../../styles/content.module.scss';
import {HomeOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined} from '@ant-design/icons';
import ReactHlsPlayer from 'react-hls-player';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import VideoPlayer from '@/components/content/VideoPlayer';
import UserList from '@/components/content/UserList';

const VmsContent = ({user}) => {
  const [contentPage, setContentPage] = useState("2");
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('access_token');
    if(!isLoggedIn) {
      router.push('/login');
    }
  })

  const menuItems = [
    {
      label: 'Video',
      icon: <HomeOutlined/>,
      key: 1
    },
    user && user?.is_admin &&
    {
      label: 'Kullanıcılar',
      icon: <UserSwitchOutlined />,
      key: 2
    }
  ]

  const onClick = (e) => {
    setContentPage(e.key);
  }

  return <Layout className={styles['layoutWrapper']}>
    <Layout.Sider width={330} className={styles['sideWrapper']}>
      <Menu
        mode='inline'
        defaultSelectedKeys={['1']}
        items={menuItems}
        onClick={onClick}
      />
    </Layout.Sider>
    <Layout.Content className={styles['contentWrapper']}>
      {contentPage === "1" ? <VideoPlayer/> : <UserList/>}
    </Layout.Content>
  </Layout>
}

export default VmsContent;