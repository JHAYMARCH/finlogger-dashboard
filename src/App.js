import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Overview from './components/Overview';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseDetails from './components/ExpenseDetails';
import ExpenseModal from './components/ExpenseModal';
import { AppProvider, useAppContext } from './context/AppContext';
import { ExpenseModalProvider, useExpenseModal } from './context/ExpenseModalContext';
import { user } from './data';

export const AppContent = () => {
  const [month, setMonth] = React.useState('2020-01');
  const [userIncome] = React.useState(user.income || 0);

  const {
    expenseSummary,
    expenseDetails,
    totalExpenses,
    expenseIdToDelete,
    setExpenseIdToDelete,
    fetchExpenseData,
    fetchExpenseCategories,
    expenseCategories,
  } = useAppContext();
  const { modalMode, selectedExpense } = useExpenseModal();
  const expenseSummaryData = expenseSummary;

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <Header />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Overview
            totalExpenses={totalExpenses}
            userIncome={userIncome}
            month={month}
            handleMonthChange={handleMonthChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {expenseSummaryData && expenseSummaryData.length > 0 ? (
            <ExpenseSummary data={expenseSummaryData} />
          ) : (
            <p>Loading Expense Summary data...</p>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <ExpenseDetails
            expenseDetails={expenseDetails}
            expenseIdToDelete={expenseIdToDelete}
            setExpenseIdToDelete={setExpenseIdToDelete}
            fetchExpenseData={fetchExpenseData}
            fetchExpenseCategories={fetchExpenseCategories}
          />
        </Col>
      </Row>

      <ExpenseModal
        mode={modalMode}
        expenseToEdit={selectedExpense}
        expenseCategories={expenseCategories}
      />
    </Container>
  );
};

const App = () => (
  <AppProvider>
    <ExpenseModalProvider>
      <AppContent />
    </ExpenseModalProvider>
  </AppProvider>
);

export default App;
