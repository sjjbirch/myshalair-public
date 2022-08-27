import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getConfirm } from "../../../services/authServices";

const SignUpConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [confirmation] = useState(location.search);

  // on component mount checks if confirmation is not empty, if true makes get to /users/confirmation appending confirmation at the end of the route.
  useEffect(() => {
    if (confirmation.length !== 0) {
      getConfirm(confirmation)
        .then(reply => {
          // if reply.status === 200 navigates to signin and alerts user
          if (reply.status === 200) {
            navigate('/user/signin', { state: { alert: true, location: '/user/signin', severity: 'success', title: 'Account Confirmed', body: 'Your account has been confirmed and you are able to sign in with it' } });
          }
        })
        .catch(e => {
          console.log(e);
          // else navigates to root and alerts user
          navigate('/', { state: { alert: true, location: '/', severity: 'error', title: 'Unknown Error', body: 'Something went wrong and your account could not be confirmed' } });
        });
    }
  }, [confirmation, navigate]);
};

export default SignUpConfirm;