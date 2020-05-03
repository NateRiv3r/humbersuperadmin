import React, { useEffect, useState } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import {
  errorHandler,
  genericChangeSingle,
  getToken
} from "../../utils/helper";
import { Select } from "../../components/select/Select";
import { clientID, ruleTypeMainSort } from "../../utils/data";
import { Button } from "../../components/button/Button";
import { axiosHandler } from "../../utils/axiosHandler";
import { GAME_URL, WINNING_RULE_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";

function NewWinningRule(props) {
  const [winningRuleData, setWinningRuleData] = useState(
    props.activeWinningRule
      ? {
          label: props.activeWinningRule.label,
          type: props.activeWinningRule.type,
          combinationSize: parseFloat(
            props.activeWinningRule.combinationSize || "1"
          )
        }
      : { combinationSize: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    axiosHandler({
      method: "get",
      clientID,
      token: getToken(),
      url: GAME_URL + "?type=NUMBER"
    }).then(
      res => {
        setGameList(res.data._embedded.games);
        setFetching(false);
      },
      err => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err, true)
        });
      }
    );
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    axiosHandler({
      method: props.activeWinningRule ? "put" : "post",
      url:
        WINNING_RULE_URL +
        `${props.activeWinningRule ? `/${props.activeWinningRule.id}` : ""}`,
      data: winningRuleData,
      token: getToken(),
      clientID
    }).then(
      _ => {
        Notification.bubble({
          type: "success",
          content: `Winning rule ${
            props.activeWinningRule ? "updated" : "created"
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

  return (
    <div>
      <br />
      <h3>Create a new rule</h3>
      <br />
      <form onSubmit={onSubmit}>
        {!props.activeWinningRule && (
          <FormGroup
            label="Select Game"
            subLabel="Choose a game you want to create winning rule for"
          >
            <Select
              optionList={formatGameList()}
              required
              name="game"
              onChange={e =>
                genericChangeSingle(e, setWinningRuleData, winningRuleData)
              }
              placeholder={fetching ? "Loading games..." : "--choose a game--"}
            />
          </FormGroup>
        )}
        <FormGroup label="Rule Label">
          <Input
            value={winningRuleData.label || ""}
            required
            name="label"
            onChange={e =>
              genericChangeSingle(e, setWinningRuleData, winningRuleData)
            }
          />
        </FormGroup>
        <div className="grid grid-2 grid-gap-2">
          <FormGroup label="Rule Type">
            <Select
              optionList={ruleTypeMainSort}
              name="type"
              defaultOption={
                props.activeWinningRule
                  ? winningRuleData.type &&
                    winningRuleData.type.toLowerCase() === "ANY_MATCH"
                    ? ruleTypeMainSort[0]
                    : ruleTypeMainSort[1]
                  : null
              }
              onChange={e =>
                genericChangeSingle(e, setWinningRuleData, winningRuleData)
              }
              placeholder="--choose rule type--"
            />
          </FormGroup>
          <FormGroup label="Combination Size">
            {console.log(winningRuleData)}
            <Input
              value={winningRuleData.combinationSize}
              type="number"
              name="combinationSize"
              onChange={e =>
                genericChangeSingle(e, setWinningRuleData, winningRuleData)
              }
            />
          </FormGroup>
        </div>
        <br />
        <Button type="submit" loading={loading} disabled={loading}>
          {props.activeWinningRule ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default NewWinningRule;
