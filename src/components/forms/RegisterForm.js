import styles from '../../styles/form.module.scss';
import {Button, Form, Input, message} from 'antd';
import {registerHandler} from '@/components/forms/FormManager';
import Image from 'next/image';
import logo from '../../assets/images/logo.jpeg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
  const [registerForm] = Form.useForm();
  const router = useRouter();

  const registerFormHandler = (formValues) => {
    const isEmpty = Object.values(formValues).every(x => x === null || x === '');
    if(formValues.password !== formValues.password_confirmation) {
      return message.error('Şifreler uyuşmuyor.')
    }
    if(!isEmpty) {
      registerHandler(formValues).then(response => {
        if(response.status === 200) {
          router.push('/login');
          return message.success(response.data.message);
        }
        else {
          return message.error(response.data.message);
        }
      }).catch(error => {
        message.error(error.response.data.message ? error.response.data.message : error.response.data.errors[0]);
      })
    }
    else {
      return message.error('Kayıt olmak için lütfen alanları doldurunuz.')
    }
  }

  return <div className={styles['formWrapper']}>
    <Form className={styles['form']} form={registerForm} onFinish={registerFormHandler}>
      <Image
        src={logo}
        alt="Company Logo"
      />
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='name'>
        <Input placeholder='İsim'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='surname'>
        <Input placeholder='Soyisim'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='email'>
        <Input placeholder='Email'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password'>
        <Input type='password' placeholder='Şifre'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password_confirmation'>
        <Input type='password' placeholder='Şifre Tekrar'/>
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        Kayıt Ol
      </Button>
      <div className={styles['actionWrapper']}>
        <Link href="/login">Giriş Yap</Link>
      </div>
    </Form>
  </div>
}

export default LoginForm;