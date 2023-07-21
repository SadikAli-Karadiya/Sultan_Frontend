import React, { createContext } from "react";


export const PhoneContext = createContext();

//--------------------- CONSTANTS ----------------
const LOGOUT = "LOGOUT";
const LOGIN = "LOGIN";
const SET_USER = "SET_USER";
const REMOVE_USER = "REMOVE_USER";

//--------------------- REDUCERS ----------------

//  admin reducer for handling token
function tokenReducer(state, action) {
  if (action.type === LOGOUT) {
    return (state = action.payload);
  }
  if (action.type === LOGIN) {
    return (state = action.payload);
  }

  return state;
}

// user reducer for handling user data
function userReducer(state, action) {
  if (action.type === SET_USER) {
    return (state = action.payload);
  }
  else if (action.type === REMOVE_USER) {
    return (state = action.payload);
  }
}

//--------------------- CONTEXT PROVIDER ----------------

export function PhoneProvider({ children }) {
  const [token, dispatchToken] = React.useReducer(tokenReducer, localStorage.getItem('token'));
  const [user, dispatchUser] = React.useReducer(userReducer, null);

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatchToken({ type: LOGOUT, payload: false });
    dispatchUser({ type: REMOVE_USER, payload: null });
  }, []);

  const login = React.useCallback((token) => {
    dispatchToken({ type: LOGIN, payload: token });
  }, []);

  const setUser = React.useCallback((user) => {
    dispatchUser({ type: SET_USER, payload: user });
  }, []);


  const value = {
    token,
    user,
    logout,
    login,
    setUser
  };

  return (
    <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
  );
}
