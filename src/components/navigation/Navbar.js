import React, {useEffect, useState} from 'react';
import {Layout, Button, Drawer, Input} from 'antd';
import RightMenu from './RightMenu';
import {MenuOutlined} from '@ant-design/icons';
import styles from '../../styles/navbar.module.scss';
import logo from '../../assets/images/logo.jpeg';

const Navbar = ({user}) => {
  const [visible, setVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };
  const {Search} = Input;

  const onSearchHandler = (e) => {
    console.log(e)
  }

  return (
    <nav className={styles['navbar']}>
      <Layout>
        <Layout.Header className={styles['navHeader']}>
          <div className={styles['navLogoAndSearch']}>
            <div className={styles['logo']}>
              <img
                src={logo}
                alt='Company Logo'
              />
            </div>
            <div className={styles['leftMenu']}>
              {/* <LeftMenu mode={'horizontal'}/> */}
              <Search placeholder='Arama yapın...' onSearch={(e) => onSearchHandler(e)} loading={searchLoading} enterButton/>
            </div>
          </div>
          <div className={styles['navbarMenu']}>
            <div className={styles['rightMenu']}>
              <RightMenu user={user} mode={'horizontal'}/>
            </div>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;