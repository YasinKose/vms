import styles from '../../styles/form.module.scss';
import {Button, Form, Input, message} from 'antd';
import {registerHandler} from './FormManager';
import logo from '../../assets/images/logo.jpeg';
import {useClientError} from '../../hooks/useClientError';
import {Link, useNavigate} from 'react-router-dom';
import {InfoCircleOutlined, InfoOutlined} from '@ant-design/icons';

const LoginForm = () => {
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const clientError = useClientError();

  const registerFormHandler = (formValues) => {
    const isEmpty = Object.values(formValues).every(x => x === null || x === '');
    if(formValues.password !== formValues.password_confirmation) {
      return message.error('Şifreler uyuşmuyor.')
    }
    if(!isEmpty) {
      registerHandler(formValues).then(response => {
        if(response.status === 200) {
          navigate('/login');
          return message.success(response.data.message);
        }
        else {
          return message.error(response.data.message);
        }
      }).catch(error => {
        clientError(error);
      })
    }
    else {
      return message.error('Kayıt olmak için lütfen alanları doldurunuz.')
    }
  }

  const discordInfoHandler = () => {
    window.open(`${process.env.PUBLIC_URL}/discord-info.png`, '_blank', 'noreferrer')
  }

  return <div className={styles['formWrapper']}>
    <Form className={styles['form']} form={registerForm} onFinish={registerFormHandler}>
      <img
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
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='twitter'>
        <Input placeholder='Twitter'/>
      </Form.Item>
      <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='discord'>
        <Input placeholder='Discord'/>
        <InfoCircleOutlined onClick={discordInfoHandler} className={styles['discordInfo']} />
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
        <Link to="/login">Giriş Yap</Link>
      </div>
    </Form>
  </div>
}

export default LoginForm;