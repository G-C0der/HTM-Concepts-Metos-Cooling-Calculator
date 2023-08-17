import React from 'react';
import {AdminContext, AuthContext, CalculatorContext, UserContext} from './contexts';
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegistrationPage from './pages/Registration';
import VerificationPage from './pages/Verification';
import PasswordResetPage from "./pages/PasswordReset";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {PrivateRoute} from './components/PrivateRoute';
import {useAuth, useUser, useAdmin, useCalculator} from "./hooks";

const App = () => {
  const auth = useAuth();
  const user = useUser();
  const admin = useAdmin();
  const calculator = useCalculator();

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={user}>
        <CalculatorContext.Provider value={calculator}>
          <AdminContext.Provider value={admin}>
            <Router>
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="/" element={<HomePage />} />
                </Route>
                <Route path='/login' element={<PrivateRoute restricted />}>
                  <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route path='/registration' element={<PrivateRoute restricted />}>
                  <Route path='/registration' element={<RegistrationPage />} />
                </Route>
                <Route path='/verification/:token' element={<VerificationPage />} />
                <Route path='/reset-password/:token' element={<PasswordResetPage />} />
              </Routes>
            </Router>
          </AdminContext.Provider>
        </CalculatorContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
