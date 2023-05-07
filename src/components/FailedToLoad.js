import {DatabaseOutlined} from '@ant-design/icons';
import styles from '../styles/loading.module.scss';

const FailedToLoad = () => {
  return <div className={styles['loadingWrapper']}>
    <DatabaseOutlined />
    Yayın Alınamadı.
  </div>
}

export default FailedToLoad;