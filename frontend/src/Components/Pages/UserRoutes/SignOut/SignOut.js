import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGlobalState } from "../../../utils/stateContext";

const SignOut = () => {
  const { initialState, dispatch } = useGlobalState();
  const navigate = useNavigate();

  // on component mounts clears session storage and state before reditecting back to root with alert
  useEffect(() => {
    sessionStorage.clear();
    dispatch({
      type: "signOutUser",
      payload: initialState
    });
    navigate("/", { state: { alert: true, location: "/", severity: "success", title: "Signed Out", body: "Successfully Signed Out" } });
  }, [dispatch, navigate, initialState]);

  return (
    <>

    </>
  );
};

export default SignOut;