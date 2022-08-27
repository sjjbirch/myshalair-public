import { createContext, useContext, useReducer } from "react";
import { reducer, init } from './componentIndex';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// creates custom context for use of accessing global state, is also used to provide adapter settings for MUI date picker

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  // sets the inital state of the application
  const initialState = {
    dogList: [],
    litterList: [],
    loggedInUser: JSON.parse(sessionStorage.getItem("user")) || [],
    token: sessionStorage.getItem("token") || null,
    userList: [],
    mergedLitterList: {},
    breeders: {},
    sires: {},
    bitches: {},
    applicationForms: [],
  };

  // uses reducer to globalise state.
  const [store, dispatch] = useReducer(reducer, initialState, init);

  return (
    <>
      {/* provides date and time framework for use in date pickers provided by material ui. The framework chosen is Moment.js */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StateContext.Provider value={{ store, dispatch, initialState }}>
          {children}
        </StateContext.Provider>
      </LocalizationProvider>
    </>
  );
};


export const useGlobalState = () => useContext(StateContext);