import Database from 'better-sqlite3';

let db = null;

try {
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
} catch (error) {
  console.error('Database initialization error:', error);
  // Don't throw error, just log it and continue
}

// Helper functions
export const getExpenses = () => {
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
    console.log('Updated user settings');
    return result;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

export const getUserSettings = () => {
  if (!db) {
    console.warn('Database not initialized, returning default settings');
    return { income: 0, budget: 0 };
  }
  
  try {
    const stmt = db.prepare('SELECT * FROM users LIMIT 1');
    const user = stmt.get();
    console.log('Fetched user settings:', user);
    return user || { income: 0, budget: 0 };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { income: 0, budget: 0 };
  }
};

export default db; 