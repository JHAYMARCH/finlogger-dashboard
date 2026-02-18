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
import {
  addExpense,
  deleteExpense,
  getIncome,
  saveIncome,
  updateExpense,
} from './api/persistenceApi';

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
  const [userIncome, setUserIncome] = React.useState(450000);
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

  React.useEffect(() => {
    const loadIncome = async () => {
      const persistedIncome = await getIncome();
      setUserIncome(persistedIncome);
    };
    loadIncome();
  }, []);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleIncomeChange = (event) => {
    const nextValue = Number(event.target.value);
    const safeIncome = Number.isNaN(nextValue) ? 0 : nextValue;
    setUserIncome(safeIncome);
    saveIncome(safeIncome);
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

  const handleExpenseSubmit = async (submittedExpense) => {
    const formattedDate = new Date(submittedExpense.date).toISOString();
    const submittedMonth = formattedDate.slice(0, 7);

    if (modalMode === 'edit' && selectedExpense?._id) {
      const updatedExpenses = await updateExpense(selectedExpense._id, {
        ...submittedExpense,
        date: formattedDate,
      });

      setExpenseDetails(updatedExpenses);
      setTotalExpenses(updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0));
      setExpenseSummary(buildExpenseSummary(updatedExpenses));
      setMonth(submittedMonth);
      return;
    }

    const updatedExpenses = await addExpense({
      ...submittedExpense,
      date: formattedDate,
    });
    setExpenseDetails(updatedExpenses);
    setTotalExpenses(updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0));
    setExpenseSummary(buildExpenseSummary(updatedExpenses));
    setMonth(submittedMonth);
  };

  const handleDeleteRequest = (expenseId) => {
    setExpenseIdToDelete(expenseId);
    setShowDM(true);
  };

  const handleDMClose = () => {
    setShowDM(false);
    setExpenseIdToDelete(null);
  };

  const handleDelete = async () => {
    if (!expenseIdToDelete) {
      handleDMClose();
      return;
    }

    const updatedExpenses = await deleteExpense(expenseIdToDelete);
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
            handleIncomeChange={handleIncomeChange}
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
