import {useEffect, useState} from 'react';
import {checkAuth} from '../components/forms/FormManager';
import {useClientError} from '../hooks/useClientError';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../styles/form.module.scss';
import {Button, Form, Input} from 'antd';
import logo from '../assets/images/logo.jpeg';
import Loading from '../components/Loading';

const CheckAuthorization = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Hesabınız henüz onaylanmamıştır.');

  const navigate = useNavigate();
  const clientError = useClientError();
  const {token, username} = useParams();

  useEffect(() => {
    console.log(token);
    setLoading(true);
    checkAuth(`${token}/${username}`).then(response => {
      if(response.status === 200) {
        message.success('Hesabınız onaylanmıştır, ana sayfaya yönlendiriliyorsunuz.');
        setLoading(false);
        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/');
        }, 250)
      }
      else {
        setLoading(false);
        setIsConfirmed(false);
        message.success('Hesabınız henüz onaylanmamıştır.');
      }
    }).catch(err => {
      clientError(err);
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
      {loading ? <Loading/> : isConfirmed ? 'Hesabınız onaylanmıştır, yönlendiriliyorsunuz.' : errorMessage}
    </Form>
  </div>
}

export default CheckAuthorization;