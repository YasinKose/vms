import {Button, Col, Row, message, Modal} from 'antd';
import styles from '../../styles/content.module.scss';
import {
  EditOutlined,
  LeftCircleOutlined,
  RightCircleFilled,
  RightCircleOutlined,
  VideoCameraAddOutlined
} from '@ant-design/icons';
import ReactHlsPlayer from 'react-hls-player';
import {useEffect, useRef, useState} from 'react';
import {getVideoDetails, getVideoWatch} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import Loading from '../../components/Loading';
import VideoManagementModal from '../../components/forms/VideoManagementModal';
import {useNavigate, useParams} from 'react-router-dom';

import 'vidstack/styles/defaults.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';


const VideoPlayer = ({user, videoDetails, revokeHandler, revokeVideoChange}) => {
  if(Object.values(videoDetails).length === 0) {
    return <Loading/>
  }

  const [videoWatch, setVideoWatch] = useState({});
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [addVideoModal, setAddVideoModal] = useState(false);
  const [videoEdit, setVideoEdit] = useState(false);
  const [selectedVideoDetails, setSelectedVideoDetails] = useState(videoDetails);

  const clientError = useClientError();
  const playerRef = useRef();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    getVideoWatchDetails();
  }, [videoDetails, param.slug])

  const getVideoWatchDetails = () => {
    setLoadingVideo(true);
    let videoSlug = param.slug ? param.slug : videoDetails.slug;
    getVideoDetails(videoSlug).then(response => {
      if(response.status === 200) {
        setSelectedVideoDetails(response.data.attr);
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
    getVideoWatch(videoSlug).then(response => {
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

  const skipVideo = (to) => {
    if(to === 'next') {
      revokeVideoChange(selectedVideoDetails?.next_video?.slug);
    }
    else {
      revokeVideoChange(selectedVideoDetails?.previous_video?.slug);
    }
  }

  const videoMaker = () => {
    if(videoWatch.watched_video.hls_url === null) {
      getVideoWatchDetails();
    }
    else {
      return <div className={styles['videoControls']}>
        {selectedVideoDetails?.previous_video && <LeftCircleOutlined onClick={() => skipVideo('previous')} className={styles['previousButton']}/>}
        {selectedVideoDetails?.next_video && <RightCircleOutlined onClick={() => skipVideo('next')} className={styles['nextButton']}/>}
        <MediaPlayer
          src={videoWatch.watched_video.hls_url}
          controls
        >
          {/* ^ remove `controls` attribute if you're designing a custom UI */}
          <MediaOutlet />
        </MediaPlayer>
      </div>
    }
  }

  return <Row>
    <Col span={24} className={styles['playerHeader']}>
      <div>
        <span className={styles['playerHeaderBlock']}>&nbsp;</span>
        <strong>
          {selectedVideoDetails.title}
        </strong>
      </div>
      <div className={styles['playerInformation']}>
        {user?.is_admin && <>
          <Button className={styles['webButton']} onClick={() => setAddVideoModal(true)} type='primary' icon={<VideoCameraAddOutlined />}>Video Ekle</Button>
          <Button className={styles['mobileButton']} onClick={() => setAddVideoModal(true)} type='primary' icon={<VideoCameraAddOutlined />}/>
        </>}
        {user?.is_admin && <>
          <Button className={styles['webButton']} onClick={() => {
            setAddVideoModal(true);
            setVideoEdit(true);
          }} type='dashed' icon={<EditOutlined />}>Video Düzenle</Button>
          <Button className={styles['mobileButton']} onClick={() => {
            setAddVideoModal(true);
            setVideoEdit(true);
          }} type='dashed' icon={<EditOutlined />}/>
        </>}
      </div>
    </Col>
    <Col span={24}>
      <p className={styles['videoDescription']}>
        {selectedVideoDetails.description}
      </p>
    </Col>
    <Col span={24} className={styles['videoPlayerWrapper']}>
      {Object.values(videoWatch).length === 0 || loadingVideo ? <Loading/> : videoMaker() }
    </Col>
    <Modal
      destroyOnClose={true}
      width={600}
      title={videoEdit ? 'Video Düzenle' : 'Video Ekle'}
      open={addVideoModal}
      onCancel={() => {
        setAddVideoModal(false);
        setVideoEdit(false);
      }}
      footer={false}>
      <VideoManagementModal revokeHandler={() => {
        setAddVideoModal(false);
        revokeHandler();
      }} isEdit={videoEdit} videoDetails={selectedVideoDetails}/>
    </Modal>
  </Row>
}

export default VideoPlayer;