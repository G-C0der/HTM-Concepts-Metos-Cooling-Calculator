import React from 'react';
import { AuthContext } from './contexts/AuthContext';
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from './pages/Register';
import {useAuth} from "./hooks/useAuth";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
