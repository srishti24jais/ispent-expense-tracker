'use client'

import { CATEGORY_ICONS, CATEGORY_LABELS } from "../lib/constants/categories";

export function ListItem({ item, onDelete }) {
  const categoryIcon = CATEGORY_ICONS[item.category] || "📌";
  const categoryLabel = CATEGORY_LABELS[item.category] || "Other";
  
  // Helper function to safely parse price
  const safeParsePrice = (price) => {
    const parsed = Number.parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id);
    }
  };
  
  return (
    <tr className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-150">
      <td className="py-4 px-4">
        <div>
          <div className="text-gray-800 font-semibold">{item.name || 'Unnamed Expense'}</div>
          {item.date && (
            <div className="text-xs text-gray-500">{formatDate(item.date)}</div>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
          <span className="mr-2">{categoryIcon}</span>
          {categoryLabel}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="text-gray-800 font-bold text-lg">
          ₹{safeParsePrice(item.price).toLocaleString()}
        </span>
      </td>
      <td className="py-4 px-4 text-center">
        <button
          onClick={handleDelete}
          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors duration-200 group"
          title="Delete expense"
        >
          <svg 
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      </td>
    </tr>
  );
} 