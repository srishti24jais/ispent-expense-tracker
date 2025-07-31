import { NextResponse } from 'next/server'
import { getExpenses, addExpense } from '../../../lib/db'

export async function GET() {
  try {
    console.log('GET /api/expenses - Starting request');
    const expenses = getExpenses()
    console.log('GET /api/expenses - Success, returning', expenses.length, 'expenses');
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('GET /api/expenses - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    console.log('POST /api/expenses - Starting request');
    const body = await request.json()
    console.log('POST /api/expenses - Request body:', body);
    
    const newExpense = addExpense({
      name: body.name,
      price: body.price,
      category: body.category,
      date: body.date || new Date().toISOString()
    })
    
    console.log('POST /api/expenses - Success, created expense:', newExpense);
    return NextResponse.json({ 
      success: true, 
      expense: newExpense 
    })
  } catch (error) {
    console.error('POST /api/expenses - Error:', error)
    return NextResponse.json(
      { error: 'Failed to add expense', details: error.message },
      { status: 500 }
    )
  }
} 