import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  expenseCategories as expenseCategoriesData,
  expenseData,
} from '../data';
import { getCategories, getExpenses } from '../api/persistenceApi';

const AppContext = createContext(null);

const calculateTotalExpenses = (expenses) =>
  expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

const buildExpenseSummary = (expenses) => {
  const total = calculateTotalExpenses(expenses);
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

export const AppProvider = ({ children }) => {
  const initialExpenses = expenseData.expenses || [];
  const [expenseSummary, setExpenseSummary] = useState(buildExpenseSummary(initialExpenses));
  const [expenseDetails, setExpenseDetails] = useState(initialExpenses);
  const [totalExpenses, setTotalExpenses] = useState(calculateTotalExpenses(initialExpenses));
  const [expenseIdToDelete, setExpenseIdToDelete] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState(
    expenseCategoriesData.categories || []
  );

  const fetchExpenseData = useCallback(async () => {
    try {
      const apiExpenses = await getExpenses();

      setExpenseDetails(apiExpenses);
      setTotalExpenses(calculateTotalExpenses(apiExpenses));
      setExpenseSummary(buildExpenseSummary(apiExpenses));
    } catch (error) {
      // Keep current state if API is unavailable.
      console.error('Failed to fetch expense data:', error);
    }
  }, []);

  const fetchExpenseCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      setExpenseCategories(categories || expenseCategoriesData.categories || []);
    } catch (error) {
      // Keep current state if API is unavailable.
      console.error('Failed to fetch expense categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchExpenseData();
    fetchExpenseCategories();
  }, [fetchExpenseData, fetchExpenseCategories]);

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
