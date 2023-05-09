import {message, Layout, Menu, Spin, Input, Select,} from 'antd';
import styles from '../../styles/content.module.scss';
import {HomeOutlined, UserSwitchOutlined, VideoCameraOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import VideoPlayer from './VideoPlayer';
import UserList from './UserList';
import {getVideos} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import {useNavigate, useParams} from 'react-router-dom';

const VmsContent = ({user, videoListCallback, selectedVideoFromSelector}) => {
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
  const param = useParams();

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

  useEffect(() => {
    if(selectedVideoFromSelector.length > 0) {
      navigate(`/watch/${selectedVideoFromSelector}`)
    }
  }, [selectedVideoFromSelector])

  const getVideosHandler = () => {
    getVideos().then(response => {
      if(response.status === 200) {
        let menuData = [...menuItemList];
        for(let video of response.data.attr) {
          video['key'] = video.slug;
          video['label'] = video.title;
          video['value'] = video.slug;
          video['icon'] = <VideoCameraOutlined />
        }
        menuData[0].children = response.data.attr;
        videoListCallback(response.data.attr);
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

  const selectHandler = (selectedSlug) => {
    navigate(`/watch/${selectedSlug}`)
  }

  return <Layout className={styles['layoutWrapper']}>
    <Layout.Sider breakpoint="md" collapsible={true} width={330} className={styles['sideWrapper']}>
      {menuLoading ? <Spin/> : <>
        <div className={styles['searchWrapper']}>
          <Select
            showSearch
            style={{
              width: '100%',
            }}
            placeholder='Video arayın'
            optionFilterProp='children'
            onChange={(e) => selectHandler(e)}
            filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
            options={menuItems[0]?.children}/>
        </div>
        <Menu
          mode='inline'
          defaultSelectedKeys={window.location.pathname === '/user-list' ? '2' : ['1', param.slug ? param.slug : menuItems[0].children ? menuItems[0].children[0].slug : null]}
          defaultOpenKeys={['1']}
          items={menuItems}
          onClick={onClick}
        />
      </>}
    </Layout.Sider>
    <Layout.Content className={styles['contentWrapper']}>
      {window.location.pathname === '/user-list' ? <UserList/> : <VideoPlayer revokeHandler={getVideosHandler} videoDetails={menuItems[0]?.children ? menuItems[0].children[0] : {}} user={user}/>}
    </Layout.Content>
  </Layout>
}

export default VmsContent;