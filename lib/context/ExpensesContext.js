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
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      })
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await apiCall('/api/expenses')
      setExpenses(data.expenses || [])
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    }
  }, [apiCall])

  const addExpense = useCallback(async (expense) => {
    try {
      const data = await apiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      })
      
      if (data.success) {
        // Refresh the list immediately to update ALL components
        await fetchExpenses()
        return data.expense
      }
    } catch (err) {
      console.error('Failed to add expense:', err)
      throw err
    }
  }, [apiCall, fetchExpenses])

  const deleteExpense = useCallback(async (id) => {
    try {
      const data = await apiCall(`/api/expenses/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        await fetchExpenses() // Refresh the list for ALL components
        return data
      }
    } catch (err) {
      console.error('Failed to delete expense:', err)
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