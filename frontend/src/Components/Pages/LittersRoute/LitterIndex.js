import { useEffect } from "react";
import { Outlet } from "react-router";
import { getUsers } from "../../services/authServices";
import { getLitterApps, getLitters } from "../../services/litterServices";
import { useGlobalState } from "../../utils/stateContext";

const LitterIndex = () => {
  const { store, dispatch } = useGlobalState();
  const { loggedInUser } = store;

  // on component mount and hen loggedInUser or dispatch updates, makes get requests to /litters/, will only make get to /waitlisted and /userlist/ if loggedInUser is admin
  // saves responses to state
  useEffect(() => {
    getLitters()
      .then(reply => {
        dispatch({
          type: "setLitterList",
          data: reply
        });
      })
      .catch(e => console.log(e));
    if (sessionStorage.getItem("user") && loggedInUser.admin === true) {
      getLitterApps()
        .then(apps => {
          dispatch({
            type: "setApplicationForms",
            data: apps
          });
        })
        .catch(e => console.log(e));
      getUsers()
        .then(users => {
          dispatch({
            type: "setUserList",
            data: users
          });
        })
        .catch(e => console.log(e));
    }
  }, [dispatch, loggedInUser]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default LitterIndex;