import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { useExpenseModal } from '../context/ExpenseModalContext';

const ExpenseDetails = ({ expenseDetails = [] }) => {
  const { handleShow } = useExpenseModal();
  const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

  return (
    <div className="expense-details">
      <h4 className="heading">Expense Details</h4>
      <div className="tbl-container">
        <Table id="expenseTable" striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseDetails.length > 0 ? (
              expenseDetails.map((expense) => (
                <tr key={expense._id}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.categoryName}</td>
                  <td>{expense.description}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>
                    <Button
                      className="edit"
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleShow('edit', expense)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No expense details found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseDetails;
