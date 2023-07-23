import { Form, Route, Routes, useLocation } from 'react-router-dom';
import GlobalStyle from './components/styles/GlobalStyled';
import WalkMateCreate from './features/walk-mate-create/WalkMateCreate';
import WalkMateAll from './features/walk-mate-all/WalkMateAll';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './features/sign-up/SignUp';
import SignIn from './features/sign-in/SignIn';
import WalkMateDetail from './features/walk-mate-detail/WalkMateDetail';
import Main from './components/Main';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AUTO_CLOSE_MS_TIME } from './constants/toastUi';
import UserPage from './features/my-page/UserPage';
import Logout from './features/sign-in/LogOut';

import Mypage from './features/my-page/MyPage';
function App() {

  const location = useLocation();
  const hideFooterRoutes = ['/'];

  const shouldHideFooter = hideFooterRoutes.some((route) => location.pathname === route);

        {!shouldHideFooter && <Footer />}

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="walk-mate">
          <Route path="all" element={<WalkMateAll />} />
          <Route path="create" element={<WalkMateCreate />} />
          <Route path=":articleId" element={<WalkMateDetail />} />
        </Route>
        <Route path="users">
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="mapChange" element={<Form />} />
          <Route path="userpage/:userId" element={<UserPage/>}/>
          <Route path="logout" element={<Logout/>}/>

        </Route>
      </Routes>
  {!shouldHideFooter && <Footer />}
      <ToastContainer autoClose={AUTO_CLOSE_MS_TIME} />
    </div>
  );
}

export default App;
