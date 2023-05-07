import React from 'react';
import {Menu} from 'antd';

const LeftMenu = ({mode}) => {
  const items = [
    {
      label: 'Explore',
      key: 'explore'
    },
    {
      label: 'Features',
      key: 'features'
    },
    {
      label: 'About Us',
      key: 'about'
    },
    {
      label: 'Contact Us',
      key: 'contact'
    },
  ]
  return (
    <Menu mode={mode} items={items}/>
  );
};

export default LeftMenu;