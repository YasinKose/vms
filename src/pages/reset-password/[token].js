import styles from '@/styles/form.module.scss';
import {Button, Form, Input, message} from 'antd';
import {resetPasswordHandlerTwo} from '@/components/forms/FormManager';
import {useClientError} from '@/hooks/useClientError';
import logo from '@/assets/images/logo.jpeg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [resetPasswordFormWithToken] = Form.useForm();
  const clientError = useClientError();
  const router = useRouter()
  const { token } = router.query

  const resetPasswordFormHandlerWithToken = (formValues) => {
    if (formValues.password !== formValues.password_confirmation) {
      return message.error('Şifreler uyuşmuyor.')
    }
    formValues['token'] = token;
    resetPasswordHandlerTwo(formValues).then(response => {
      if (response.status === 200) {
        message.success(response.data.message);
        router.push('/login')
      } else {
        message.error(response.data.message);
      }
    }).catch(error => {
      clientError(error);
    })
  }

  return (
    <div className={styles['formWrapper']}>
      <Form
        form={resetPasswordFormWithToken}
        className={styles['form']}
        onFinish={resetPasswordFormHandlerWithToken}
      >
        <Image
          src={logo}
          alt='Company Logo'
        />
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password'>
          <Input autoComplete='new-password' type='password' placeholder='Şifre'/>
        </Form.Item>
        <Form.Item rules={[{required: true, message: 'Bu alan zorunludur.'}]} name='password_confirmation'>
          <Input autoComplete='new-password' type='password' placeholder='Şifre Tekrar'/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Şifremi Sıfırla
        </Button>
      </Form>
    </div>
  )
}

export default ResetPassword;