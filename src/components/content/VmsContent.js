import {message, Layout, Menu, Spin,} from 'antd';
import styles from '../../styles/content.module.scss';
import {HomeOutlined, UserSwitchOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import VideoPlayer from './VideoPlayer';
import UserList from './UserList';
import {getVideos} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import {useNavigate, useParams} from 'react-router-dom';

const VmsContent = ({user}) => {
  if(!user || Object.values(user).length === 0) {
    return <Spin/>
  }

  let menuItemList = [
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
  const [menuItems, setMenuItems] = useState(menuItemList);
  const [menuLoading, setMenuLoading] = useState(false);
  const navigate = useNavigate();
  const clientError = useClientError();

  useEffect(() => {
    setMenuLoading(true);
    const isLoggedIn = localStorage.getItem('access_token');
    if(!isLoggedIn) {
      navigate('/login');
    }
    else {
      getVideosHandler();
    }
  }, []);

  const getVideosHandler = () => {
    getVideos().then(response => {
      if(response.status === 200) {
        let menuData = [...menuItemList];
        for(let video of response.data.attr) {
          video['key'] = video.slug;
          video['label'] = video.title;
          video['icon'] = <VideoCameraOutlined />
        }
        menuData[0].children = response.data.attr;
        setMenuLoading(false);
        setMenuItems(menuData);
      }
      else {
        message.error('Videolar getirilirken bir hata oluştu.');
        setMenuLoading(false);
      }
    }).catch(error => {
      clientError(error);
      setMenuLoading(false);
    })
  }

  const onClick = (e) => {
    if(e.key !== '2') {
      navigate(`/watch/${e.key}`);
    }
    if(e.key === '2') {
      navigate('/user-list')
    }
  }

  return <Layout className={styles['layoutWrapper']}>
    <Layout.Sider width={330} className={styles['sideWrapper']}>
      {menuLoading ? <Spin/> : <Menu
        mode='inline'
        defaultSelectedKeys={window.location.pathname === '/user-list' ? '2' : '1'}
        items={menuItems}
        onClick={onClick}
      />}
    </Layout.Sider>
    <Layout.Content className={styles['contentWrapper']}>
      {window.location.pathname === '/user-list' ? <UserList/> : <VideoPlayer revokeHandler={getVideosHandler} videoDetails={menuItems[0]?.children ? menuItems[0].children[0] : {}} user={user}/>}
    </Layout.Content>
  </Layout>
}

export default VmsContent;