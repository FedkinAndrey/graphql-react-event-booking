import React, { useState } from 'react';
import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Auth, Events, Bookings } from './pages';
import { MainNavigation } from './components';
import AuthContext from './context/auth-context';

function App() {
  const [state, setState] = useState({ token: null, userId: null });

  const login = (token, userId, tokenInspiration) => {
    setState({ token: token, userId: userId });
  };

  const logout = () => {
    setState({ token: null, userId: null });
  };

  return (
    <>
      <AuthContext.Provider
        value={{ token: state.token, userId: state.userId, login, logout }}
      >
        <MainNavigation />
        <div className="main-content">
          <Routes>
            {!state.token && (
              <Route path="/" element={<Navigate replace to="/auth" />} exact />
            )}
            {state.token && (
              <Route
                path="/"
                element={<Navigate replace to="/events" />}
                exact
              />
            )}
            {state.token && (
              <Route
                path="/auth"
                element={<Navigate replace to="/events" />}
                exact
              />
            )}
            {!state.token && <Route path="/auth" element={<Auth />} />}
            <Route path="/events" element={<Events />} />
            {state.token && <Route path="/bookings" element={<Bookings />} />}
          </Routes>
        </div>
      </AuthContext.Provider>
    </>
  );
}

export default App;
