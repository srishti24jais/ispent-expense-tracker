'use client'

import { useEffect, useState, useRef } from "react";
import { ListItem } from "./ListItem";
import { useExpenses } from "../lib/context/ExpensesContext";

export function List() {
  const { expenses, fetchExpenses, deleteExpense, loading } = useExpenses();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefreshIndicator, setAutoRefreshIndicator] = useState(false);
  const prevExpensesLength = useRef(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    console.log('List component - useEffect triggered, fetching expenses');
    fetchExpenses();
  }, [fetchExpenses]); // Include fetchExpenses in dependency array since it's memoized

  // Update timestamp and show indicator when expenses are actually added/removed
  useEffect(() => {
    const currentLength = expenses.length;
    
    // Skip the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevExpensesLength.current = currentLength;
      setLastUpdated(new Date());
      return;
    }
    
    // Check if expenses count has changed
    if (currentLength !== prevExpensesLength.current) {
      console.log('List component - Expenses changed from', prevExpensesLength.current, 'to', currentLength);
      setLastUpdated(new Date());
      setAutoRefreshIndicator(true);
      
      const timer = setTimeout(() => {
        setAutoRefreshIndicator(false);
      }, 3000);
      
      prevExpensesLength.current = currentLength;
      return () => clearTimeout(timer);
    }
  }, [expenses.length]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      // The list will automatically refresh after deletion
    } catch (error) {
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleRefresh = () => {
    console.log('List component - Manual refresh triggered');
    fetchExpenses();
  };

  console.log('List component - Current expenses:', expenses);

  if (loading && expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Loading expenses...</h3>
        <p className="text-gray-500">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No expenses yet!</h3>
        <p className="text-gray-500 mb-4">Start tracking your expenses by adding your first one above.</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh List
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Total Expenses: {expenses.length}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            {autoRefreshIndicator && (
              <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-refreshed</span>
              </div>
            )}
            {!autoRefreshIndicator && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="custom-scrollbar max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-xl">
            <tr>
              <th className="text-left py-4 px-4 text-gray-700 font-bold">Item</th>
              <th className="text-left py-4 px-4 text-gray-700 font-bold">Category</th>
              <th className="text-right py-4 px-4 text-gray-700 font-bold">Amount</th>
              <th className="text-center py-4 px-4 text-gray-700 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item) => (
              <ListItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 