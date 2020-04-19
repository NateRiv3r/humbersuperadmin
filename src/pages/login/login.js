import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import logo from "../../assets/images/logo.jpg";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import {
  errorHandler,
  genericChangeSingle,
  updateExpiration
} from "../../utils/helper";
import { Notification } from "../../components/notification/Notification";
import { clientID, USERTOKEN } from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { LOGIN_URL } from "../../utils/urls";
import { store } from "../../stateManagement/store";
import { setUserDetails } from "../../stateManagement/actions";

function Login(props) {
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(store);

  useEffect(() => {
    if (localStorage.getItem(USERTOKEN)) {
      props.history.push("/");
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
      clientID
    }).then(
      res => {
        login(res.data.data);
      },
      err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        });
        setLoading(false);
      }
    );
  };

  const login = data => {
    let token = {
      access: data.token,
      refresh: data.refresh
    };
    let userDetails = data.user;
    updateExpiration();
    localStorage.setItem(USERTOKEN, JSON.stringify(token));
    dispatch({ type: setUserDetails, payload: userDetails });
    props.history.push("/");
  };

  return (
    <div className="login">
      <form action="" onSubmit={onSubmit}>
        <center>
          {" "}
          <img src={logo} alt="" />
          <h3>Sign In</h3>
        </center>

        <FormGroup label="Email">
          <Input
            placeholder={"Enter your email"}
            value={loginData.email || ""}
            required
            name="email"
            onChange={e => genericChangeSingle(e, setLoginData, loginData)}
          />
        </FormGroup>
        <FormGroup label="Password">
          <Input
            placeholder={"Enter your password"}
            value={loginData.password || ""}
            required
            name="password"
            type="password"
            onChange={e => genericChangeSingle(e, setLoginData, loginData)}
          />
        </FormGroup>
        <br />
        <Button loading={loading} disabled={loading} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
