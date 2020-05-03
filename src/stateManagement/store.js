import React, { createContext, useReducer } from "react";
import { pageTitleReducer, stateData } from "./reducers/pageTitleReducer";
import {
  propertyPageData,
  propertyPageReducer
} from "./reducers/propertyPageReducer";
import {
  userRolesReducer,
  rolesState,
  userDetailReducer,
  userDetailsState,
  globalLoaderReducer,
  globalLoaderState,
  reloadApplicationReducer,
  reloadApplicationState,
  orderSummaryReducer,
  orderSummaryState,
  gameTypeReducer,
  gameTypeState
} from "./reducers/genericReducer";

const reduceReducers = (...reducers) => (prevState, value, ...args) =>
  reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args),
    prevState
  );

const combinedReducers = reduceReducers(
  pageTitleReducer,
  propertyPageReducer,
  userDetailReducer,
  userRolesReducer,
  globalLoaderReducer,
  reloadApplicationReducer,
  orderSummaryReducer,
  gameTypeReducer
);

const initialState = {
  ...stateData,
  ...propertyPageData,
  ...rolesState,
  ...userDetailsState,
  ...globalLoaderState,
  ...reloadApplicationState,
  ...orderSummaryState,
  ...gameTypeState
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
