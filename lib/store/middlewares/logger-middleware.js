import { createListenerMiddleware } from "@reduxjs/toolkit";

export const loggerMiddleware = createListenerMiddleware();

loggerMiddleware.startListening({
  predicate: () => true,
  effect: (action, listenerApi) => {
    console.log("Action:", action.type, action.payload);
  },
}); 