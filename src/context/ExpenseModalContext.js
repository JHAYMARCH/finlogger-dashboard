import React, { createContext, useContext, useMemo, useState } from 'react';

const ExpenseModalContext = createContext(null);

export const ExpenseModalProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleShow = (mode = 'add', expense = null) => {
    setModalMode(mode);
    setSelectedExpense(expense);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setModalMode('add');
    setSelectedExpense(null);
  };

  const value = useMemo(
    () => ({
      show,
      setShow,
      modalMode,
      selectedExpense,
      handleShow,
      handleClose,
      HnadleClose: handleClose,
    }),
    [show, modalMode, selectedExpense]
  );

  return <ExpenseModalContext.Provider value={value}>{children}</ExpenseModalContext.Provider>;
};

export const useExpenseModal = () => {
  const context = useContext(ExpenseModalContext);

  if (!context) {
    throw new Error('useExpenseModal must be used within an ExpenseModalProvider');
  }

  return context;
};

export default ExpenseModalContext;
