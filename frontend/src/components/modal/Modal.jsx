import React from 'react';
import './modal.scss';

const Modal = ({
  title,
  canCancel,
  canConfirm,
  onCancel,
  onConfirm,
  children,
}) => {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <section className="modal__actions">
        {canCancel && (
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        {canConfirm && (
          <button className="btn" onClick={onConfirm}>
            Confirm
          </button>
        )}
      </section>
    </div>
  );
};
export default Modal;
