'use client';
import { useRouter } from 'next/navigation';

const withAuth = Component => {
  const Auth = (props) => {
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('access_token');

    if (!isLoggedIn) {
      return router.push('/login');
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