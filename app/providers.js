'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../lib/store'
import { ExpensesProvider } from '../lib/context/ExpensesContext'

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ExpensesProvider>
          {children}
        </ExpensesProvider>
      </PersistGate>
    </Provider>
  )
} 