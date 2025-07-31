import { NextResponse } from 'next/server'
import { deleteExpense } from '../../../../lib/db'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const expenseId = parseInt(id)
    
    if (isNaN(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      )
    }
    
    const result = deleteExpense(expenseId)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Expense deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
} 