import React from 'react';
import './eventItem.scss';

const EventItem = ({ event, userId, onDetail }) => {
  return (
    <li className="event__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userId === event.creator._id ? (
          <p>You are owner of this event</p>
        ) : (
          <button className="btn" onClick={() => onDetail(event._id)}>
            View details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
