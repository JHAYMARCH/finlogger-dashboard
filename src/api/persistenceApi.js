import { expenseCategories, expenseData } from '../data';

const KEYS = {
  expenses: 'finlogger_expenses_v1',
  categories: 'finlogger_categories_v1',
  income: 'finlogger_income_v1',
};

const DEFAULT_INCOME = 450000;

const parseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const getStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return parseJSON(window.localStorage.getItem(key), fallback);
};

const setStored = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getExpenses = async () => {
  const stored = getStored(KEYS.expenses, null);
  if (Array.isArray(stored)) return stored;

  const seeded = expenseData.expenses || [];
  setStored(KEYS.expenses, seeded);
  return seeded;
};

export const saveExpenses = async (expenses) => {
  setStored(KEYS.expenses, expenses);
  return expenses;
};

export const addExpense = async (payload) => {
  const current = await getExpenses();
  const next = [{ _id: `expense-${Date.now()}`, ...payload }, ...current];
  return saveExpenses(next);
};

export const updateExpense = async (expenseId, payload) => {
  const current = await getExpenses();
  const next = current.map((item) => (item._id === expenseId ? { ...item, ...payload } : item));
  return saveExpenses(next);
};

export const deleteExpense = async (expenseId) => {
  const current = await getExpenses();
  const next = current.filter((item) => item._id !== expenseId);
  return saveExpenses(next);
};

export const getCategories = async () => {
  const stored = getStored(KEYS.categories, null);
  if (Array.isArray(stored)) return stored;

  const seeded = expenseCategories.categories || [];
  setStored(KEYS.categories, seeded);
  return seeded;
};

export const getIncome = async () => {
  const stored = getStored(KEYS.income, null);
  if (typeof stored === 'number' && !Number.isNaN(stored)) return stored;

  setStored(KEYS.income, DEFAULT_INCOME);
  return DEFAULT_INCOME;
};

export const saveIncome = async (income) => {
  const safeIncome = Number.isFinite(income) ? income : 0;
  setStored(KEYS.income, safeIncome);
  return safeIncome;
};
