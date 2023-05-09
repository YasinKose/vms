import Navbar from '../components/navigation/Navbar';
import VmsContent from '../components/content/VmsContent';
import {useEffect, useState} from 'react';
import {useClientError} from '../hooks/useClientError';
import {getProfileInformation} from '../HomeManager';
import {useNavigate} from 'react-router-dom';

function Home() {
  const [user, setUser] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
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
        if(error.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      })
    }
    else {
      navigate('/login');
    }
  }, [])

  const videoListHandler = (list) => {
    let editedList = [];
    for(let item of list) {
      let listObject = {
        label: item.label,
        value: item.slug,
        key: item.slug
      }
      editedList.push(listObject);
    }
    setVideoList(editedList);
  }

  const videoSelectHandler = (videoSlug) => {
    setSelectedVideo(videoSlug)
  }

  return (
    <>
      <Navbar videoList={videoList} searchCallback={videoSelectHandler} user={user}/>
      <VmsContent selectedVideoFromSelector={selectedVideo} searchCallback={videoSelectHandler} videoListCallback={videoListHandler} user={user}/>
    </>
  )
}

export default Home;
