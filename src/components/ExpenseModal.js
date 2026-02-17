import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useExpenseModal } from '../context/ExpenseModalContext';

const getInitialFormState = (expenseToEdit) => ({
  date: expenseToEdit?.date ? String(expenseToEdit.date).slice(0, 10) : '',
  categoryName: expenseToEdit?.categoryName || '',
  description: expenseToEdit?.description || '',
  amount: expenseToEdit?.amount ? String(expenseToEdit.amount) : '',
});

const ExpenseModal = ({
  mode = 'add',
  expenseToEdit = null,
  expenseCategories = [],
  onSubmit,
  show: showProp,
  onHide,
}) => {
  const { show: contextShow, handleClose: contextHandleClose } = useExpenseModal();
  const show = typeof showProp === 'boolean' ? showProp : contextShow;
  const handleClose = onHide || contextHandleClose;
  const [validated, setValidated] = React.useState(false);
  const [formData, setFormData] = React.useState(getInitialFormState(expenseToEdit));

  React.useEffect(() => {
    setFormData(getInitialFormState(expenseToEdit));
    setValidated(false);
  }, [expenseToEdit, mode, show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    if (onSubmit) {
      onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
    }
    handleClose();
  };

  const isEditMode = mode === 'edit';

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form noValidate validated={validated} id="expenseForm" onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="expenseDate" className="form-group">
            <Form.Label>Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid date.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="expenseCategory" className="form-group">
            <Form.Label>Category</Form.Label>
            <Form.Select
              required
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a category.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="expenseDescription" className="form-group">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="expenseAmount" className="form-group">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              required
              type="number"
              min="0.01"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an amount.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpenseModal;
