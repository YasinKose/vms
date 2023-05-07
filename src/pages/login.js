import {Layout} from 'antd';
import LoginForm from '../components/forms/LoginForm';
import styles from '../styles/form.module.scss';

export default function Login() {
  return <Layout className={styles['reusableFormWrapper']}>
    <Layout.Content>
      <LoginForm/>
    </Layout.Content>
  </Layout>
}