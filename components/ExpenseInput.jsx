'use client'

import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../lib/constants/categories";
import { useExpenses } from "../lib/hooks/useApi";

export function ExpenseInput(props) {
  const { addExpense, loading, error } = useExpenses();
  const [price, setPrice] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('food');
  const [submitError, setSubmitError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setSubmitError('');
    
    console.log('ExpenseInput - Form submitted with:', { expenseName, price, category });
    
    // Validate inputs
    const parsedPrice = Number.parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setSubmitError('Please enter a valid amount greater than 0');
      return;
    }
    
    if (!expenseName.trim()) {
      setSubmitError('Please enter an expense name');
      return;
    }
    
    const expenseData = {
      name: expenseName.trim(),
      price: parsedPrice,
      category,
      date: new Date().toISOString()
    };
    
    console.log('ExpenseInput - Attempting to add expense:', expenseData);
    
    try {
      const result = await addExpense(expenseData);
      console.log('ExpenseInput - Expense added successfully:', result);
      
      // Reset form
      setPrice('');
      setExpenseName('');
      setCategory('food');
      setSubmitError('');
    } catch (error) {
      console.error('ExpenseInput - Failed to add expense:', error);
      setSubmitError('Failed to add expense. Please try again.');
    }
  }

  // Test function for debugging
  const testAddExpense = async () => {
    console.log('ExpenseInput - Testing expense addition');
    try {
      const testExpense = {
        name: 'Test Expense',
        price: 100,
        category: 'food',
        date: new Date().toISOString()
      };
      const result = await addExpense(testExpense);
      console.log('ExpenseInput - Test expense added:', result);
    } catch (error) {
      console.error('ExpenseInput - Test failed:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-6">
        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">{submitError}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">API Error: {error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Expense Name
            </label>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 font-medium"
              placeholder="e.g., Groceries, Coffee"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer font-medium"
                required
                disabled={loading}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-white text-gray-800">
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white/60 border border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 font-medium"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`flex-1 md:flex-none px-8 py-4 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
          
          {/* Test button for debugging */}
          <button 
            type="button"
            onClick={testAddExpense}
            disabled={loading}
            className="px-4 py-4 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
          >
            Test Add
          </button>
        </div>
      </form>
    </div>
  );
} 