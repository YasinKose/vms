'use client';
import Navbar from '@/components/navigation/Navbar';
import VmsContent from '@/components/content/VmsContent';
import withAuth from '@/helpers/WithAuth';
import {useEffect, useState} from 'react';
import {getProfileInformation} from '@/app/HomeManager';
import {useClientError} from '@/hooks/useClientError';

const Home = () => {
  const [user, setUser] = useState(null);
  const clientError = useClientError();
  useEffect(() => {
    getProfileInformation().then(response => {
      if(response.status === 200) {
        setUser(response.data.attr);
      }
    }).catch(error => {
      clientError(error);
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