import React, { useEffect, useState } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import {
  errorHandler,
  genericChangeSingle,
  getToken
} from "../../utils/helper";
import { clientID } from "../../utils/data";
import { Button } from "../../components/button/Button";
import { axiosHandler } from "../../utils/axiosHandler";
import { CLIENT_CREATE_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";

function NewClient(props) {
  const [clientData, setClientData] = useState({
    name: props.activeClient ? props.activeClient.name : ""
  });
  const [loading, setLoading] = useState(false);

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
    }).then(
      _ => {
        Notification.bubble({
          type: "success",
          content: "Client created successfully"
        });
        props.closeModal();
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
              onChange={e => genericChangeSingle(e, setClientData, clientData)}
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
