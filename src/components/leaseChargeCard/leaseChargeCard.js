import React, { useContext, useState } from "react";
import { Button } from "../button/Button";

import "./leaseChargeCard.css";
import { getNoImage } from "../../utils/data";
import { getPropertyOwner } from "../leaseCards/leaseListCard";
import AppIcon from "../icons/Icon";
import { Accordion } from "../accordion/Accordion";
import TransactionTable from "../transactionTable/transactionTable";
import moment from "moment";
import { getToken, numberWithCommas } from "../../utils/helper";
import { axiosHandler } from "../../utils/axiosHandler";
import { GENERATE_INVOICE_URL } from "../../utils/urls";
import { Notification } from "../notification/Notification";
import { store } from "../../stateManagement/store";
import { setOrderSummary } from "../../stateManagement/actions";

export default function LeaseChargeCard(props) {
  const [preview, setPreview] = useState(false);
  const [paySubmit, setPaySubmit] = useState(false);
  const { dispatch } = useContext(store);

  const {
    lease: {
      application: { unit, user }
    }
  } = props.leaseCharge;

  const formatDate = dateData => {
    let newDate = new Date(dateData);
    return moment(newDate).format("DD MMMM, YYYY");
  };

  const payNow = lease_id => {
    setPaySubmit(true);
    axiosHandler(
      "get",
      GENERATE_INVOICE_URL + `lease/${lease_id}`,
      getToken()
    ).then(
      res => {
        dispatch({
          type: setOrderSummary,
          payload: {
            status: true,
            data: res.data.results
          }
        });
        setPaySubmit(false);
      },
      err => {
        Notification.bubble({
          type: "error",
          content: "Ops!, an error occurred"
        });
        setPaySubmit(false);
      }
    );
  };

  const getFeeTableData = data => {
    const returnVal = [];
    data.map(item => {
      returnVal.push([
        item.fee_title,
        `${item.currency_type}${numberWithCommas(item.amount)}`
      ]);
      return null;
    });
    return returnVal;
  };

  return (
    <>
      <div className="flex column justify-between lease-charge-card">
        <div className="flex justify-between actions details">
          <div className="top">
            <h3>Payments for {`${unit.title}, ${unit.property.title}`}</h3>
            <p>Due Date: {formatDate(props.leaseCharge.due_date)}</p>
          </div>
          <div className="money">
            {`${props.leaseCharge.total_fee_currency}${numberWithCommas(
              props.leaseCharge.total_fee
            )}`}{" "}
            &nbsp;
            <span onClick={() => setPreview(!preview)}>
              <AppIcon name="ic_arrow_drop_down" type="md" />
            </span>
          </div>
        </div>
        <Accordion active={preview}>
          <div className="charge-breakdown">
            <br />
            <TransactionTable
              keys={["Description", "Amount"]}
              values={getFeeTableData(props.leaseCharge.fee_breakdown)}
            />
            <br />
          </div>
        </Accordion>
        <div className="flex justify-between align-center details actions ">
          <div className="bottom">
            <div className="flex justify-between party-detail">
              <div className="tenant-con">
                <div
                  className="img-con"
                  style={{
                    backgroundImage: `url("${
                      user.user_profile
                        ? user.user_profile.profile_picture.file
                        : getNoImage()
                    }")`
                  }}
                />
                <div className="content">
                  <h4>{`${user.first_name} ${user.last_name}`}</h4>
                  <p>{`${user.email}`}</p>
                  <div className="tag">
                    {unit.category === "rental" ? "Tenant" : "Buyer"}
                  </div>
                </div>
              </div>
              <div className="landlord-con">
                <div className="content">
                  <h4>{`${getPropertyOwner(unit).first_name} ${
                    getPropertyOwner(unit).last_name
                  }`}</h4>
                  <p>{`${getPropertyOwner(unit).email}`}</p>
                  <div className="tag">
                    <div className="tag">
                      {unit.category === "rental" ? "Landlord" : "Seller"}
                    </div>
                  </div>
                </div>
                <div
                  className="img-con"
                  style={{
                    backgroundImage: `url("${
                      getPropertyOwner(unit).profile_picture
                    }")`
                  }}
                />
              </div>
            </div>
          </div>
          <Button
            color={props.leaseCharge.status === "paid" ? "success" : "primary"}
            disabled={paySubmit || props.leaseCharge.status === "paid"}
            loading={paySubmit}
            onClick={() => {
              if (props.leaseCharge.status === "paid") return;
              payNow(props.leaseCharge.id);
            }}
          >
            {props.leaseCharge.status === "paid" ? "PAID" : "PAY"}
          </Button>
        </div>
      </div>
    </>
  );
}
