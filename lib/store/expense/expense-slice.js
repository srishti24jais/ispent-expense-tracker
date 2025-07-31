import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState: {
    income: 1000,
    budget: 0, // Monthly budget limit
    expenseList: [],
    countActionPerformed: 0,
  },
  reducers: {
    addExpenseAction: (currentSlice, action) => {
      const newExpense = {
        ...action.payload,
        id: Date.now(), // Add unique ID
        date: new Date().toISOString(), // Add current date
      };
      currentSlice.expenseList.push(newExpense);
    },
    setIncomeAction: (currentSlice, action) => {
      currentSlice.income = action.payload;
    },
    setBudgetAction: (currentSlice, action) => {
      currentSlice.budget = action.payload;
    },
    incrementActionPerformed: (currentSlice, action) => {
      currentSlice.countActionPerformed++;
    },
  },
});

export const { addExpenseAction, setIncomeAction, setBudgetAction, incrementActionPerformed } =
  expenseSlice.actions; 