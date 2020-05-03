import {
  reloadApplication,
  setGameType,
  setGlobalLoader,
  setOrderSummary,
  setRoles,
  setUserDetails
} from "../actions";

export const userDetailsState = {
  userDetails: {}
};

export const gameTypeState = {
  gameType: null
};

export const rolesState = {
  roles: []
};
export const reloadApplicationState = {
  reloadApplicationStatus: false
};
export const orderSummaryState = {
  orderSummaryMain: {
    status: false,
    data: null
  }
};
export const globalLoaderState = {
  globalLoader: {
    status: false,
    content: ""
  }
};

export const userDetailReducer = (state, action) => {
  if (action.type === setUserDetails) {
    return {
      ...state,
      userDetails: action.payload
    };
  } else {
    return state;
  }
};

export const userRolesReducer = (state, action) => {
  if (action.type === setRoles) {
    return {
      ...state,
      roles: action.payload
    };
  } else {
    return state;
  }
};

export const gameTypeReducer = (state, action) => {
  if (action.type === setGameType) {
    return {
      ...state,
      gameType: action.payload
    };
  } else {
    return state;
  }
};

export const reloadApplicationReducer = (state, action) => {
  if (action.type === reloadApplication) {
    return {
      ...state,
      reloadApplicationStatus: action.payload
    };
  } else {
    return state;
  }
};

export const globalLoaderReducer = (state, action) => {
  if (action.type === setGlobalLoader) {
    return {
      ...state,
      globalLoader: action.payload
    };
  } else {
    return state;
  }
};

export const orderSummaryReducer = (state, action) => {
  if (action.type === setOrderSummary) {
    return {
      ...state,
      orderSummaryMain: action.payload
    };
  } else {
    return state;
  }
};
