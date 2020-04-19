import React, { useEffect, useState } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import {
  errorHandler,
  genericChangeSingle,
  getToken
} from "../../utils/helper";
import { Select } from "../../components/select/Select";
import {
  clientID,
  gameModeSort,
  gameTypeMainSort,
  secondaryColor
} from "../../utils/data";
import { Button } from "../../components/button/Button";
import AppIcon from "../../components/icons/Icon";
import { axiosHandler } from "../../utils/axiosHandler";
import { GAME_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";

function NewGame(props) {
  const [gameData, setGameData] = useState(
    props.activeGame
      ? {
          label: props.activeGame.label,
          type: props.activeGame.type,
          mode: props.activeGame.mode
        }
      : {}
  );
  const [gameConfigs, setGameConfigs] = useState(
    props.activeGame
      ? props.activeGame.requiredGameConfig
      : ["combo_size", "range_min", "range_max"]
  );
  const [loading, setLoading] = useState(false);

  const changeConfig = (e, index) => {
    setGameConfigs(
      gameConfigs.map((item, id) => {
        if (id === index) {
          return e.target.value;
        }
        return item;
      })
    );
  };

  const removeConfig = index => {
    setGameConfigs(gameConfigs.filter((_, id) => id !== index));
  };

  const onSubmit = e => {
    e.preventDefault();
    const data = { ...gameData, requiredGameConfig: gameConfigs };
    setLoading(true);
    axiosHandler({
      method: props.activeGame ? "put" : "post",
      url: GAME_URL + `${props.activeGame ? `/${props.activeGame.id}` : ""}`,
      data,
      token: getToken(),
      clientID
    }).then(
      _ => {
        Notification.bubble({
          type: "success",
          content: `Game ${
            props.activeGame ? "updated" : "created"
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

  const getGameConfigs = () => {
    const itemList = [];
    for (let i = 0; i < gameConfigs.length - 1; i++) {
      itemList.push(
        <div key={i} className="flex align-center justify-between configs">
          <div>{gameConfigs[i]}</div>
          <div onClick={() => removeConfig(i)}>
            <AppIcon
              name="x"
              type="feather"
              style={{ color: secondaryColor }}
            />{" "}
          </div>
        </div>
      );
    }
    return itemList;
  };
  return (
    <div>
      <br />
      <h3>Create a new game</h3>
      <br />
      <form onSubmit={onSubmit}>
        <div>
          <FormGroup label="Game Label">
            <Input
              value={gameData.label || ""}
              required
              name="label"
              onChange={e => genericChangeSingle(e, setGameData, gameData)}
            />
          </FormGroup>
          <div className="grid grid-2 grid-gap-2">
            <FormGroup label="Game Type">
              <Select
                optionList={gameTypeMainSort}
                name="type"
                defaultOption={
                  props.activeGame
                    ? gameData.type && gameData.type.toLowerCase() === "number"
                      ? gameTypeMainSort[0]
                      : gameTypeMainSort[1]
                    : null
                }
                onChange={e => genericChangeSingle(e, setGameData, gameData)}
                placeholder="--choose game type--"
              />
            </FormGroup>
            <FormGroup label="Game Mode">
              <Select
                optionList={gameModeSort}
                name="mode"
                defaultOption={
                  props.activeGame
                    ? gameData.mode && gameData.mode.toLowerCase() === "instant"
                      ? gameModeSort[0]
                      : gameModeSort[1]
                    : null
                }
                onChange={e => genericChangeSingle(e, setGameData, gameData)}
                placeholder="--choose game mode--"
              />
            </FormGroup>
          </div>
        </div>
        <div>
          <br />
          <h4>Set required game config</h4>
          <br />
          {gameConfigs.length > 1 && getGameConfigs()}
          <br />
          <FormGroup label="Config name">
            <Input
              value={gameConfigs[gameConfigs.length - 1]}
              onChange={e => changeConfig(e, gameConfigs.length - 1)}
            />
          </FormGroup>
          <div className="flex justify-end">
            <div
              className="link"
              onClick={() => setGameConfigs([...gameConfigs, ""])}
            >
              Add more
            </div>
          </div>
        </div>
        <br />
        <Button type="submit" loading={loading} disabled={loading}>
          {props.activeGame ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default NewGame;
