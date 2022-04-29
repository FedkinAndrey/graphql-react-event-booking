import React, { useContext, useEffect, useRef, useState } from 'react';
import './events.scss';
import { Backdrop, Modal, EventList, Spinner } from '../../components';
import AuthContext from '../../context/auth-context';

const Events = () => {
  const context = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const [events, setEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
        const newEvent = {
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          price: resData.data.createEvent.price,
          date: resData.data.createEvent.date,
          creator: {
            _id: context.userId,
          },
        };

        setEvents((prevState) => {
          return [...prevState, newEvent];
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setIsCreating(false);
    setSelectedEvent(null);
  };

  const fetchEvents = () => {
    setIsLoading(true);

    const requestBody = {
      query: `query { 
        events { 
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const showDetailHandler = (eventId) => {
    setSelectedEvent(events.find((e) => e._id === eventId));
  };

  const bookEventHandler = () => {};

  return (
    <>
      {(isCreating || selectedEvent) && <Backdrop />}
      {isCreating && (
        <Modal
          title="Add Events"
          canConfirm
          canCancel
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
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
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canConfirm
          canCancel
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText="Book"
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
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
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default Events;
