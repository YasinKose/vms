import Navbar from '../components/navigation/Navbar';
import VmsContent from '../components/content/VmsContent';
import {useEffect, useRef, useState} from 'react';
import {useClientError} from '../hooks/useClientError';
import {getProfileInformation} from '../HomeManager';
import {useNavigate} from 'react-router-dom';
import {Button, Col, Empty, Form, Input, message, Modal, Row, Tooltip} from 'antd';
import styles from '../styles/content.module.scss';
import {CopyOutlined, PlayCircleOutlined, StopOutlined} from '@ant-design/icons';
import {postTxt} from '../components/content/ContentManager';
import Loading from '../components/Loading';
import ReactHlsPlayer from 'react-hls-player';

function Home() {
    const [user, setUser] = useState({});
    const [videoList, setVideoList] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const clientError = useClientError();
    const navigate = useNavigate();
    const {txtFormType} = Form.useForm();
    const playerRef = useRef();

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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                    <h2>Hesabınızı aktif etmeden önce ödemeyi yapınız!</h2>
                </Col>
                <Col className={styles['txtFormWrapper']} span={24}>
                    Lütfen <><b>TWNkYmxNZQGan3ZA8xjY3T8wJdZ4dbo92P</b> <Tooltip
                    title="Kopyala!">
                    <Button
                        type="dashed"
                        shape="circle"
                        icon={<CopyOutlined/>}
                        size="middle"
                        onClick={() => {
                            navigator.clipboard.writeText("TWNkYmxNZQGan3ZA8xjY3T8wJdZ4dbo92P")
                        }}/>
                </Tooltip></> (TRC20 USDT) adresine ödemenizi yaparak devam edin.
                </Col>
                <Col className={styles['txtFormWrapper']} span={24}>
                    Ardından, ödemeyi gönderdiğiniz borsa uygulamasına erişim sağlayın. Cüzdanınıza gidin ve Çekim
                    Geçmişi(Withdraw History) bölümüne tıklayın. Yapmış olduğunuz işlem için ödenen ücretin üzerine
                    tıklayın. Ardından, Tx, Txid veya Tx Hash kodunu kopyalayın aşağıda bulunan alana yapıştırın. Bu
                    işlemle ilgili daha fazla bilgi almak için <b><a href={'mailto:support@captfx.com'}
                >support@captfx.com</a></b>
                </Col>
                <Col className={styles['txtFormWrapper']} span={24}>
                    <>
                        <Button
                            type="primary"
                            onClick={showModal}>
                            Videolu anlatım izle <PlayCircleOutlined/>
                        </Button>
                        <Modal
                            title="Tx, Txid veya Tx Hash kodu nasıl alınır?"
                            open={isModalOpen}
                            onCancel={handleCancel}
                        >
                            <ReactHlsPlayer
                                playerRef={playerRef}
                                src="https://api.captfx.com/info-video.m3u8"
                                autoPlay={false}
                                controls={true}
                                width='100%'
                                height='auto'
                            />
                        </Modal>
                    </>
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


    if (Object.values(user).length === 0) {
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
    } else {
        return <>
            <Navbar videoList={videoList} searchCallback={videoSelectHandler} user={user}/>
            <Row className={styles['txtWrapper']} gutter={[16, 16]}>
                <Col className={styles['txtCol']} span={18}>
                    <Empty image={<StopOutlined style={{fontSize: 70, color: '#d1c749'}}/>} description={<>
                        {user.verified ?
                            user.txt ?
                                <><h1>{user.txt}</h1><p>Hesabınız henüz onay aşamasındadır. </p></> :
                                txtForm() :
                            <>
                                <Row>
                                    <Col className={styles['txtFormWrapper']} span={24}>
                                        <h2>Lütfen mail kutunuzu kontrol edin.</h2>
                                    </Col>
                                    <Col className={styles['txtFormWrapper']} span={24}>
                                        Kayıt sürecinize devam etmek için öncelikle mail adresinizi doğrulamanız
                                        gerekmektedir.
                                    </Col>
                                </Row>
                            </>
                        }
                    </>}/>
                </Col>
            </Row>
        </>
    }
}

export default Home;
