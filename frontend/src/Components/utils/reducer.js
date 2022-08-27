export const init = (initialState) => {
  return { ...initialState };
};

// reducer with honestly a large amount of non needed cases

export const reducer = (state, action) => {
  switch (action.type) {
    case "cleanState": {
      return init(action.payload);
    }
    case "setDogList": {
      return {
        ...state,
        dogList: action.data
      };
    }
    case "setLitterList": {
      // updates the litterList value
      //sessionStorage.setItem("litterList", JSON.stringify(action.data));
      return {
        ...state,
        litterList: action.data
      };
    }
    case "setUserList": {
      // updates the userList value
      //sessionStorage.setItem("userList", JSON.stringify(action.data));
      return {
        ...state,
        userList: action.data
      };
    }
    case "setLoggedInUser": {
      //updates the loggedInUser value
      return {
        ...state,
        loggedInUser: action.data
      };
    }
    case "signOutUser": {
      return init({
        ...action.payload,
        loggedInUser: [],
        token: null
      });
    }
    case "setToken": {
      //updates the token value
      return {
        ...state,
        token: action.data
      };
    }
    case "setApplicationForms": {
      return {
        ...state,
        applicationForms: action.data
      };
    }
    case "updateLitterList": {
      //sessionStorage.setItem("litterList", JSON.stringify(action.data));
      return {
        ...state,
        litterList: action.data
      };
    }
    case "updateSpecificLitter": {
      const litterList = [...state.litterList].map(litter => [action.data].find(target => target.id === litter.id) || litter);
      return {
        ...state,
        litterList: litterList
      };
    }
    case "updateLitterApplications": {
      return {
        ...state,
        applicationForms: action.data
      };
    }
    case "mergeLitterWithBreederSireAndBitch": {
      // merges litter with referanances breeder, sire and bitch ids
      return {
        ...state,
        mergedLitterList: action.data
      };
    }
    case "updateValidBreeders": {
      // fills list of valid breeders
      return {
        ...state,
        breeders: action.data
      };
    }
    case "updateValidSires": {
      // fills list of valid sires
      return {
        ...state,
        sires: action.data
      };
    }
    case "updateValidBitches": {
      // fills list of valid bitches
      return {
        ...state,
        bitches: action.data
      };
    }
    case "setUpdatingApp": {
      return {
        ...state,
        updatingApp: action.data
      };
    }
    default: {
      return state;
    }
  }
};