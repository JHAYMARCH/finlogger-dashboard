import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  expenseCategories as expenseCategoriesData,
  expenseData,
  expenseSummaryData,
} from '../data';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [expenseSummary, setExpenseSummary] = useState(expenseSummaryData);
  const [expenseDetails, setExpenseDetails] = useState(expenseData.expenses || []);
  const [totalExpenses, setTotalExpenses] = useState(expenseData.totalExpenses || 0);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState(
    expenseCategoriesData.categories || []
  );

  const fetchExpenseData = useCallback(async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();

      setExpenseSummary(data.expenseSummary || data.summary || expenseSummaryData);
      setExpenseDetails(data.expenseDetails || data.expenses || expenseData.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
    } catch (error) {
      // Keep current state if API is unavailable.
      console.error('Failed to fetch expense data:', error);
    }
  }, []);

  const fetchExpenseCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/category');
      const data = await response.json();
      setExpenseCategories(data.categories || expenseCategoriesData.categories || []);
    } catch (error) {
      // Keep current state if API is unavailable.
      console.error('Failed to fetch expense categories:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      expenseSummary,
      setExpenseSummary,
      expenseDetails,
      setExpenseDetails,
      totalExpenses,
      setTotalExpenses,
      expenseIdToDelete,
      setExpenseIdToDelete,
      expenseCategories,
      setExpenseCategories,
      fetchExpenseData,
      fetchExpenseCategories,
    }),
    [
      expenseSummary,
      expenseDetails,
      totalExpenses,
      expenseIdToDelete,
      expenseCategories,
      fetchExpenseData,
      fetchExpenseCategories,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export default AppContext;
