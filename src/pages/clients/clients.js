import React, { useContext, useEffect, useState } from "react";
import "./clients.css";
import { store } from "../../stateManagement/store";
import { setPageTitleAction } from "../../stateManagement/actions";
import qs from "querystring";
import AppIcon from "../../components/icons/Icon";
import {
  errorHandler,
  genericChangeSingle,
  getExtractId,
  getToken
} from "../../utils/helper";
import { Select } from "../../components/select/Select";
import Input from "../../components/input/Input";
import { clientID, gameTypeSort, timeSortOption } from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { CLIENT_FETCH_URL } from "../../utils/urls";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Button } from "../../components/button/Button";
import ContentModal from "../../components/contentModal/contentModal";
import NewClient from "./newClient";
import { Notification } from "../../components/notification/Notification";
import Pagination from "../../components/Pagination/pagination";
import moment from "moment";
import FormGroup from "../../components/formGroup/formGroup";

function Clients(props) {
  const { dispatch } = useContext(store);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalState, setModalState] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});
  const [activeClient, setActiveClient] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    dispatch({ type: setPageTitleAction, payload: "Clients" });
  }, []);

  useEffect(() => {
    let extra = `page=${currentPage}`;
    extra += `&${qs.stringify(queryParams)}`;
    getClients(extra);
  }, [search, queryParams, currentPage]);

  const getClients = (extra = "") => {
    if (!fetching) {
      setFetching(true);
    }
    axiosHandler({
      method: "get",
      clientID,
      token: getToken(),
      url: CLIENT_FETCH_URL + `?${extra}`
    }).then(
      res => {
        setClients(res.data.data);
        // setPageInfo(res.data.page);
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
    getClients();
    setModalShow(false);
  };

  const formatClientList = () => {
    const returnValue = [];
    clients.map(item => {
      returnValue.push([
        item.name,
        `${item.clientId.substring(0, 20)}${item.clientId.length > 20 &&
          "..."}`,
        `${item.secret.substring(0, 20)}${item.secret.length > 20 && "..."}`,
        moment(new Date(item.createdAt)).fromNow(),
        <div>
          <span
            className="link"
            onClick={() => {
              setActiveClient(item);
              setModalState(2);
              setModalShow(true);
            }}
          >
            View info
          </span>
          , &nbsp;
          <span
            className="link"
            onClick={() => {
              setActiveClient(item);
              setModalState(1);
              setModalShow(true);
            }}
          >
            Update client
          </span>
          {/*, &nbsp;*/}
          {/*<span*/}
          {/*  className="link"*/}
          {/*  onClick={() =>*/}
          {/*    props.history.push(*/}
          {/*      `/licenses/${getExtractId(*/}
          {/*        item._links.gameLicenses.href,*/}
          {/*        2*/}
          {/*      )}/client`*/}
          {/*    )*/}
          {/*  }*/}
          {/*>*/}
          {/*  View licenses*/}
          {/*</span>*/}
        </div>
      ]);
      return null;
    });
    return returnValue;
  };

  const tableHeadings = ["Name", "ClientId", "Secret", "Created at", ""];

  const getMeta = metas => {
    const returnValue = [];
    for (let meta in metas) {
      if (metas.hasOwnProperty(meta)) {
        returnValue.push(
          <div className="flex align-center">
            <div className="info">{meta}:</div> &nbsp; &nbsp; &nbsp;
            <div className="context">{metas[meta].toString()}</div>
          </div>
        );
      }
    }
    return returnValue;
  };

  return (
    <div className="clients">
      <br />
      <section className="search-section">
        <div className="flex justify-between">
          <div className="flex align-center flex-1">
            <div className="search-box">
              <Input
                placeholder={"Search clients..."}
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
                setActiveClient(null);
                setModalShow(true);
              }}
            >
              Add Client
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
        values={formatClientList()}
        loading={fetching}
      />
      {/*{!fetching && clients.length > 0 && (*/}
      {/*  <>*/}
      {/*    <br />*/}
      {/*    <Pagination*/}
      {/*      total={pageInfo.totalElements}*/}
      {/*      current={currentPage}*/}
      {/*      onChange={e => setCurrentPage(e)}*/}
      {/*    />*/}
      {/*  </>*/}
      {/*)}*/}
      <ContentModal visible={modalShow} setVisible={setModalShow}>
        {modalState === 1 && (
          <NewClient closeModal={closeModal} activeClient={activeClient} />
        )}
        {modalState === 2 && activeClient && (
          <div className="gameInfo">
            <h4>Client Info</h4>
            <br />
            <FormGroup>
              <div className="info">Client Name</div>
              <div className="context">{activeClient.name}</div>
            </FormGroup>
            <FormGroup>
              <div className="info">ClientId</div>
              <div className="context">{activeClient.clientId}</div>
            </FormGroup>
            <FormGroup>
              <div className="info">Secret</div>
              <div className="context">{activeClient.secret}</div>
            </FormGroup>
            <FormGroup>
              <div className="info">UserId</div>
              <div className="context">{activeClient.userId}</div>
            </FormGroup>
            <FormGroup>
              <div className="info">Created At</div>
              <div className="context">
                {moment(new Date(activeClient.createdAt)).fromNow()}
              </div>
            </FormGroup>
            <FormGroup>
              <div className="info">Last Updated</div>
              <div className="context">
                {moment(new Date(activeClient.updatedAt)).fromNow()}
              </div>
            </FormGroup>
            <br />
            <h4>Other Meta</h4>
            <ul>{getMeta(activeClient.meta)}</ul>
          </div>
        )}
      </ContentModal>
    </div>
  );
}

export default Clients;
