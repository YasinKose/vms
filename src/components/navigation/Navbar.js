import React, {useEffect, useState} from 'react';
import {Layout, Button, Drawer, Input, Select} from 'antd';
import RightMenu from './RightMenu';
import styles from '../../styles/navbar.module.scss';
import logo from '../../assets/images/logo.jpeg';

const Navbar = ({user, searchCallback, videoList}) => {

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
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder='Video arayın'
                optionFilterProp='children'
                onChange={(e) => searchCallback(e)}
                filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                options={videoList}/>
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