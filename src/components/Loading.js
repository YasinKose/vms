import {Spin} from 'antd';
import styles from '../styles/loading.module.scss';

const Loading = () => {
  return <div className={styles['loadingWrapper']}>
    <Spin/>
  </div>
}

export default Loading;