'use client'

import { useSelector } from "react-redux";
import { useExpenses } from "../lib/hooks/useApi";

export function BudgetWarning() {
  const budget = useSelector((store) => store.EXPENSE.budget);
  const { expenses: expenseList } = useExpenses();
  
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
  
  // Show warning if budget is 90% or more used
  if (safeBudget > 0 && budgetPercentage >= 90) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm rounded-2xl p-6 border border-red-200 shadow-lg animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="text-red-700 font-bold text-lg">
              Budget Warning!
            </div>
            <div className="text-red-600 text-sm">
              You've reached {budgetPercentage.toFixed(1)}% of your ₹{safeBudget.toLocaleString()} budget for {monthName}.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show info if budget is 70% or more used
  if (safeBudget > 0 && budgetPercentage >= 70) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="text-yellow-700 font-bold text-lg">
              Budget Alert
            </div>
            <div className="text-yellow-600 text-sm">
              You've used {budgetPercentage.toFixed(1)}% of your ₹{safeBudget.toLocaleString()} budget for {monthName}.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
} 