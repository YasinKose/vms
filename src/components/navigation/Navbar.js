import React, {useEffect, useState} from 'react';
import {Layout, Button, Drawer, Input} from 'antd';
import RightMenu from './RightMenu';
import {MenuOutlined} from '@ant-design/icons';
import styles from '../../styles/navbar.module.scss';
import Image from 'next/image';
import logo from '@/assets/images/logo.jpeg';

const Navbar = ({user}) => {
  const [visible, setVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };
  const {Search} = Input;

  // If you do not want to auto-close the mobile drawer when a path is selected
  // Delete or comment out the code block below
  // From here
  //let { pathname: location } = useLocation();
  //useEffect(() => {
  //  setVisible(false);
  //}, [location]);
  // Upto here

  const onSearchHandler = (e) => {
    console.log(e)
  }

  return (
    <nav className={styles['navbar']}>
      <Layout>
        <Layout.Header className={styles['navHeader']}>
          <div className={styles['logo']}>
            <Image
              src={logo}
              alt='Company Logo'
            />
          </div>
          <div className={styles['navbarMenu']}>
            <div className={styles['leftMenu']}>
              {/* <LeftMenu mode={'horizontal'}/> */}
              <Search placeholder='Arama yapın...' onSearch={(e) => onSearchHandler(e)} loading={searchLoading} enterButton/>
            </div>
            <Button className={styles['menuButton']} type='text' onClick={showDrawer}>
              <MenuOutlined/>
            </Button>
            <div className={styles['rightMenu']}>
              <RightMenu user={user} mode={'horizontal'}/>
            </div>

            <Drawer
              title={'Brand Here'}
              placement='right'
              closable={true}
              onClose={showDrawer}
              open={visible}
              style={{zIndex: 99999}}
            >
              {/*<LeftMenu mode={'inline'}/> */}
              <RightMenu mode={'inline'}/>
            </Drawer>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;