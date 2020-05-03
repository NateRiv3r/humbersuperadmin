import React, { useEffect, useState } from "react";
import AppIcon from "../icons/Icon";
import { Select } from "../select/Select";
import proptype from "prop-types";
import "./facilityDoc.css";
import { Notification } from "../notification/Notification";
import { DOCUMENTS_LOOK_UP_URL, FACILITY_LOOK_UP_URL } from "../../utils/urls";
import { axiosHandler } from "../../utils/axiosHandler";
import { errorHandler } from "../../utils/helper";

function FacilityDocument(props) {
  const [tigger, setTrigger] = useState(false);
  const [defaultContent, setDefaultContent] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectTrigger, setSelectTrigger] = useState(false);

  const onSelection = e => {
    let listCheck = contentList.filter(item => {
      let tempItem = item.toLowerCase().replace(/ /g, "");
      let testValue = e.target.value.toLowerCase().replace(/ /g, "");
      if (tempItem === testValue) {
        Notification.bubble({
          type: "info",
          content: `${
            props.type === "document" ? "Document" : "Facility"
          } already exist`
        });
        return item;
      }
      return null;
    });

    if (listCheck.length > 0) {
      setSelectTrigger(true);
      return;
    }

    setContentList([...contentList, e.target.value]);
    setSelectTrigger(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setTrigger(true);
    }, 300);
    let url = FACILITY_LOOK_UP_URL;
    if (props.type === "document") {
      url = DOCUMENTS_LOOK_UP_URL;
    }

    getOptionList(url);
  }, []);

  const formatResult = res => {
    let newList = res.map(item => {
      return {
        title: props.type === "document" ? item.name : item.title,
        value: props.type === "document" ? item.name : item.title
      };
    });

    setOptionList(newList);
  };

  const getOptionList = url => {
    axiosHandler("get", url).then(
      res => {
        formatResult(res.data.results.results);
        setDefaultContent(res.data.results.results);
        if (props.defaultContent) {
          setupDefaultContent(props.defaultContent);
        }
        setFetching(false);
      },
      err => {
        // errorHandler
        Notification.bubble({
          type: "error",
          content: "An error occurred"
        });
      }
    );
  };

  const setupDefaultContent = defaultCon => {
    if (props.type === "facility") {
      const tempContentList = [];
      defaultCon.map(item => {
        tempContentList.push(item.facility.title);
        return null;
      });
      setContentList(tempContentList);
    }
    if (props.type === "document") {
      const tempContentList = [];
      defaultCon.map(item => {
        tempContentList.push(item.name);
        return null;
      });
      setContentList(tempContentList);
    }
  };

  const removeContent = key => {
    const newList = contentList.filter((_, id) => id !== key);
    setContentList(newList);
  };

  const getData = name => {
    let activeList = defaultContent.filter(item => item.title === name);
    return activeList[0];
  };

  useEffect(() => {
    if (props.type === "document") {
      props.onAdd(contentList);
    } else {
      props.onAdd(formatFacilityId());
    }
  }, [contentList]);

  const formatFacilityId = _ => {
    return contentList.map(item => {
      return getData(item).id;
    });
  };

  const loaderText =
    props.type === "facility"
      ? "Loading facilities..."
      : "Loading documents...";
  const loadedText =
    props.type === "facility"
      ? "Search Facility (e.g Balcony...)"
      : "Search Documents (e.g Governor’s consent...)";

  return (
    <div className="falDocContainer">
      <div className="facility-con">
        <Select
          placeholder={`${fetching ? loaderText : loadedText}`}
          optionList={optionList}
          name={props.type === "document" ? "documents" : "facilities"}
          onChange={onSelection}
          triggerPosition={tigger}
          triggerReset={() => setTrigger(false)}
          selectTrigger={selectTrigger}
          selectTriggerReset={() => setSelectTrigger(false)}
          icon={<AppIcon name="search" type="feather" />}
        />
      </div>

      {contentList.length > 0 &&
        (props.type === "document" ? (
          <div className="docsList">
            {contentList.map((item, key) => {
              return (
                <DocumentCard
                  onRemove={() => removeContent(key)}
                  name={item}
                  key={key}
                />
              );
            })}
          </div>
        ) : (
          <div className="docsList">
            {contentList.map((item, key) => {
              return (
                <FacilityCard
                  onRemove={() => removeContent(key)}
                  name={item}
                  data={getData(item)}
                  key={key}
                />
              );
            })}
          </div>
        ))}
    </div>
  );
}

FacilityDocument.propTypes = {
  onAdd: proptype.func.isRequired,
  type: proptype.oneOf(["document", "facility"])
};

FacilityDocument.defaultProps = {
  type: "document",
  onAdd: () => null
};

const DocumentCard = ({ name, onRemove }) => {
  return (
    <div className="docCard">
      {" "}
      <div className="close" onClick={onRemove}>
        <AppIcon name="withCross" type="entypo" />
      </div>{" "}
      {name}
    </div>
  );
};

const FacilityCard = ({ name, onRemove, data }) => {
  return (
    <div className="facilityCard">
      {" "}
      <div className="close" onClick={onRemove}>
        <AppIcon name="withCross" type="entypo" />
      </div>{" "}
      <div
        className="img-con"
        style={{ backgroundImage: `url("${data.image.file}")` }}
      />
      {name}
    </div>
  );
};

export default FacilityDocument;
