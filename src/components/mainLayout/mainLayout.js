import React, { useContext, useEffect, useState } from "react";
import "./mainlayout.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import { Icon } from "../icons";
import {
  addClass,
  checkExpiration,
  hasClass,
  removeClass,
  updateExpiration
} from "../../utils/helper";
import { store } from "../../stateManagement/store";
import { clientID, secondaryColor, USERTOKEN } from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { Spinner } from "../spinner/Spinner";
import qs from "query-string";
import NotificationDrop from "../notificationDrop/notificationDrop";
import { Notification } from "../notification/Notification";
import { USER_ME_URL } from "../../utils/urls";
import { setUserDetails } from "../../stateManagement/actions";

function MainLayout(props) {
  const {
    dispatch,
    state: { pageTitle }
  } = useContext(store);
  const [loading, setLoading] = useState(true);

  const toggleSlider = () => {
    const el = document.getElementById("sideBar");
    if (hasClass(el, "closed")) {
      removeClass(el, "closed");
    } else {
      addClass(el, "closed");
    }
  };

  const [title, setTitle] = useState(pageTitle);

  useEffect(() => {
    setTitle(pageTitle);
    checkExpiration();
    updateExpiration();
  }, [pageTitle]);

  useEffect(() => {
    // check token
    if (!checkExpiration()) {
      Notification.bubble({
        type: "info",
        content: "You session has expired."
      });
      routeToLogin();
    }
    let token = localStorage.getItem(USERTOKEN);
    // verify token
    if (token) {
      token = JSON.parse(token);
      axiosHandler({
        method: "get",
        url: USER_ME_URL,
        token: token.access,
        clientID
      }).then(
        res => {
          dispatch({ type: setUserDetails, payload: res.data.data });
          setLoading(false);
          props.history.push(
            props.location.pathname + `?${props.location.search}`
          );
        },
        _ => {
          routeToLogin();
        }
      );
    } else {
      routeToLogin();
    }
  }, []);

  const routeToLogin = () => {
    localStorage.clear();
    props.history.push("/login");
  };

  if (loading) {
    return <Spinner size={15} color={secondaryColor} />;
  }

  return (
    <div className="mainLayout">
      <div className="desktop">
        <SideBar />
      </div>
      <div id="sideBar" className="mobile closed">
        <SideBar />
      </div>
      <div id="mainBar" className="mainBar">
        <div className="overlay mobile" onClick={toggleSlider} />
        <div className="contentMain">
          <div className="navBar">
            <div>
              <div className="flex align-center mobile navLeft">
                <Icon
                  name="ic_more_vert"
                  type="md"
                  size={20}
                  className="moreSide"
                  onClick={toggleSlider}
                />
                <img src={logo} className="mobile navLogo" alt="logo" />
              </div>
              <div className="pageTitle desktop">{title}</div>
            </div>
            {/*<div className="navRight">*/}
            {/*  <div className="notifier">*/}
            {/*    <NotificationDrop />*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div className="children">
            {loading ? (
              <div>
                <br />
                <Spinner color={secondaryColor} size={15} />
              </div>
            ) : (
              props.children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;

const SideLinks = ({ icon, title, link, active = false, logout }) => (
  <Link to={link}>
    <div
      className={`sideLink ${active ? "active" : ""} ${logout ? "logout" : ""}`}
    >
      <i className="icon-main">{icon}</i> {title}
    </div>
  </Link>
);

const getActive = val => {
  let ret = false;
  let pathArr = window.location.pathname.split("/");
  if (val === "/") {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      return true;
    }
  }
  if (pathArr.includes(val)) {
    ret = true;
  }
  return ret;
};

const SideBar = () => {
  return (
    <div className="sideBar">
      <img src={logo} className="logo" alt="logo" />
      <div className="sideLinks">
        <SideLinks
          link={"/games"}
          title="Games"
          active={getActive("games")}
          icon={<Icon name="thLarge" type="typicons" />}
        />
        <SideLinks
          link={"/clients"}
          title="Clients"
          active={getActive("clients")}
          icon={<Icon name="user" type="typicons" />}
        />
        <SideLinks
          link={"/licenses"}
          title="Licenses"
          active={getActive("licenses")}
          icon={<Icon name="link" type="typicons" />}
        />
        <SideLinks
          link={"/winning-rules"}
          title="Winning Rules"
          active={getActive("winning-rules")}
          icon={<Icon name="inputCheckedOutline" type="typicons" />}
        />
        <SideLinks
          link={"/logout"}
          logout
          title="Logout"
          icon={<Icon name="out" type="entypo" />}
        />
      </div>
    </div>
  );
};
