import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Overview from './components/Overview';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseDetails from './components/ExpenseDetails';
import ExpenseModal from './components/ExpenseModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { AppProvider, useAppContext } from './context/AppContext';
import { ExpenseModalProvider, useExpenseModal } from './context/ExpenseModalContext';

const buildExpenseSummary = (expenses) => {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  if (!total) return [];

  const byCategory = expenses.reduce((acc, item) => {
    const key = item.categoryName || 'Uncategorized';
    acc[key] = (acc[key] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  return Object.entries(byCategory).map(([categoryName, amount]) => ({
    categoryName,
    percentage: `${((amount / total) * 100).toFixed(2)}%`,
  }));
};

export const AppContent = () => {
  const [month, setMonth] = React.useState('2020-01');
  const [userIncome] = React.useState(450000);
  const [showDM, setShowDM] = React.useState(false);

  const {
    expenseDetails,
    setExpenseDetails,
    setTotalExpenses,
    setExpenseSummary,
    expenseIdToDelete,
    setExpenseIdToDelete,
    expenseCategories,
  } = useAppContext();
  const { modalMode, selectedExpense } = useExpenseModal();

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const filteredExpenseDetails = React.useMemo(
    () =>
      expenseDetails.filter(
        (expense) => new Date(expense.date).toISOString().slice(0, 7) === month
      )
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenseDetails, month]
  );

  const filteredTotalExpenses = React.useMemo(
    () => filteredExpenseDetails.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filteredExpenseDetails]
  );

  const filteredExpenseSummary = React.useMemo(
    () => buildExpenseSummary(filteredExpenseDetails),
    [filteredExpenseDetails]
  );

  const handleExpenseSubmit = (submittedExpense) => {
    const formattedDate = new Date(submittedExpense.date).toISOString();

    if (modalMode === 'edit' && selectedExpense?._id) {
      const updatedExpenses = expenseDetails.map((expense) =>
        expense._id === selectedExpense._id
          ? {
              ...expense,
              ...submittedExpense,
              date: formattedDate,
            }
          : expense
      );

      setExpenseDetails(updatedExpenses);
      setTotalExpenses(updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0));
      setExpenseSummary(buildExpenseSummary(updatedExpenses));
      return;
    }

    const newExpense = {
      _id: `expense-${Date.now()}`,
      ...submittedExpense,
      date: formattedDate,
    };

    const updatedExpenses = [newExpense, ...expenseDetails];
    setExpenseDetails(updatedExpenses);
    setTotalExpenses(updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0));
    setExpenseSummary(buildExpenseSummary(updatedExpenses));
  };

  const handleDeleteRequest = (expenseId) => {
    setExpenseIdToDelete(expenseId);
    setShowDM(true);
  };

  const handleDMClose = () => {
    setShowDM(false);
    setExpenseIdToDelete(null);
  };

  const handleDelete = () => {
    if (!expenseIdToDelete) {
      handleDMClose();
      return;
    }

    const updatedExpenses = expenseDetails.filter((expense) => expense._id !== expenseIdToDelete);
    setExpenseDetails(updatedExpenses);
    setTotalExpenses(updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0));
    setExpenseSummary(buildExpenseSummary(updatedExpenses));
    handleDMClose();
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
            totalExpenses={filteredTotalExpenses}
            userIncome={userIncome}
            month={month}
            handleMonthChange={handleMonthChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {filteredExpenseSummary && filteredExpenseSummary.length > 0 ? (
            <ExpenseSummary data={filteredExpenseSummary} />
          ) : (
            <p>No expense summary data for the selected month.</p>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <ExpenseDetails
            expenseDetails={filteredExpenseDetails}
            onDeleteClick={handleDeleteRequest}
          />
        </Col>
      </Row>

      <ExpenseModal
        mode={modalMode}
        expenseToEdit={selectedExpense}
        expenseCategories={expenseCategories}
        onSubmit={handleExpenseSubmit}
      />

      <DeleteConfirmationModal
        showDM={showDM}
        handleDMClose={handleDMClose}
        handleDelete={handleDelete}
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
