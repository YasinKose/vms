import {Route, Routes} from 'react-router-dom';
import Login from '../pages/login';
import Home from '../pages/main';
import Register from '../pages/register';
import ResetPassword from '../pages/resetPassword';
import CheckAuthorization from '../pages/checkAuthorization';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/user-list" element={<Home/>}/>
      <Route path="/watch/:slug" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/reset-password/:id" element={<ResetPassword/>}/>
      <Route path="/check-authorization/:token/:username" element={<CheckAuthorization/>}/>
    </Routes>
  )
}

export default AppRouter;