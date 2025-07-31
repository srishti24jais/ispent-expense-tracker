import { NextResponse } from 'next/server'
import { getUserSettings, updateUserSettings } from '../../../lib/db'

export async function GET() {
  try {
    const settings = getUserSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { income, budget } = body
    
    updateUserSettings(income, budget)
    
    return NextResponse.json({ 
      success: true, 
      settings: { income, budget }
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 