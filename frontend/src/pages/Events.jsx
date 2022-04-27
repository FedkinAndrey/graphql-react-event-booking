import React, { useState } from 'react';
import './events.scss';
import { Backdrop, Modal } from '../components';

const Events = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createEventHandler = () => {
    setIsCreating(true);
  };
  const modalConfirmHandler = () => {
    setIsCreating(false);
  };
  const modalCancelHandler = () => {
    setIsCreating(false);
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
          <p>Modal content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Share your own Events</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>
    </>
  );
};

export default Events;
