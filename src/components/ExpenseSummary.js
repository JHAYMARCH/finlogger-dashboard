import React from 'react';
import { Table } from 'react-bootstrap';

const ExpenseSummary = ({ data = [] }) => {
  console.log('ExpenseSummary data length:', data.length);
  return (
    <div className="expense-summary">
      <h4 className="heading">Expense Summary</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Category</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`${item.categoryName || 'category'}-${index}`}>
              <td>{item.categoryName}</td>
              <td>{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpenseSummary;

