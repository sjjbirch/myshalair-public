import { useEffect } from "react";
import { Outlet } from "react-router";
import { getLitters } from "../../services/litterServices";
import { useGlobalState } from "../../utils/stateContext";

const DogIndex = () => {
  const { dispatch } = useGlobalState();

  // on component mount and when dispatch updates makes get to back for litterList and saves to global State
  useEffect(() => {
    getLitters()
      .then(reply => {
        dispatch({
          type: "setLitterList",
          data: reply
        });
      })
      .catch(e => console.log(e));
  }, [dispatch]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default DogIndex;