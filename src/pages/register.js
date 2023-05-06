import {Col, Row, Layout} from 'antd';
import LoginForm from '@/components/forms/LoginForm';
import styles from '../styles/form.module.scss';
import RegisterForm from '@/components/forms/RegisterForm';

export default function Login() {
  return <Layout className={styles['reusableFormWrapper']}>
    <Layout.Content>
      <RegisterForm/>
    </Layout.Content>
  </Layout>
}