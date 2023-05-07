import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const withAuth = Component => {
  const navigate = useNavigate();
  const Auth = (props) => {
    let isLoggedIn;
    useEffect(() => {
      isLoggedIn = localStorage.getItem('access_token');
    }, [])

    if (!isLoggedIn) {
      return navigate('/login');
    }
    return (
      <Component {...props} />
    );
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;