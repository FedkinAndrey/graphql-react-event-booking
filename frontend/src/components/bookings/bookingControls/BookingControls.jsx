import React from 'react';
import './bookingControls.scss';

const BookingControls = ({ activeOutputType, onChange }) => {
  return (
    <div className="bookings-controls">
      <button
        className={activeOutputType === 'list' ? 'active' : ''}
        onClick={() => onChange('list')}
      >
        List
      </button>
      <button
        className={activeOutputType === 'chart' ? 'active' : ''}
        onClick={() => onChange('chart')}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingControls;
