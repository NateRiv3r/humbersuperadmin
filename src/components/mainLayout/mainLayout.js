import React, { useContext, useEffect, useState } from "react";
import "./mainlayout.css";
import { Button } from "../button/Button";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Icon } from "../icons";
import { addClass, hasClass, removeClass } from "../../utils/helper";
import { store } from "../../stateManagement/store";
import { loginUrl, secondaryColor, USERTOKEN } from "../../utils/data";
import { axiosHandler } from "../../utils/axiosHandler";
import { GET_ACCESS_TOKEN, USER_ME, USER_ROLE } from "../../utils/urls";
import { Spinner } from "../spinner/Spinner";
import qs from "query-string";
import { useCookies } from "react-cookie";
import { setRoles, setUserDetails } from "../../stateManagement/actions";
import ProfileNav from "../profileNav/profileNav";
import { RoleSwitcher } from "../profile/Settings";
import AppIcon from "../icons/Icon";
import NotificationDrop from "../notificationDrop/notificationDrop";

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
          const query = qs.parse(props.location.search);
          if (query.refresh) {
            delete query.refresh;
            let newQuery = qs.stringify(query);
            props.history.push(props.location.pathname + `?${newQuery}`);
          }
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
          delete query.refresh;
          let newQuery = qs.stringify(query);
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
              <div className="notifier">
                <NotificationDrop />
              </div>
              <Link to="/add-property" className="navItem">
                <Button>Post Property</Button>
              </Link>
              <Link to="/profile" className="navItem">
                <div className="navItem">
                  <ProfileNav />
                </div>
              </Link>
              <div className="role-switcher">
                <div className="head">Active Role</div>
                <RoleSwitcher hideTitle />
              </div>
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

const SideLinks = ({ icon, title, link, active = false, logout }) => (
  <Link to={link}>
    <div
      className={`sideLink ${active ? "active" : ""} ${logout ? "logout" : ""}`}
    >
      <i className="icon-main">{icon}</i> {title}
    </div>
  </Link>
);

const SideBar = () => {
  const [role, setRole] = useState("agency");
  const {
    state: { userDetails }
  } = useContext(store);
  useEffect(() => {
    if (userDetails.role) {
      setRole(userDetails.role.name);
    }
  }, [userDetails]);
  return (
    <div className="sideBar">
      <img src={logo} className="logo" alt="logo" />
      <div className="sideLinks">
        <SideLinks
          link={"/"}
          title="Dashboard"
          active
          icon={<Icon name="blackboard" type="entypo" />}
        />
        {role.toLowerCase() !== "tenant" && (
          <SideLinks
            link={"/properties"}
            title="Properties"
            icon={<Icon name="briefcase" type="entypo" />}
          />
        )}
        <SideLinks
          link={"/applications"}
          title="Applications"
          icon={<Icon name="folder" type="entypo" />}
        />
        {role.toLowerCase() !== "tenant" && (
          <SideLinks
            link={"/leases"}
            title="Leases"
            icon={<Icon name="documentInverted" type="entypo" />}
          />
        )}
        <SideLinks
          link={"/lease-charges"}
          title="Lease Charges"
          icon={<Icon name="database" type="entypo" />}
        />
        <SideLinks
          link={"/inspections"}
          title="Inspections"
          icon={<Icon name="address" type="entypo" />}
        />
        <SideLinks
          link={"/transactions"}
          title="Transactions"
          icon={<Icon name="graph" type="entypo" />}
        />

        <SideLinks
          link={"/notifications"}
          title="Notifications"
          icon={<Icon name="bell" type="entypo" />}
        />
        {role.toLowerCase() === "agency" && (
          <SideLinks
            link={"/dashboard/agency"}
            title="Agencies"
            icon={<Icon name="suitcase" type="entypo" />}
          />
        )}
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
