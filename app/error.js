'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
} 