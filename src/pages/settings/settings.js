import React, { useContext, useEffect, useState } from "react";
import "./settings.css";
import { store } from "../../stateManagement/store";
import { setPageTitleAction } from "../../stateManagement/actions";
import { Card } from "../../components/card/Card";
import Input from "../../components/input/Input";
import { genericChangeMulti, genericChangeSingle } from "../../utils/helper";
import FormGroup from "../../components/formGroup/formGroup";
import { countryCode } from "../../utils/data";
import SelectInput from "../../components/selectInput/selectInput";
import { Button } from "../../components/button/Button";
import { Notification } from "../../components/notification/Notification";

function Settings(props) {
  const { dispatch } = useContext(store);
  const [profileData, setProfileData] = useState({
    compName: "Access Bank PLC",
    compEmail: "info@accessbank.com",
    phone_number: 6777867867
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      Notification.bubble({
        type: "success",
        content: "Updated successfully"
      });
      setLoading(false);
      props.setVisible(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch({
      type: setPageTitleAction,
      payload: `Settings`
    });
  }, []);
  return (
    <div className="settings">
      <br />
      <Card heading="Profile">
        <form className="contentCard" onSubmit={onSubmit}>
          <div className="grid grid-2 grid-gap-2">
            <FormGroup label="Company Name">
              <Input
                value={profileData.compName}
                name="compName"
                onChange={e =>
                  genericChangeSingle(e, setProfileData, profileData)
                }
              />
            </FormGroup>
            <div className="flex align-center">
              <div
                className="image-circle"
                style={{
                  backgroundImage: `url("https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241__340.jpg")`
                }}
              />
              &nbsp;
              <div className="link">Change logo</div>
            </div>
          </div>
          <br />
          <div className="grid grid-2 grid-gap-2">
            <FormGroup label="Company Email">
              <Input
                value={profileData.compEmail}
                name="compEmail"
                onChange={e =>
                  genericChangeSingle(e, setProfileData, profileData)
                }
              />
            </FormGroup>

            <FormGroup label="Company Email">
              <SelectInput
                defaultOption={{
                  title: "+234",
                  value: "+234"
                }}
                selectPosition="left"
                minWidth={90}
                optionList={countryCode}
                selectName="country_code"
                onChange={e =>
                  genericChangeMulti(e, setProfileData, profileData)
                }
                name="phone_number"
                isCurrency={false}
                required
                type="number"
                value={profileData.phone_number || ""}
              />
            </FormGroup>
          </div>
          <br />
          <Button type="submit" loading={loading} disabled={loading}>
            Update
          </Button>
        </form>
      </Card>
      <br />
      <br />
      <Card heading="API Keys">
        <div className="contentCard">
          <div>
            <span className="info">Public Key:&nbsp;&nbsp;&nbsp;&nbsp; </span>
            <span className="context">jsdkj8934832893u.32io3oms-32823823</span>
          </div>
          <br />
          <div>
            <span className="info">Secret Key:&nbsp;&nbsp;&nbsp;&nbsp; </span>
            <span className="context">jsdkj8934832893u.32io3oms-32823823</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
