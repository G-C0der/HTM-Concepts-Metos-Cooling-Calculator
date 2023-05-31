import React from 'react';
import { AuthContext, UserContext } from './contexts';
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from './pages/Register';
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
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
