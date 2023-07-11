import Navbar from '../components/navigation/Navbar';
import VmsContent from '../components/content/VmsContent';
import {useEffect, useState} from 'react';
import {useClientError} from '../hooks/useClientError';
import {getProfileInformation} from '../HomeManager';
import {useNavigate} from 'react-router-dom';
import {Button, Col, Empty, Form, Input, message, Row} from 'antd';
import styles from '../styles/content.module.scss';
import {EditOutlined, StopOutlined} from '@ant-design/icons';
import {postTxt} from '../components/content/ContentManager';
import Loading from '../components/Loading';

function Home() {
  const [user, setUser] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const clientError = useClientError();
  const navigate = useNavigate();
  const {txtFormType} = Form.useForm();

  const getUserHandler = () => {
    getProfileInformation().then(response => {
      if (response.status === 200) {
        setUser(response.data.attr);
      }
    }).catch(error => {
      clientError(error);
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    })
  }

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      getUserHandler();
    } else {
      navigate('/login');
    }
  }, [])

  const videoListHandler = (list) => {
    let editedList = [];
    for (let item of list) {
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

  const txtFormSubmitHandler = (formValues) => {
    postTxt(formValues).then(response => {
      if (response.status === 200) {
        message.success(response.data.message)
        getUserHandler();
      } else {
        message.error(response.data.message);
      }
    }).catch((err) => {
      clientError(err);
    })
  }

  const txtForm = () => {
    return (
      <Row>
        <Col className={styles['txtFormWrapper']} span={24}>
          TPg3r99sa8nnR5EyURER5NP1P2Qf4X5rP9 (TRC20 USDT) adresine ödemenizi yaptıktan sonra

          Gönderdiğiniz borsa uygulamasına girin. Cüzdanınıza tıklayın. Çekim Geçmişi'ne(Withdraw History) girin. Ücreti gönderdiğiniz işlemin üstüne tıklayın. Tx, Txid ya da Tx Hash kodunu kopyalayıp bu bölüme yapıştırın.

        </Col>
        <Col className={styles['txtFormWrapper']} span={12}>
          <Form form={txtFormType} onFinish={txtFormSubmitHandler}>
            <Form.Item name='txt'>
              <Input placeholder="TXT'nizi giriniz."/>
            </Form.Item>
            <Button htmlType='submit' type='primary'>
              Gönder
            </Button>
          </Form>
        </Col>
      </Row>
    )
  }


  if(Object.values(user).length === 0) {
    return <Loading/>
  }
  if (user.txt_verified || user.roles === 'staff') {
    return (
      <>
        <Navbar videoList={videoList} searchCallback={videoSelectHandler} user={user}/>
        <VmsContent selectedVideoFromSelector={selectedVideo} searchCallback={videoSelectHandler}
                    videoListCallback={videoListHandler} user={user}/>
      </>
    )
  }
  else {
    return <>
      <Navbar videoList={videoList} searchCallback={videoSelectHandler} user={user}/>
      <Row className={styles['txtWrapper']} gutter={[16, 16]}>
        <Col className={styles['txtCol']} span={18}>
          <Empty image={<StopOutlined style={{fontSize: 70, color: '#d1c749'}}/>} description={<>
            {user.txt ? <><h1>{user.txt}</h1><p>
              Hesabınız henüz onay aşamasındadır.
            </p></> : txtForm()}
          </>}/>
        </Col>
      </Row>
    </>
  }
}

export default Home;
