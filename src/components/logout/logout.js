import React, { useContext, useEffect } from "react";
import { store } from "../../stateManagement/store";
import { setGlobalLoader } from "../../stateManagement/actions";
import { USERTOKEN } from "../../utils/data";

function Logout(props) {
  const { dispatch } = useContext(store);
  useEffect(() => {
    dispatch({
      type: setGlobalLoader,
      payload: {
        content: "Logging out...",
        status: true
      }
    });
    logoutMain();
  }, []);

  const logoutMain = () => {
    localStorage.clear();
    setTimeout(() => {
      dispatch({
        type: setGlobalLoader,
        payload: {
          content: "",
          status: false
        }
      });
      props.history.push("/login");
    }, 1000);
  };

  return <div>Logout</div>;
}

export default Logout;
