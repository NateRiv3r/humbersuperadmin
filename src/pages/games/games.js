import React, { useContext, useEffect, useState } from "react";
import "./games.css";
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
import { GAME_BASE_URL, GAME_LICENSE_URL, GAME_URL } from "../../utils/urls";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Button } from "../../components/button/Button";
import ContentModal from "../../components/contentModal/contentModal";
import NewGame from "./newGame";
import { Notification } from "../../components/notification/Notification";
import Pagination from "../../components/Pagination/pagination";
import moment from "moment";

function Games(props) {
  const { dispatch } = useContext(store);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalState, setModalState] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});
  const [activeGame, setActiveGame] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    dispatch({ type: setPageTitleAction, payload: "Games" });
  }, []);

  useEffect(() => {
    let extra = `page=${currentPage - 1}`;
    extra += `&${qs.stringify(queryParams)}`;
    getGames(extra);
  }, [search, queryParams, currentPage]);

  const getGames = (extra = "") => {
    if (!fetching) {
      setFetching(true);
    }

    let url = GAME_URL;
    if (props.single) {
      if (props.license) {
        url = GAME_BASE_URL + `gameLicenses/${props.match.params.uuid}/game`;
      } else if (props.winning) {
        url = GAME_BASE_URL + `winningRules/${props.match.params.uuid}/game`;
      }
    }

    axiosHandler({
      method: "get",
      clientID,
      token: getToken(),
      url: url + `?${extra}`
    }).then(
      res => {
        if (props.single) {
          setGames([res.data]);
        } else {
          setGames(res.data._embedded.games);
        }

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
    getGames();
    setModalShow(false);
  };

  const formatGameList = () => {
    const returnValue = [];
    games.map(item => {
      returnValue.push([
        item.label,
        item.type,
        item.mode,
        moment(new Date(item.updatedAt)).fromNow(),
        <div>
          <span
            className="link"
            onClick={() => {
              setActiveGame(item);
              setModalState(2);
              setModalShow(true);
            }}
          >
            View configs
          </span>
          , &nbsp;
          <span
            className="link"
            onClick={() => {
              setActiveGame(item);
              setModalState(1);
              setModalShow(true);
            }}
          >
            Update game
          </span>
          , &nbsp;
          <span
            className="link"
            onClick={() =>
              props.history.push(
                `/licenses/${getExtractId(
                  item._links.gameLicenses.href,
                  2
                )}/game`
              )
            }
          >
            View licenses
          </span>
          , &nbsp;
          <span
            onClick={() =>
              props.history.push(
                `/winning-rules/${getExtractId(
                  item._links.winningRules.href,
                  2
                )}`
              )
            }
            className="link"
          >
            View winning rules
          </span>
        </div>
      ]);
      return null;
    });
    return returnValue;
  };

  const tableHeadings = ["Label", "Type", "Mode", "Updated at", ""];

  return (
    <div className="games">
      <br />
      <section className="search-section">
        <div className="flex justify-between">
          <div className="flex align-center flex-1">
            <div className="search-box">
              <Input
                placeholder={"Search games..."}
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
                setActiveGame(null);
                setModalShow(true);
              }}
            >
              Add Game
            </Button>
          </div>
          <div className="filter-box flex ">
            <Select
              optionList={gameTypeSort}
              placeholder="-- filter by --"
              name="mode"
              onChange={e => {
                let data = {
                  mode: e.target.value,
                  type: null
                };
                if (
                  e.target.value === "NUMBER" ||
                  e.target.value === "RAFFLE"
                ) {
                  data = {
                    type: e.target.value,
                    mode: null
                  };
                } else if (!e.target.value) {
                  data = {
                    type: null,
                    mode: null
                  };
                }
                setQueryParams({ ...queryParams, ...data });
              }}
            />
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
        values={formatGameList()}
        loading={fetching}
      />
      {!fetching && games.length > 0 && pageInfo && (
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
          <NewGame closeModal={closeModal} activeGame={activeGame} />
        )}
        {modalState === 2 && activeGame && (
          <div className="gameInfo">
            <h3>{activeGame.label}</h3>
            <br />
            <h4>Game Configs</h4>
            <ul>
              {activeGame.requiredGameConfig.map((item, id) => (
                <li key={id}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </ContentModal>
    </div>
  );
}

export default Games;
