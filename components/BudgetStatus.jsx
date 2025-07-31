'use client'

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useExpenses } from "../lib/context/ExpensesContext";

export function BudgetStatus() {
  const budget = useSelector((store) => store.EXPENSE.budget);
  const { expenses: expenseList, fetchExpenses, loading } = useExpenses();
  const [autoRefreshIndicator, setAutoRefreshIndicator] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const prevExpensesLength = useRef(0);
  const isInitialMount = useRef(true);
  
  // Fetch expenses when component mounts to ensure we have the latest data
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Update timestamp and show indicator when expenses are actually added/removed
  useEffect(() => {
    const currentLength = expenseList.length;
    
    // Skip the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevExpensesLength.current = currentLength;
      setLastUpdated(new Date());
      return;
    }
    
    // Check if expenses count has changed
    if (currentLength !== prevExpensesLength.current) {
      setLastUpdated(new Date());
      setAutoRefreshIndicator(true);
      
      const timer = setTimeout(() => {
        setAutoRefreshIndicator(false);
      }, 3000);
      
      prevExpensesLength.current = currentLength;
      return () => clearTimeout(timer);
    }
  }, [expenseList.length]);
  
  // Helper function to safely parse price
  const safeParsePrice = (price) => {
    const parsed = Number.parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenseList.filter(expense => {
    // Check if expense has a valid date
    if (!expense.date) return false;
    
    try {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    } catch (error) {
      return false;
    }
  });
  
  const currentMonthTotal = currentMonthExpenses.reduce((acc, expense) => {
    return acc + safeParsePrice(expense.price);
  }, 0);
  
  // Ensure budget is a valid number
  const safeBudget = budget && !isNaN(Number(budget)) ? Number(budget) : 0;
  const budgetPercentage = safeBudget > 0 ? (currentMonthTotal / safeBudget) * 100 : 0;
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  // Show message if no budget is set
  if (safeBudget === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Budget Status - {monthName}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              {autoRefreshIndicator && (
                <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Budget updated</span>
                </div>
              )}
              {!autoRefreshIndicator && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          {loading && (
            <div className="flex items-center space-x-1 text-blue-600 text-xs">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing...</span>
            </div>
          )}
        </div>
        
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💰</div>
          <h4 className="text-lg font-bold text-gray-700 mb-2">
            No Budget Set
          </h4>
          <p className="text-gray-500 mb-4">
            Set a monthly budget to track your spending and get budget alerts.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 Tip: Set your budget in the header above to start tracking!
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine color based on percentage
  const getProgressColor = () => {
    if (budgetPercentage >= 90) return 'bg-gradient-to-r from-red-400 to-red-500';
    if (budgetPercentage >= 70) return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    return 'bg-gradient-to-r from-green-400 to-emerald-500';
  };
  
  const getTextColor = () => {
    if (budgetPercentage >= 90) return 'text-red-700';
    if (budgetPercentage >= 70) return 'text-orange-700';
    return 'text-green-700';
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Budget Status - {monthName}
          </h3>
          <div className="flex items-center space-x-2 mt-2">
            {autoRefreshIndicator && (
              <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Budget updated</span>
              </div>
            )}
            {!autoRefreshIndicator && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        {loading && (
          <div className="flex items-center space-x-1 text-blue-600 text-xs">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Refreshing...</span>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Budget Progress */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 font-medium">Monthly Budget</span>
            <span className="text-sm font-bold text-gray-800">
              ₹{currentMonthTotal.toLocaleString()} / ₹{safeBudget.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className={`text-sm font-bold ${getTextColor()}`}>
              {budgetPercentage.toFixed(1)}% used
            </span>
            <span className="text-sm text-gray-500">
              ₹{(safeBudget - currentMonthTotal).toLocaleString()} remaining
            </span>
          </div>
        </div>
        
        {/* Budget Status Message */}
        <div className={`p-4 rounded-2xl ${
          budgetPercentage >= 90 ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' : 
          budgetPercentage >= 70 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 
          'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-bold ${getTextColor()}`}>
              {budgetPercentage >= 90 ? 'Budget exceeded!' : 
               budgetPercentage >= 70 ? 'Approaching budget limit' : 
               'Budget on track'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 