import React from 'react';
import { AuthContext, UserContext } from './contexts';
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegistrationPage from './pages/Registration';
import VerificationPage from './pages/Verification';
import PasswordResetPage from "./pages/PasswordReset";
import {useAuth} from "./hooks/useAuth";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import {useUser} from "./hooks/useUser";

const App = () => {
  const auth = useAuth();
  const user = useUser();

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={user}>
        <Router>
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path='/registration' element={<RegistrationPage />} />
            <Route path='/verification/:token' element={<VerificationPage />} />
            <Route path='/reset-password/:token' element={<PasswordResetPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
