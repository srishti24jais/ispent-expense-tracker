'use client'

import { createContext, useContext, useState, useCallback } from 'react'

// Create the context
const ExpensesContext = createContext()

// Custom hook to use the expenses context
export const useExpenses = () => {
  const context = useContext(ExpensesContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider')
  }
  return context
}

// Provider component
export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generic API call function
  const apiCall = useCallback(async (url, options = {}) => {
    console.log('ExpensesContext - Making request to:', url, options);
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      })
      
      console.log('ExpensesContext - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ExpensesContext - HTTP error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('ExpensesContext - Response data:', data);
      return data
    } catch (err) {
      console.error('ExpensesContext - Error:', err);
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpenses = useCallback(async () => {
    console.log('ExpensesContext - Fetching expenses');
    try {
      const data = await apiCall('/api/expenses')
      console.log('ExpensesContext - Fetched data:', data);
      setExpenses(data.expenses || [])
      console.log('ExpensesContext - Updated expenses state:', data.expenses || []);
    } catch (err) {
      console.error('ExpensesContext - Failed to fetch expenses:', err)
    }
  }, [apiCall])

  const addExpense = useCallback(async (expense) => {
    console.log('ExpensesContext - Adding expense:', expense);
    try {
      const data = await apiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      })
      
      if (data.success) {
        console.log('ExpensesContext - Expense added successfully, refreshing list');
        // Force refresh the list immediately to update ALL components
        await fetchExpenses()
        console.log('ExpensesContext - List refreshed after adding expense');
        return data.expense
      }
    } catch (err) {
      console.error('ExpensesContext - Failed to add expense:', err)
      throw err
    }
  }, [apiCall, fetchExpenses])

  const deleteExpense = useCallback(async (id) => {
    console.log('ExpensesContext - Deleting expense:', id);
    try {
      const data = await apiCall(`/api/expenses/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        console.log('ExpensesContext - Expense deleted successfully, refreshing list');
        await fetchExpenses() // Refresh the list for ALL components
        return data
      }
    } catch (err) {
      console.error('ExpensesContext - Failed to delete expense:', err)
      throw err
    }
  }, [apiCall, fetchExpenses])

  const value = {
    expenses,
    fetchExpenses,
    addExpense,
    deleteExpense,
    loading,
    error
  }

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  )
}