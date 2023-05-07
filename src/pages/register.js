import {Layout} from 'antd';
import styles from '../styles/form.module.scss';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return <Layout className={styles['reusableFormWrapper']}>
    <Layout.Content>
      <RegisterForm/>
    </Layout.Content>
  </Layout>
}