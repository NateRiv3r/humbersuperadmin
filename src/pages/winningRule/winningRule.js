import React, { useContext, useEffect, useState } from "react";
import "./winningRule.css";
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
import {
  clientID,
  gameTypeSort,
  ruleTypeSort,
  timeSortOption
} from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { GAME_BASE_URL, GAME_URL, WINNING_RULE_URL } from "../../utils/urls";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Button } from "../../components/button/Button";
import ContentModal from "../../components/contentModal/contentModal";
import NewWinningRule from "./newWinningRule";
import { Notification } from "../../components/notification/Notification";
import Pagination from "../../components/Pagination/pagination";
import moment from "moment";

function WinningRule(props) {
  const { dispatch } = useContext(store);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalState, setModalState] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});
  const [activeWinningRule, setActiveWinningRule] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [winningRules, setWinningRules] = useState([]);

  useEffect(() => {
    dispatch({ type: setPageTitleAction, payload: "Winning Rules" });
  }, []);

  useEffect(() => {
    let extra = `page=${currentPage - 1}`;
    extra += `&${qs.stringify(queryParams)}`;
    if (props.single) {
      extra += `&id=${props.match.params.uuid}`;
    }
    getWinningRules(extra);
  }, [search, queryParams, currentPage]);

  const getWinningRules = (extra = "") => {
    if (!fetching) {
      setFetching(true);
    }
    let url = WINNING_RULE_URL;
    if (props.single) {
      url = GAME_BASE_URL + `games/${props.match.params.uuid}/winningRules`;
    }
    axiosHandler({
      method: "get",
      clientID,
      token: getToken(),
      url: url + `?${extra}`
    }).then(
      res => {
        setWinningRules(res.data._embedded.winningRules);
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
    getWinningRules();
    setModalShow(false);
  };

  const formatRuleList = () => {
    const returnValue = [];
    winningRules.map(item => {
      returnValue.push([
        item.label,
        item.type,
        item.combinationSize,
        moment(new Date(item.updatedAt)).fromNow(),
        <div>
          <span
            className="link"
            onClick={() =>
              props.history.push(
                `/games/${getExtractId(item._links.game.href, 2)}/winning-rule`
              )
            }
          >
            View Game
          </span>
          , &nbsp;
          <span
            className="link"
            onClick={() => {
              setActiveWinningRule(item);
              setModalState(1);
              setModalShow(true);
            }}
          >
            Update Rule
          </span>
        </div>
      ]);
      return null;
    });
    return returnValue;
  };

  const tableHeadings = ["Label", "Type", "Combination size", "Updated at", ""];

  return (
    <div className="winningRules">
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
                setActiveWinningRule(null);
                setModalShow(true);
              }}
            >
              Add Winning Rule
            </Button>
          </div>
          <div className="filter-box flex ">
            <Select
              optionList={ruleTypeSort}
              placeholder="-- filter by --"
              name="type"
              onChange={e =>
                genericChangeSingle(e, setQueryParams, queryParams)
              }
            />
            <Select
              optionList={timeSortOption}
              placeholder="-- soft by --"
              name="date"
              onChange={e =>
                genericChangeSingle(e, setQueryParams, queryParams)
              }
            />
          </div>
        </div>
      </section>
      <TransactionTable
        keys={tableHeadings}
        values={formatRuleList()}
        loading={fetching}
      />
      {!fetching && winningRules.length > 0 && pageInfo && (
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
          <NewWinningRule
            closeModal={closeModal}
            activeWinningRule={activeWinningRule}
          />
        )}
        {modalState === 2 && activeWinningRule && (
          <GameInfo activeRule={activeWinningRule} />
        )}
      </ContentModal>
    </div>
  );
}

const GameInfo = props => {
  return <div>Game Info</div>;
};

export default WinningRule;
