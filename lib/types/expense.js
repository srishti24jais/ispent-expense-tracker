/**
 * @typedef {Object} Expense
 * @property {string} id - Unique identifier for the expense
 * @property {string} name - Name/description of the expense
 * @property {number} price - Amount of the expense
 * @property {string} category - Category of the expense (food, transport, etc.)
 * @property {string} date - ISO date string when the expense was added
 */

/**
 * @typedef {Object} Category
 * @property {string} value - Category identifier
 * @property {string} label - Display name for the category
 * @property {string} icon - Emoji icon for the category
 */

/**
 * @typedef {Object} CategoryBreakdown
 * @property {number} total - Total amount spent in this category
 * @property {number} count - Number of expenses in this category
 */

/**
 * @typedef {Object} ExpenseState
 * @property {number} income - User's monthly income
 * @property {Expense[]} expenseList - Array of all expenses
 * @property {number} countActionPerformed - Counter for actions performed
 */

// Export for JSDoc usage
export const EXPENSE_CATEGORIES = [
  'food', 'transport', 'shopping', 'bills', 
  'entertainment', 'health', 'education', 'other'
]; 