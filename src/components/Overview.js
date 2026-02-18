import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import OverviewCard from './OverviewCard';
import { useExpenseModal } from '../context/ExpenseModalContext';
import incomeIcon from '../assets/income-icon.svg';

const Overview = ({
  totalExpenses = 0,
  userIncome = 0,
  month = '',
  handleMonthChange,
  handleIncomeChange,
}) => {
  const { handleShow } = useExpenseModal();
  const balance = Number(userIncome) - Number(totalExpenses);
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
      Number(value || 0)
    );

  return (
    <div className="overview">
      <h4 className="overview-hd heading">OVERVIEW</h4>
      <Row className="align-items-end">
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <Form.Control
            id="monthFilter"
            type="month"
            value={month}
            onChange={handleMonthChange}
          />
        </Col>
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <Form.Control
            id="incomeField"
            type="number"
            min="0"
            step="1"
            value={userIncome}
            onChange={handleIncomeChange}
            placeholder="Enter monthly income"
          />
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button variant="primary" onClick={handleShow}>
            Add Expense
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={4}>
          <OverviewCard
            cardIcon="https://img.icons8.com/?size=100&id=19411&format=png&color=000000"
            cardText={formatCurrency(totalExpenses)}
            cardTitle="Expenses"
          />
        </Col>
        <Col xs={12} md={4}>
          <OverviewCard
            cardIcon={incomeIcon}
            cardText={formatCurrency(userIncome)}
            cardTitle="Monthly Income"
          />
        </Col>
        <Col xs={12} md={4}>
          <OverviewCard
            cardIcon="https://img.icons8.com/?size=100&id=23877&format=png&color=000000"
            cardText={formatCurrency(balance)}
            cardTitle="Balance"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
