import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { setIncomeAction, addExpenseAction, incrementActionPerformed } from 'store/expense/expense-slice'

export const loggerMiddleware = createListenerMiddleware()

loggerMiddleware.startListening({
    matcher: isAnyOf(setIncomeAction, addExpenseAction),
    effect: async (action, listenerAPI) => {
        console.log("Action ", action)
        listenerAPI.dispatch(incrementActionPerformed())
        console.log("New store value ", listenerAPI.getState())
    }
})