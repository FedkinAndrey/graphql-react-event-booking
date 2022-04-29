import React from 'react';
import './eventList.scss';
import EventItem from './eventItem/EventItem';

const EventList = ({ events, authUserId, onViewDetail }) => {
  if (events === null || events.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <ul className="event__list">
      {events.map((event) => (
        <EventItem
          key={event._id}
          event={event}
          userId={authUserId}
          onDetail={onViewDetail}
        />
      ))}
    </ul>
  );
};

export default EventList;
