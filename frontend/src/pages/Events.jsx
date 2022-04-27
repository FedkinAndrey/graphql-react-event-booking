import React, { useContext, useEffect, useRef, useState } from 'react';
import './events.scss';
import { Backdrop, Modal } from '../components';
import AuthContext from '../context/auth-context';

const Events = () => {
  const context = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEventHandler = () => {
    setIsCreating(true);
  };

  const modalConfirmHandler = () => {
    setIsCreating(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `mutation { 
        createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) { 
          _id
          title
          description
          price
          date
          creator {
            _id
            email
          }
        } 
      }`,
    };

    const token = context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then((resData) => {
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setIsCreating(false);
  };

  const fetchEvents = () => {
    const requestBody = {
      query: `query { 
        events{ 
          _id
          title
          description
          price
          date
          creator {
            _id
            email
          }
        } 
      }`,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(String(res.status));
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEvents(events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {isCreating && <Backdrop />}
      {isCreating && (
        <Modal
          title="Add Events"
          canConfirm
          canCancel
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Share your own Events</p>
          <button className="btn" onClick={createEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">
        {events.map((event) => (
          <li key={event._id} className="events__list-item">
            {event.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Events;
