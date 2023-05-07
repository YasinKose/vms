import Navbar from '../components/navigation/Navbar';
import VmsContent from '../components/content/VmsContent';
import {useEffect, useState} from 'react';
import {useClientError} from '../hooks/useClientError';
import {getProfileInformation} from '../HomeManager';
import {useNavigate} from 'react-router-dom';

function Home() {
  const [user, setUser] = useState({});
  const clientError = useClientError();
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('access_token')) {
      getProfileInformation().then(response => {
        if(response.status === 200) {
          setUser(response.data.attr);
        }
      }).catch(error => {
        clientError(error);
      })
    }
    else {
      navigate('/login');
    }
  }, [])

  return (
    <>
      <Navbar user={user}/>
      <VmsContent user={user}/>
    </>
  )
}

export default Home;
