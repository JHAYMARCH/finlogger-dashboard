import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteConfirmationModal = ({ showDM, handleDMClose, handleDelete }) => {
  return (
    <Modal show={showDM} onHide={handleDMClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this expense?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDMClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
