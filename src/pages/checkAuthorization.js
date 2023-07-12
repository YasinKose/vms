import {useEffect, useState} from 'react';
import {checkAuth} from '../components/forms/FormManager';
import {useClientError} from '../hooks/useClientError';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../styles/form.module.scss';
import {Alert, Form, message} from 'antd';
import logo from '../assets/images/logo.jpeg';
import Loading from '../components/Loading';

const CheckAuthorization = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Hesabınız onaylanamamıştır.');

  const navigate = useNavigate();
  const clientError = useClientError();
  const {userUuid, verificationToken} = useParams();

  useEffect(() => {
    setLoading(true);
    checkAuth(`${userUuid}/${verificationToken}`).then(response => {
      if (response.status === 200) {
        message.success(response.data.message);
        setLoading(false);
        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/');
        }, 1500)
      } else {
        setLoading(false);
        setIsConfirmed(false);
        message.error('Hesabınız onaylanamamıştır.');
      }
    }).catch(err => {
      setErrorMessage(err.response.data.message);
      setLoading(false);
    })
  }, [])

  return <div className={styles['formWrapper']}>
    <Form
        className={styles['form']}
    >
      <img
          src={logo}
          alt='Company Logo'
      />
      {loading ?
          <Loading/> :
          isConfirmed ?
              <Alert message="Hesabınız onaylanmıştır, yönlendiriliyorsunuz." type="success" showIcon/> :
              <Alert message={errorMessage} type="error" showIcon/>
      }
    </Form>
  </div>
}

export default CheckAuthorization;