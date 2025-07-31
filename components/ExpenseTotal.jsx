'use client'

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useExpenses } from "../lib/hooks/useApi";
import { CATEGORY_LABELS } from "../lib/constants/categories";

export function ExpenseTotal(props) {
  const income = useSelector((store) => store.EXPENSE.income);
  const budget = useSelector((store) => store.EXPENSE.budget);
  const { expenses: expenseList, fetchExpenses } = useExpenses();
  
  // Fetch expenses when component mounts to ensure we have the latest data
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  
  // Helper function to safely parse price
  const safeParsePrice = (price) => {
    const parsed = Number.parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate all-time totals with validation
  const totalExpense = expenseList.reduce((acc, expense) => {
    return acc + safeParsePrice(expense.price);
  }, 0);

  // Calculate current month expenses with validation
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

  const remainingMoney = income - totalExpense;
  const spendingPercentage = income > 0 ? (totalExpense / income) * 100 : 0;
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  // Calculate category breakdown for current month with validation
  const categoryBreakdown = currentMonthExpenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 };
    }
    acc[category].total += safeParsePrice(expense.price);
    acc[category].count += 1;
    return acc;
  }, {});
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Financial Summary
      </h3>
      
      <div className="space-y-4">
        {/* Income */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
          <div>
            <div className="text-sm text-green-700 font-medium">Income</div>
            <div className="text-xl text-green-800 font-bold">₹{parseFloat(income || 0).toLocaleString()}</div>
          </div>
          <div className="text-green-600 text-3xl">💰</div>
        </div>
        
        {/* Current Month Expenses */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border border-blue-200">
          <div>
            <div className="text-sm text-blue-700 font-medium">{monthName} Expenses</div>
            <div className="text-xl text-blue-800 font-bold">₹{currentMonthTotal.toLocaleString()}</div>
          </div>
          <div className="text-blue-600 text-3xl">📅</div>
        </div>
        
        {/* Total Expenses */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border border-red-200">
          <div>
            <div className="text-sm text-red-700 font-medium">Total Expenses</div>
            <div className="text-xl text-red-800 font-bold">₹{totalExpense.toLocaleString()}</div>
          </div>
          <div className="text-red-600 text-3xl">💸</div>
        </div>
        
        {/* Remaining */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl border border-purple-200">
          <div>
            <div className="text-sm text-purple-700 font-medium">Remaining</div>
            <div className={`text-xl font-bold ${remainingMoney >= 0 ? 'text-purple-800' : 'text-red-600'}`}>
              ₹{remainingMoney.toLocaleString()}
            </div>
          </div>
          <div className="text-purple-600 text-3xl">💳</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {income > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Spending Progress</span>
            <span className="font-bold">{spendingPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                spendingPercentage > 90 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                spendingPercentage > 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 
                'bg-gradient-to-r from-green-400 to-emerald-500'
              }`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Category Breakdown for Current Month */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            {monthName} Category Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)
              .sort(([,a], [,b]) => b.total - a.total)
              .map(([category, data]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-gray-700 font-medium">{CATEGORY_LABELS[category] || 'Other'}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-sm">({data.count})</span>
                    <span className="text-gray-800 font-bold">₹{data.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 