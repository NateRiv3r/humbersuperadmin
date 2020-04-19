import React, { useContext, useEffect, useState } from "react";
import "./license.css";
import { store } from "../../stateManagement/store";
import { setPageTitleAction } from "../../stateManagement/actions";
import qs from "querystring";
import AppIcon from "../../components/icons/Icon";
import {
  errorHandler,
  genericChangeSingle,
  getExtractId,
  getToken,
  numberWithCommas
} from "../../utils/helper";
import { Select } from "../../components/select/Select";
import Input from "../../components/input/Input";
import {
  clientID,
  gameTypeSort,
  momentFullDateFormat,
  timeSortOption
} from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import {
  GAME_BASE_URL,
  GAME_LICENSE_URL,
  GAME_URL,
  WINNING_RULE_URL
} from "../../utils/urls";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Button } from "../../components/button/Button";
import ContentModal from "../../components/contentModal/contentModal";
import NewLicense from "./newLicense";
import { Notification } from "../../components/notification/Notification";
import Pagination from "../../components/Pagination/pagination";
import moment from "moment";

function License(props) {
  const { dispatch } = useContext(store);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalState, setModalState] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});
  const [activeLicense, setActiveLicense] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    dispatch({ type: setPageTitleAction, payload: "Licenses" });
  }, []);

  useEffect(() => {
    let extra = `page=${currentPage - 1}`;
    extra += `&${qs.stringify(queryParams)}`;
    getLicenses(extra);
  }, [search, queryParams, currentPage]);

  const getLicenses = (extra = "") => {
    if (!fetching) {
      setFetching(true);
    }
    let url = GAME_LICENSE_URL;
    if (props.single) {
      if (props.game) {
        url = GAME_BASE_URL + `games/${props.match.params.uuid}/gameLicenses`;
      }
      if (props.client) {
        extra += `&clientId=${props.match.params.uuid}`;
      }
    }
    axiosHandler({
      method: "get",
      clientID,
      token: getToken(),
      url: url + `?${extra}`
    }).then(
      res => {
        setLicenses(res.data._embedded.gameLicenses);
        setPageInfo(res.data.page);
        setFetching(false);
      },
      err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err, true)
        });
      }
    );
  };

  const closeModal = () => {
    getLicenses();
    setModalShow(false);
  };

  const formatLicenseList = () => {
    const returnValue = [];
    licenses.map(item => {
      returnValue.push([
        numberWithCommas(item.licenseCost.toString()),
        item.licenseCount,
        moment(item.licenseExpiryDate, momentFullDateFormat).fromNow(),
        moment(new Date(item.updatedAt)).fromNow(),
        <div>
          <span
            className="link"
            onClick={() =>
              props.history.push(
                `/games/${getExtractId(item._links.game.href, 2)}/license`
              )
            }
          >
            View game
          </span>
          , &nbsp;
          <span
            className="link"
            onClick={() => {
              setActiveLicense(item);
              setModalState(1);
              setModalShow(true);
            }}
          >
            Update license
          </span>
        </div>
      ]);
      return null;
    });
    return returnValue;
  };

  const tableHeadings = [
    "License cost",
    "License count",
    "License Expiration",
    "Updated at",
    ""
  ];

  return (
    <div className="licenses">
      <br />
      <section className="search-section">
        <div className="flex justify-between">
          <div className="flex align-center flex-1">
            <div className="search-box">
              <Input
                placeholder={"Search winning rules..."}
                iconLeft={<AppIcon name="search" type="feather" />}
                debounce={true}
                debounceTimeout={500}
                minLength={3}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setModalState(1);
                setActiveLicense(null);
                setModalShow(true);
              }}
            >
              Add License
            </Button>
          </div>
          <div className="filter-box flex ">
            <Select
              optionList={timeSortOption}
              placeholder="-- soft by --"
              name="sort"
              onChange={e =>
                genericChangeSingle(e, setQueryParams, queryParams)
              }
            />
          </div>
        </div>
      </section>
      <TransactionTable
        keys={tableHeadings}
        values={formatLicenseList()}
        loading={fetching}
      />
      {!fetching && licenses.length > 0 && pageInfo && (
        <>
          <br />
          <Pagination
            total={pageInfo.totalElements}
            current={currentPage}
            onChange={e => setCurrentPage(e)}
          />
        </>
      )}
      <ContentModal visible={modalShow} setVisible={setModalShow}>
        {modalState === 1 && (
          <NewLicense closeModal={closeModal} activeLicense={activeLicense} />
        )}
        {modalState === 2 && activeLicense && (
          <div className="gameInfo">
            <h3>{activeLicense.label}</h3>
            <br />
            <h4>Game Configs</h4>
            <ul>
              {activeLicense.requiredGameConfig.map((item, id) => (
                <li key={id}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </ContentModal>
    </div>
  );
}

export default License;
