import styles from '../../styles/form.module.scss';
import {Button, Form, Input, message, Modal} from 'antd';
import {loginHandler, resetPasswordHandlerOne, resetPasswordHandlerTwo} from '@/components/forms/FormManager';
import Image from 'next/image';
import logo from '../../assets/images/logo.jpeg';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Link from 'next/link';

const LoginForm = () => {
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordFormInputs, setResetPasswordFormInputs] = useState(false);
  const [loginForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const [resetPasswordFormWithToken] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      message.success('Giriş yapmış kullanıcı mevcut.')
      router.push('/')
    }
  }, [])

  const resetPasswordFormHandlerWithToken = (formValues) => {
    if(formValues.password !== formValues.password_confirmation) {
      return message.error('Şifreler uyuşmuyor.')
    }
    resetPasswordHandlerTwo(formValues).then(response => {
      if(response.status === 200) {
        message.success(response.data.message);
        setResetPasswordFormInputs(true);
      }
      else {
        message.error(response.data.message);
      }
    }).catch(error => {
      message.error(error.response.data.message ? error.response.data.message : error.response.data.errors.token ? error.response.data.errors.token[0] : error.response.data.errors[0]);
    })
  }

  const resetPasswordFormHandler = (formValues) => {
    resetPasswordHandlerOne(formValues).then(response => {
      if(response.status === 200) {
        message.success(response.data.message);
        setResetPasswordFormInputs(true);
      }
      else {
        message.error(response.data.message);
      }
    }).catch(error => {
      message.error(error.response.data.message ? error.response.data.message : error.response.data.errors.email[0]);
    })
  }

  const loginFormHandler = (formValues) => {
    const isEmpty = Object.values(formValues).every(x => x === null || x === '');
    if (!isEmpty) {
      loginHandler(formValues).then(response => {
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.attr.access_token);
          router.push('/');
          return message.success(response.data.message);
        } else {
          return message.error(response.data.message);
        }
      }).catch(error => {
        message.error(error.response.data.message ? error.response.data.message : error.response.data.errors[0]);
      })
    } else {
      return message.error('Giriş yapmak için lütfen alanları doldurunuz.')
    }
  }

  return <div className={styles['formWrapper']}>
    <Form className={styles['form']} form={loginForm} onFinish={loginFormHandler}>
      <Image
        src={logo}
        alt='Company Logo'
      />
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='email'>
        <Input placeholder='Email'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password'>
        <Input type='password' placeholder='Şifre'/>
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        Giriş Yap
      </Button>
      <div className={styles['actionWrapper']}>
        <Link href="/register">Kayıt Ol</Link>
        <Button onClick={() => setResetPassword(true)} type='dashed'>Şifremi Unuttum</Button>
      </div>
    </Form>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Şifre Sıfırlama'
      open={resetPassword}
      onCancel={() => setResetPassword(false)}
      footer={false}>
      <Form
        form={resetPasswordForm}
        className={styles['form']}
        onFinish={resetPasswordFormHandler}
      >
        <p>
          Aşağıda gireceğiniz mail adresi, sistemimizde ki hesap ile eşleşirse bir token göndereceğiz.
        </p>
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='email'>
          <Input placeholder='Email'/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Token Gönder!
        </Button>
      </Form>
    </Modal>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Şifre Sıfırlama'
      open={resetPasswordFormInputs}
      onCancel={() => setResetPasswordFormInputs(false)}
      footer={false}>
      <Form
        form={resetPasswordFormWithToken}
        className={styles['form']}
        onFinish={resetPasswordFormHandlerWithToken}
      >
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='token'>
          <Input placeholder='Token'/>
        </Form.Item>
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password'>
          <Input type='password' placeholder='Şifre'/>
        </Form.Item>
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password_confirmation'>
          <Input type='password' placeholder='Şifre Tekrar'/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Şifremi Sıfırla
        </Button>
      </Form>
    </Modal>
  </div>
}

export default LoginForm;