import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Auth, Events, Bookings } from './pages';
import { MainNavigation } from './components';

function App() {
  return (
    <>
      <MainNavigation />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate replace to="/auth" />} exact />
          <Route path="/auth" element={<Auth />} />
          <Route path="/events" element={<Events />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
