import {Button, Col, Row} from 'antd';
import styles from '@/styles/content.module.scss';
import {PlusOutlined, UserOutlined} from '@ant-design/icons';
import ReactHlsPlayer from 'react-hls-player';
import {useRef} from 'react';

const VideoPlayer = () => {

  const playerRef = useRef();

  function playVideo() {
    playerRef.current.play();
  }

  function pauseVideo() {
    playerRef.current.pause();
  }

  function toggleControls() {
    playerRef.current.controls = !playerRef.current.controls;
  }

  return <Row>
    <Col span={24} className={styles['playerHeader']}>
      <div>
        <span className={styles['playerHeaderBlock']}>&nbsp;</span>
        <strong>
          Live Class - User Persona
        </strong>
      </div>
      <div className={styles['playerInformation']}>
        <div className={styles['playerParticipants']}>
          <UserOutlined/>
          <span>
                Joined Classmates
              </span>
          <span className={styles['participant']}>
                34
              </span>
        </div>
        <Button type='primary' icon={<PlusOutlined/>}>Invite</Button>
      </div>
    </Col>
    <Col span={24} className={styles['videoPlayerWrapper']}>
      <ReactHlsPlayer
        playerRef={playerRef}
        src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        autoPlay={false}
        controls={true}
        width="100%"
        height="auto"
      />
    </Col>
  </Row>
}

export default VideoPlayer;