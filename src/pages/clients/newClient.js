import React, { useEffect, useState } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import {
  errorHandler,
  genericChangeMulti,
  genericChangeSingle,
  getToken
} from "../../utils/helper";
import { clientID, countryCode } from "../../utils/data";
import { Button } from "../../components/button/Button";
import { axiosHandler } from "../../utils/axiosHandler";
import { CLIENT_CREATE_URL, ROLES_URL, USER_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";
import SelectInput from "../../components/selectInput/selectInput";

function NewClient(props) {
  const [clientData, setClientData] = useState({
    name: props.activeClient ? props.activeClient.name : ""
  });
  const [userData, setUserData] = useState({
    password: "password"
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    if (props.activeClient) {
      clientData.id = props.activeClient.id;
    }
    axiosHandler({
      method: "post",
      url: CLIENT_CREATE_URL,
      data: clientData,
      token: getToken(),
      clientID
    })
      .then(res => {
        userData.phoneNumber = userData.country_code + userData.phoneNumber;
        delete userData.country_code;
        axiosHandler({
          method: "post",
          url: USER_URL,
          token: getToken(),
          clientID: res.data.data.clientId,
          data: userData
        }).then(res => {
          Notification.bubble({
            type: "success",
            content: "Client created successfully"
          });
          props.closeModal();
        });
      })
      .catch(err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    axiosHandler({
      method: "get",
      url: ROLES_URL,
      token: getToken(),
      clientID
    }).then(res => {
      setUserData({
        ...userData,
        roleId: res.data.data.filter(
          item => item.name.toLowerCase() === "admin"
        )[0].id
      });
      setFetching(false);
    });
  }, []);

  if (fetching) {
    return (
      <h3>
        <i>Fetching user roles...</i>
      </h3>
    );
  }

  return (
    <div>
      <br />
      <h3>Create a new client</h3>
      <br />
      <form onSubmit={onSubmit}>
        <div>
          <FormGroup label="Client Name">
            <Input
              value={clientData.name || ""}
              required
              name="name"
              placeholder="Enter client name"
              onChange={e => genericChangeSingle(e, setClientData, clientData)}
            />
          </FormGroup>
          <h3>Add an Admin</h3>
          <FormGroup label="Name">
            <Input
              value={userData.name || ""}
              required
              name="name"
              placeholder="Enter admin name"
              onChange={e => genericChangeSingle(e, setUserData, userData)}
            />
          </FormGroup>
          <FormGroup label="Email">
            <Input
              value={userData.email || ""}
              required
              name="email"
              type="email"
              placeholder="Enter admin email"
              onChange={e => genericChangeSingle(e, setUserData, userData)}
            />
          </FormGroup>
          <FormGroup label="Phone">
            <SelectInput
              defaultOption={{
                title: "+234",
                value: "234"
              }}
              selectPosition="left"
              minWidth={90}
              optionList={countryCode}
              selectName="country_code"
              onChange={e => genericChangeMulti(e, setUserData, userData)}
              placeholder="Enter phone number"
              name="phoneNumber"
              isCurrency={false}
              required
              type="number"
              value={""}
            />
          </FormGroup>
        </div>
        <br />
        <Button type="submit" loading={loading} disabled={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default NewClient;
