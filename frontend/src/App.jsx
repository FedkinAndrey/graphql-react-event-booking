import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Auth, Events, Bookings } from './pages';

function App() {
  return (
    <Routes>
      <>
        <Route path="/" element={<Navigate replace to="/auth" />} exact />
        <Route path="/auth" element={<Auth />} />
        <Route path="/events" element={<Events />} />
        <Route path="/bookings" element={<Bookings />} />
      </>
    </Routes>
  );
}

export default App;
