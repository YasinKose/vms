'use client';
import Navbar from '@/components/navigation/Navbar';
import VmsContent from '@/components/content/VmsContent';
import withAuth from '@/helpers/WithAuth';
import {useEffect, useState} from 'react';
import {getProfileInformation} from '@/app/HomeManager';
import {message} from 'antd';

const Home = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getProfileInformation().then(response => {
      if(response.status === 200) {
        setUser(response.data.attr);
      }
    }).catch(error => {
      message.error(error.response?.data?.message)
    })
  }, [])

  return (
    <>
      <Navbar user={user}/>
      <VmsContent user={user}/>
    </>
  )
}

export default withAuth(Home)