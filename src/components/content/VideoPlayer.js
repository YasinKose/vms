import {Alert, Button, Col, Empty, message, Modal, Row} from 'antd';
import styles from '../../styles/content.module.scss';
import {
  EditOutlined, LeftCircleOutlined, PlayCircleOutlined, RightCircleOutlined, VideoCameraAddOutlined
} from '@ant-design/icons';
import ReactHlsPlayer from 'react-hls-player';
import {useEffect, useRef, useState} from 'react';
import {getVideoDetails, getVideoWatch} from './ContentManager';
import {useClientError} from '../../hooks/useClientError';
import Loading from '../../components/Loading';
import VideoManagementModal from '../../components/forms/VideoManagementModal';
import {useNavigate, useParams} from 'react-router-dom';


const VideoPlayer = ({user, videoDetails, revokeHandler, revokeVideoChange}) => {
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
    if(Object.values(videoDetails).length > 0 ) {
      getVideoWatchDetails();
    }
  }, [videoDetails, param.slug])

  const getVideoWatchDetails = () => {
    setLoadingVideo(true);
    let videoSlug = param.slug ? param.slug : videoDetails.slug;
    getVideoDetails(videoSlug).then(response => {
      if (response.status === 200) {
        setSelectedVideoDetails(response.data.attr);
        setLoadingVideo(false);
      } else {
        message.error('Video hazırlanamadı.')
        setLoadingVideo(false);
      }
    }).catch(error => {
      clientError(error);
      setLoadingVideo(false);
    })
    getVideoWatch(videoSlug).then(response => {
      if (response.status === 200) {
        setVideoWatch(response.data.attr);
        setLoadingVideo(false);
      } else {
        message.error('Video hazırlanamadı.')
        setLoadingVideo(false);
      }
    }).catch(error => {
      clientError(error);
      setLoadingVideo(false);
    })
  }

  const skipVideo = (to) => {
    if (to === 'next') {
      revokeVideoChange(selectedVideoDetails?.next_video?.slug);
    } else {
      revokeVideoChange(selectedVideoDetails?.previous_video?.slug);
    }
  }

  const openVideoInNewTab = () => {
    const videoUrl = `https://api.captfx.com/watch/${videoWatch.watched_video.uuid}`;
    window.open(videoUrl, "_blank");
  };

  const videoMaker = () => {
    if (videoWatch.video.uuid === null) {
      if (videoWatch.watched_video.hls_url === null) {
        getVideoWatchDetails();
      } else {
        return <ReactHlsPlayer
            playerRef={playerRef}
            src={videoWatch.watched_video.hls_url}
            autoPlay={false}
            controls={true}
            width='100%'
            height='auto'
        />
      }
    } else {
      return <>
        <Alert
            className={styles['mb']}
            message="Aşağıdaki butonu kullanarak videoyu izleme ekranına geçiş yapabilirsiniz."
            type="warning"
        />

        <Alert
            className={styles['mb']}
            message={
              <div>
                <p>Herkese selamlar!</p>
                <p>Size önemli bir hatırlatma yapmak istiyoruz:</p>
                <p>
                  Video platformumuzda yer alan videoların kaydını almak veya indirmek kesinlikle yasaktır. Bu tür bir
                  davranış tespit edildiğinde, kullanıcının hesabı süresiz olarak kapatılacak ve yasal süreç
                  başlatılacaktır.
                </p>
                <p>
                  Ayrıca, daha önce yaşadığımız bazı sıkıntılardan ötürü videolara erişimde belirli bir kısıtlama
                  mevcuttur. Sitemize yalnızca "2 ayrı türdeki cihazdan" giriş yapmanıza izin verilmektedir. Bu, bir
                  PC/Laptop ve bir Mobil cihaz (ipad/telefon) şeklinde olabilir.
                </p>
                <p>
                  Lütfen unutmayın ki, aynı türdeki cihazlarla (örneğin 2 PC veya 2 mobil cihaz) giriş yapmak yasaktır
                  ve sistem tarafından otomatik olarak tespit edilip kullanıcının erişimi kesilecektir.
                </p>
                <p>
                  Bu kısıtlamaların amacı, platformumuzdaki içeriği adil ve güvenli bir şekilde paylaşmak ve tüm
                  kullanıcılarımıza keyifli bir deneyim sunmaktır.
                </p>
                <p>
                  Anlayışınız ve işbirliğiniz için teşekkür ederiz. Sizlerle birlikte güvenli ve kaliteli bir eğitim
                  serüveni yaşamak için buradayız. İyi seyirler!
                </p>
              </div>
            }
            type="warning"
        />
        <Button type='primary'
                onClick={openVideoInNewTab}
                icon={<PlayCircleOutlined/>}>Videoya Git</Button>
      </>
    }
  }

  return <Row>
    <Col span={24} className={styles['playerHeader']}>
      {
        Object.values(videoDetails).length === 0 ?
            "" :
            <div>
              <span className={styles['playerHeaderBlock']}>&nbsp;</span>
              <strong>
                {Object.values(videoDetails).length === 0 ? '' : selectedVideoDetails.title}
              </strong>
            </div>
      }
      <div className={styles['playerInformation']}>
        {user?.is_admin && <>
          <Button className={styles['webButton']} onClick={() => setAddVideoModal(true)} type='primary'
                  icon={<VideoCameraAddOutlined/>}>Video Ekle</Button>
          <Button className={styles['mobileButton']} onClick={() => setAddVideoModal(true)} type='primary'
                  icon={<VideoCameraAddOutlined/>}/>
        </>}
        {(user?.is_admin && Object.values(videoDetails).length > 0) && <>
          <Button className={styles['webButton']} onClick={() => {
            setAddVideoModal(true);
            setVideoEdit(true);
          }} type='dashed' icon={<EditOutlined/>}>Video Düzenle</Button>
          <Button className={styles['mobileButton']} onClick={() => {
            setAddVideoModal(true);
            setVideoEdit(true);
          }} type='dashed' icon={<EditOutlined/>}/>
        </>}
      </div>
    </Col>
    {Object.values(videoDetails).length === 0 ? <Col span={24}>
      <Empty description={<span>Üye kayıt süreci tamamlandıktan sonra videolar açılacaktır!</span>}/>
    </Col> : <>
      <Col span={24}>
        <p className={styles['videoDescription']}>
          {selectedVideoDetails.description}
        </p>
      </Col>
      <Col span={24} className={styles['videoPlayerWrapper']}>
        {Object.values(videoWatch).length === 0 || loadingVideo ? <Loading/> : videoMaker()}
      </Col>
      <div className={styles['buttonWrapper']}>
        <div>
          {selectedVideoDetails?.previous_video &&
              <Button type='primary' onClick={() => skipVideo('previous')} icon={<LeftCircleOutlined/>}>
                {selectedVideoDetails?.previous_video?.title}
              </Button>}
        </div>
        <div className={styles['nextWrapper']}>
          {selectedVideoDetails?.next_video &&
              <Button type='primary' onClick={() => skipVideo('next')} icon={<RightCircleOutlined/>}>
                {selectedVideoDetails?.next_video?.title}
              </Button>}
        </div>
      </div>
    </>
    }
    <Modal
        destroyOnClose={true}
        width={600}
        title={videoEdit ? 'Video Düzenle' : 'Video Ekle'}
        open={addVideoModal}
        okText='Tamam'
        cancelText='İptal'
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