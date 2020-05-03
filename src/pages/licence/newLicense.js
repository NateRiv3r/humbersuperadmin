import React, { useEffect, useState } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import {
  errorHandler,
  genericChangeSingle,
  getToken
} from "../../utils/helper";
import { Select } from "../../components/select/Select";
import { clientID } from "../../utils/data";
import { Button } from "../../components/button/Button";
import { axiosHandler } from "../../utils/axiosHandler";
import { CLIENT_FETCH_URL, GAME_LICENSE_URL, GAME_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";
import DatePicker from "../../components/DatePicker/datePicker";
import CurrencyInput from "../../components/currencyInput/currencyInput";

function NewLicense(props) {
  const [licenseData, setLicenseData] = useState(
    props.activeLicense
      ? {
          licenseCount: props.activeLicense.licenseCount,
          licenseCost: props.activeLicense.licenseCost,
          licenseExpiryDate: props.activeLicense.licenseExpiryDate
        }
      : { licenseCount: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [gameList, setGameList] = useState([]);
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    Promise.all([
      axiosHandler({
        method: "get",
        clientID,
        token: getToken(),
        url: GAME_URL
      }),
      axiosHandler({
        method: "get",
        clientID,
        token: getToken(),
        url: CLIENT_FETCH_URL
      })
    ])
      .then(([games, clients]) => {
        setGameList(games.data._embedded.games);
        setClientList(clients.data.data);
        setFetching(false);
      })
      .catch(err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err, true)
        });
      });
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    axiosHandler({
      method: props.activeLicense ? "put" : "post",
      url:
        GAME_LICENSE_URL +
        `${props.activeLicense ? `/${props.activeLicense.id}` : ""}`,
      data: {
        ...licenseData,
        licenseExpiryDate: licenseData.licenseExpiryDate + " 00:00:00"
      },
      token: getToken(),
      clientID
    }).then(
      _ => {
        Notification.bubble({
          type: "success",
          content: `License ${
            props.activeLicense ? "updated" : "created"
          } successfully`
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

  const formatGameList = () => {
    const returnValue = [];
    gameList.map(item => {
      returnValue.push({
        title: item.label,
        value: GAME_URL + `/${item.id}`
      });
      return null;
    });
    return returnValue;
  };

  const formatClientList = () => {
    const returnValue = [];
    clientList.map(item => {
      returnValue.push({
        title: item.name,
        value: item.id
      });
      return null;
    });
    return returnValue;
  };

  return (
    <div>
      <br />
      <h3>Create a new license</h3>
      <br />
      <form onSubmit={onSubmit}>
        {!props.activeLicense && (
          <FormGroup
            label="Select Client"
            subLabel="Select the client to create license for"
          >
            <Select
              optionList={formatClientList()}
              required
              name="clientId"
              onChange={e =>
                genericChangeSingle(e, setLicenseData, licenseData)
              }
              placeholder={
                fetching ? "Loading clients..." : "--choose a client--"
              }
            />
          </FormGroup>
        )}
        {!props.activeLicense && (
          <FormGroup
            label="Select Game"
            subLabel="Choose a game you want to license to the client"
          >
            <Select
              optionList={formatGameList()}
              required
              name="game"
              onChange={e =>
                genericChangeSingle(e, setLicenseData, licenseData)
              }
              placeholder={fetching ? "Loading games..." : "--choose a game--"}
            />
          </FormGroup>
        )}

        <div className="grid grid-2 grid-gap-2">
          <FormGroup label="License Count">
            <Input
              value={licenseData.licenseCount}
              type="number"
              name="licenseCount"
              onChange={e =>
                genericChangeSingle(e, setLicenseData, licenseData)
              }
            />
          </FormGroup>
          <FormGroup label="License Expiry Date">
            <DatePicker
              name="licenseExpiryDate"
              disablePastDate
              translated
              required
              onChange={e =>
                genericChangeSingle(e, setLicenseData, licenseData)
              }
            />
            {props.activeLicense && (
              <span className="info">
                Active Expiry: {props.activeLicense.licenseExpiryDate}
              </span>
            )}
          </FormGroup>
        </div>
        <FormGroup label="License Cost">
          <CurrencyInput
            value={licenseData.licenseCost}
            name="licenseCost"
            onChange={e => {
              genericChangeSingle(e, setLicenseData, licenseData, true);
            }}
          />
        </FormGroup>
        <br />
        <Button type="submit" loading={loading} disabled={loading}>
          {props.activeLicense ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default NewLicense;
