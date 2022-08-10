import { ActionTypes } from "@mui/base";

export const init = (initialState) => {
  return { ...initialState };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "cleanState": {
      return init();
    }
    case "setDogList": {
      // updates the dogList value
      sessionStorage.setItem("dogList", JSON.stringify(action.data));
      return {
        ...state,
        dogList: action.data
      };
    }
    case "setFilledForms": {
      // updates the contactFormList value
      sessionStorage.setItem("filledContactForms", JSON.stringify(action.data));
      return {
        ...state,
        contactFormList: action.data
      };
    }
    case "setLitterList": {
      // updates the litterList value
      sessionStorage.setItem("litterList", JSON.stringify(action.data));
      return {
        ...state,
        litterList: action.data
      };
    }
    case "setUserList": {
      // updates the userList value
      sessionStorage.setItem("userList", JSON.stringify(action.data));
      return {
        ...state,
        userList: action.data
      };
    }
    case "setLoggedInUser": {
      //updates the loggedInUser value
      console.log(action.data);
      return {
        ...state,
        loggedInUser: action.data
      };
    }
    case "setToken": {
      //updates the token value
      return {
        ...state,
        token: action.data
      };
    }
    case "setContactForm": {
      console.log(action.data);
      return {
        ...state,
        contactForm: action.data
      };
    }
    case "setApplicationForms": {
      return {
        ...state,
        applicationForms: action.data
      };
    }
    case "updateContactForm": {
      console.log(action.data);
      return {
        ...state,
        contactForm: action.data
      };
    }
    case "updateDogList": {
      return {
        ...state,
        dogList: action.data
      };
    }
    default: {
      return state;
    }
  }
};