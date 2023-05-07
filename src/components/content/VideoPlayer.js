import {Button, Col, Row, message, Modal} from 'antd';
import styles from '../../styles/content.module.scss';
import {EditOutlined, VideoCameraAddOutlined} from '@ant-design/icons';
import ReactHlsPlayer from 'react-hls-player';
import {useEffect, useRef, useState} from 'react';
import {getVideoWatch} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import Loading from '../../components/Loading';
import VideoManagementModal from '../../components/forms/VideoManagementModal';

const VideoPlayer = ({user, videoDetails, revokeHandler}) => {
  if(Object.values(videoDetails).length === 0) {
    return <Loading/>
  }

  const [videoWatch, setVideoWatch] = useState({});
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [addVideoModal, setAddVideoModal] = useState(false);
  const [videoEdit, setVideoEdit] = useState(false);

  const clientError = useClientError();
  const playerRef = useRef();

  useEffect(() => {
    getVideWatchDetails();
  }, [videoDetails])

  const getVideWatchDetails = () => {
    console.log(videoDetails)
    setLoadingVideo(true);
    getVideoWatch(videoDetails.slug).then(response => {
      if(response.status === 200) {
        setVideoWatch(response.data.attr);
        setLoadingVideo(false);
      }
      else {
        message.error('Video hazırlanamadı.')
        setLoadingVideo(false);
      }
    }).catch(error => {
      clientError(error);
      setLoadingVideo(false);
    })
  }

  const videoMaker = () => {
    if(videoWatch.watched_video.hls_url === null) {
      getVideWatchDetails();
    }
    else {
      return <ReactHlsPlayer
        playerRef={playerRef}
        src={videoWatch.watched_video.hls_url}
        autoPlay={false}
        controls={true}
        width='100%'
        height='auto'
      />
    }
  }

  return <Row>
    <Col span={24} className={styles['playerHeader']}>
      <div>
        <span className={styles['playerHeaderBlock']}>&nbsp;</span>
        <strong>
          {videoDetails.title}
        </strong>
      </div>
      <div className={styles['playerInformation']}>
        {/*
          <div className={styles['playerParticipants']}>
          <UserOutlined/>
          <span>
                Joined Classmates
              </span>
          <span className={styles['participant']}>
                34
              </span>
        </div>
        */}
        {user?.is_admin && <Button onClick={() => setAddVideoModal(true)} type='primary' icon={<VideoCameraAddOutlined />}>Video Ekle</Button>}
        {user?.is_admin && <Button onClick={() => {
          setAddVideoModal(true);
          setVideoEdit(true);
        }} type='dashed' icon={<EditOutlined />}>Video Düzenle</Button>}
      </div>
    </Col>
    <Col span={24}>
      <p className={styles['videoDescription']}>
        {videoDetails.description}
      </p>
    </Col>
    <Col span={24} className={styles['videoPlayerWrapper']}>
      {Object.values(videoWatch).length === 0 || loadingVideo ? <Loading/> : videoMaker() }
    </Col>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Video Ekle'
      open={addVideoModal}
      onCancel={() => setAddVideoModal(false)}
      footer={false}>
      <VideoManagementModal revokeHandler={() => {
        setAddVideoModal(false);
        revokeHandler();
      }} isEdit={videoEdit} videoDetails={videoDetails}/>
    </Modal>
  </Row>
}

export default VideoPlayer;