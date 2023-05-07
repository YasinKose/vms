import {message, Layout, Menu, Spin,} from 'antd';
import styles from '../../styles/content.module.scss';
import {HomeOutlined, UserSwitchOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import VideoPlayer from './VideoPlayer';
import UserList from './UserList';
import {getVideos} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import {useNavigate} from 'react-router-dom';

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

  const [contentPage, setContentPage] = useState('1');
  const [menuItems, setMenuItems] = useState(menuItemList);
  const [videoDetails, setVideoDetails] = useState({});
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
        setVideoDetails(menuData[0].children[0]);
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
    if(e.key !== '1' || e.key !== '2') {
      let foundVideoDetails = menuItems[0].children.find(item => item.key === e.key);
      setVideoDetails(foundVideoDetails);
      setContentPage('1');
    }
    setContentPage(e.key);
  }

  return <Layout className={styles['layoutWrapper']}>
    <Layout.Sider width={330} className={styles['sideWrapper']}>
      {menuLoading ? <Spin/> : <Menu
        mode='inline'
        defaultSelectedKeys={['1']}
        items={menuItems}
        onClick={onClick}
      />}
    </Layout.Sider>
    <Layout.Content className={styles['contentWrapper']}>
      {contentPage === "2" ? <UserList/> : <VideoPlayer revokeHandler={getVideosHandler} videoDetails={videoDetails} user={user}/>}
    </Layout.Content>
  </Layout>
}

export default VmsContent;