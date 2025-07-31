import Database from 'better-sqlite3';

let db = null;

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';

try {
  // Only initialize SQLite if not in serverless environment
  if (!isServerless) {
    // Initialize database
    db = new Database('expenses.db');
    console.log('Database initialized successfully');

    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        income REAL DEFAULT 0,
        budget REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables created/verified successfully');
  } else {
    console.log('Running in serverless environment, using in-memory storage');
  }
} catch (error) {
  console.error('Database initialization error:', error);
  // Don't throw error, just log it and continue
}

// In-memory storage for serverless environments
let inMemoryExpenses = [];
let inMemorySettings = { income: 0, budget: 0 };

// Helper functions
export const getExpenses = () => {
  if (isServerless) {
    console.log('Using in-memory storage, fetched expenses:', inMemoryExpenses.length);
    return inMemoryExpenses;
  }
  
  if (!db) {
    console.warn('Database not initialized, returning empty array');
    return [];
  }
  
  try {
    const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC');
    const expenses = stmt.all();
    console.log('Fetched expenses:', expenses.length);
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const addExpense = (expense) => {
  if (isServerless) {
    const newExpense = {
      id: Date.now(),
      ...expense,
      created_at: new Date().toISOString()
    };
    inMemoryExpenses.unshift(newExpense);
    console.log('Added expense to in-memory storage:', newExpense);
    return newExpense;
  }
  
  if (!db) {
    console.warn('Database not initialized, cannot add expense');
    throw new Error('Database not initialized');
  }
  
  try {
    const stmt = db.prepare(`
      INSERT INTO expenses (name, price, category, date) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(expense.name, expense.price, expense.category, expense.date);
    console.log('Added expense with ID:', result.lastInsertRowid);
    return { id: result.lastInsertRowid, ...expense };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const deleteExpense = (id) => {
  if (isServerless) {
    inMemoryExpenses = inMemoryExpenses.filter(expense => expense.id !== id);
    console.log('Deleted expense from in-memory storage:', id);
    return { changes: 1 };
  }
  
  if (!db) {
    console.warn('Database not initialized, cannot delete expense');
    throw new Error('Database not initialized');
  }
  
  try {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const result = stmt.run(id);
    console.log('Deleted expense with ID:', id);
    return result;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const updateUserSettings = (income, budget) => {
  if (isServerless) {
    inMemorySettings = { income, budget };
    console.log('Updated in-memory settings:', inMemorySettings);
    return inMemorySettings;
  }
  
  if (!db) {
    console.warn('Database not initialized, cannot update settings');
    throw new Error('Database not initialized');
  }
  
  try {
    // Delete existing user settings (we'll keep it simple with one user)
    db.prepare('DELETE FROM users').run();
    
    // Insert new settings
    const stmt = db.prepare('INSERT INTO users (income, budget) VALUES (?, ?)');
    const result = stmt.run(income, budget);
    console.log('Updated user settings with ID:', result.lastInsertRowid);
    return { income, budget };
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

export const getUserSettings = () => {
  if (isServerless) {
    console.log('Using in-memory settings:', inMemorySettings);
    return inMemorySettings;
  }
  
  if (!db) {
    console.warn('Database not initialized, returning default settings');
    return { income: 0, budget: 0 };
  }
  
  try {
    const stmt = db.prepare('SELECT income, budget FROM users LIMIT 1');
    const settings = stmt.get();
    console.log('Fetched user settings:', settings);
    return settings || { income: 0, budget: 0 };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { income: 0, budget: 0 };
  }
};

export default db; 