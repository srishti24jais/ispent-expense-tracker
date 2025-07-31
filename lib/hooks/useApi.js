import { useState, useEffect, useCallback } from 'react'

// Custom hook for API calls
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiCall = useCallback(async (url, options = {}) => {
    console.log('useApi - Making request to:', url, options);
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      })
      
      console.log('useApi - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('useApi - HTTP error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('useApi - Response data:', data);
      return data
    } catch (err) {
      console.error('useApi - Error:', err);
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { apiCall, loading, error }
}

// Hook for expenses
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const { apiCall, loading, error } = useApi()

  const fetchExpenses = useCallback(async () => {
    console.log('useExpenses - Fetching expenses');
    try {
      const data = await apiCall('/api/expenses')
      console.log('useExpenses - Fetched data:', data);
      setExpenses(data.expenses || [])
      console.log('useExpenses - Updated expenses state:', data.expenses || []);
    } catch (err) {
      console.error('useExpenses - Failed to fetch expenses:', err)
    }
  }, [apiCall])

  const addExpense = useCallback(async (expense) => {
    console.log('useExpenses - Adding expense:', expense);
    try {
      const data = await apiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      })
      
      if (data.success) {
        console.log('useExpenses - Expense added successfully, refreshing list');
        // Force refresh the list immediately
        await fetchExpenses()
        console.log('useExpenses - List refreshed after adding expense');
        return data.expense
      }
    } catch (err) {
      console.error('useExpenses - Failed to add expense:', err)
      throw err
    }
  }, [apiCall, fetchExpenses])

  const deleteExpense = useCallback(async (id) => {
    console.log('useExpenses - Deleting expense:', id);
    try {
      const data = await apiCall(`/api/expenses/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        console.log('useExpenses - Expense deleted successfully, refreshing list');
        await fetchExpenses() // Refresh the list
        return data
      }
    } catch (err) {
      console.error('useExpenses - Failed to delete expense:', err)
      throw err
    }
  }, [apiCall, fetchExpenses])

  return { expenses, fetchExpenses, addExpense, deleteExpense, loading, error }
}

// Hook for settings
export const useSettings = () => {
  const [settings, setSettings] = useState({ income: 0, budget: 0 })
  const { apiCall, loading, error } = useApi()

  const fetchSettings = useCallback(async () => {
    console.log('useSettings - Fetching settings');
    try {
      const data = await apiCall('/api/settings')
      console.log('useSettings - Fetched settings:', data);
      setSettings(data.settings || { income: 0, budget: 0 })
    } catch (err) {
      console.error('useSettings - Failed to fetch settings:', err)
    }
  }, [apiCall])

  const updateSettings = useCallback(async (newSettings) => {
    console.log('useSettings - Updating settings:', newSettings);
    try {
      const data = await apiCall('/api/settings', {
        method: 'POST',
        body: JSON.stringify(newSettings),
      })
      
      if (data.success) {
        console.log('useSettings - Settings updated successfully:', data.settings);
        setSettings(data.settings)
        return data.settings
      }
    } catch (err) {
      console.error('useSettings - Failed to update settings:', err)
      throw err
    }
  }, [apiCall])

  return { settings, fetchSettings, updateSettings, loading, error }
} 