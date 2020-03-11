import React, { useContext, useEffect, useState } from "react";
import "./mainlayout.css";
import { Button } from "../button/Button";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Icon } from "../icons";
import { addClass, getToken, hasClass, removeClass } from "../../utils/helper";
import { store } from "../../stateManagement/store";
import {
  loginUrl,
  secondaryColor,
  USERDETAILS,
  USERROLE,
  USERTOKEN
} from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { GET_ACCESS_TOKEN, USER_ME, USER_ROLE } from "../../utils/urls";
import { Spinner } from "../spinner/Spinner";
import qs from "query-string";
import { useCookies } from "react-cookie";
import { setRoles, setUserDetails } from "../../stateManagement/actions";

function MainLayout(props) {
  const { dispatch } = useContext(store);
  const {
    state: { pageTitle }
  } = useContext(store);
  const [loading, setLoading] = useState(false);

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
  }, [pageTitle]);

  useEffect(() => {
    // check token
    let token = JSON.parse(localStorage.getItem(USERTOKEN));
    // verify token
    if (token) {
      axiosHandler("get", USER_ME, token.access).then(
        res => {
          setLoading(false);
          setUpUserCookie(res.data);
        },
        _ => {
          handleRefresh("logout");
        }
      );
    } else {
      handleRefresh("logout");
    }
  }, [props]);

  const setUpUserCookie = user_data => {
    dispatch({ type: setUserDetails, payload: user_data });
    axiosHandler("get", USER_ROLE).then(res => {
      dispatch({ type: setRoles, payload: res.data.results });
    });
  };

  const handleRefresh = status => {
    const query = qs.parse(props.location.search);
    if (query.refresh) {
      axiosHandler("post", GET_ACCESS_TOKEN, null, {
        refresh: query.refresh
      }).then(
        res => {
          localStorage.setItem(
            USERTOKEN,
            JSON.stringify({ access: res.data.access, refresh: query.refresh })
          );
          let newQuery = delete query.refresh;
          newQuery = qs.stringify(newQuery);
          props.history.push(props.location.pathname + `?${newQuery}`);
        },
        _ => {
          routeToLogin(status);
        }
      );
    } else {
      routeToLogin(status);
    }
  };

  const routeToLogin = status => {
    let logout = status === "logout" ? "&notactive=true" : "";
    localStorage.clear();
    // clear cookie
    window.location.href =
      loginUrl + `?redirect=${props.location.pathname}${logout}`;
  };

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
            <div className="navRight">
              <Link to="/add-property" className="navItem">
                <Button>Post Property</Button>
              </Link>
              <Link to="/profile" className="navItem">
                <div className="navItem">user-profile</div>
              </Link>
            </div>
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

const SideLinks = ({ icon, title, link, active = false }) => (
  <Link to={link}>
    <div className={`sideLink ${active ? "active" : ""}`}>
      <i className="icon-main">{icon}</i> {title}
    </div>
  </Link>
);

const SideBar = () => {
  return (
    <div className="sideBar">
      <img src={logo} className="logo" alt="logo" />
      <div className="sideLinks">
        <SideLinks
          link={"/"}
          title="Dashboard"
          active
          icon={<Icon name="creditCard" type="feather" />}
        />
        <SideLinks
          link={"/properties"}
          title="Properties"
          icon={<Icon name="folder" type="feather" />}
        />
        <SideLinks
          link={"/applications"}
          title="Applications"
          icon={<Icon name="packageIcon" type="feather" />}
        />
        <SideLinks
          link={"/leases"}
          title="Leases"
          icon={<Icon name="checkSquare" type="feather" />}
        />
        <SideLinks
          link={"/inspections"}
          title="Inspections"
          icon={<Icon name="eye" type="feather" />}
        />
        <SideLinks
          link={"/transactions"}
          title="Transactions"
          icon={<Icon name="barChart" type="feather" />}
        />

        <SideLinks
          link={"/notifications"}
          title="Notifications"
          icon={<Icon name="bell" type="feather" />}
        />
        <SideLinks
          link={"/agencies"}
          title="Agencies"
          icon={<Icon name="user" type="feather" />}
        />
      </div>
    </div>
  );
};
