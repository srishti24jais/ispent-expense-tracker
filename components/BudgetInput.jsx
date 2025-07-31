'use client'

import { useDispatch, useSelector } from "react-redux";
import { setBudgetAction } from "../lib/store/expense/expense-slice";

export function BudgetInput() {
  const budget = useSelector((store) => store.EXPENSE.budget);
  const dispatch = useDispatch();

  function setBudget(e) {
    const value = Number.parseFloat(e.target.value);
    // Only dispatch if the value is a valid number
    if (!isNaN(value)) {
      dispatch(setBudgetAction(value));
    }
  }
  
  // Ensure we have a valid budget value for display
  const displayBudget = budget && !isNaN(Number(budget)) ? budget : '';
  
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
      <label className="block text-sm font-medium text-white mb-3">
        Monthly Budget Limit
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 text-lg font-medium">
          ₹
        </span>
        <input
          value={displayBudget}
          onChange={setBudget}
          type="number"
          min="0"
          step="0.01"
          className="w-full pl-8 pr-4 py-3 bg-white/30 border border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 font-medium"
          placeholder="Enter your budget"
        />
      </div>
      <p className="text-xs text-white/70 mt-2">
        Set a monthly spending limit to stay on track
      </p>
    </div>
  );
} 