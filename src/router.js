import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import MainLayout from "./components/mainLayout/mainLayout";
import GlobalLoader from "./components/GlobalLoader/globalLoader";
import Logout from "./components/logout/logout";
import Login from "./pages/login/login";

const Games = lazy(() => import("./pages/games/games"));
const Clients = lazy(() => import("./pages/clients/clients"));
const WinningRules = lazy(() => import("./pages/winningRule/winningRule"));
const Licenses = lazy(() => import("./pages/licence/license"));
const Settings = lazy(() => import("./pages/settings/settings"));

const RouterMain = props => {
  return (
    <>
      <GlobalLoader />
      <BrowserRouter>
        <Switch>
          <Route path="/logout" exact component={Logout} />
          <Route path="/login" exact component={Login} />
          <Route
            path="/"
            component={props => (
              <MainLayout {...props}>
                <Route path="/" exact render={() => <Redirect to="/games" />} />
                <Route
                  path="/games"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Games {...props} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/games/:uuid/license"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Games {...props} single license />
                    </Suspense>
                  )}
                />
                <Route
                  path="/games/:uuid/winning-rule"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Games {...props} single winning />
                    </Suspense>
                  )}
                />
                <Route
                  path="/clients"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Clients {...props} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/clients/:uuid"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Clients {...props} single />
                    </Suspense>
                  )}
                />
                <Route
                  path="/winning-rules"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <WinningRules {...props} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/winning-rules/:uuid"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <WinningRules {...props} single />
                    </Suspense>
                  )}
                />
                <Route
                  path="/licenses"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Licenses {...props} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/licenses/:uuid/game"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Licenses {...props} single game />
                    </Suspense>
                  )}
                />
                <Route
                  path="/licenses/:uuid/client"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Licenses {...props} single client />
                    </Suspense>
                  )}
                />
                <Route
                  path="/settings"
                  exact
                  component={props => (
                    <Suspense fallback={() => <h2>Loading...</h2>}>
                      <Settings {...props} />
                    </Suspense>
                  )}
                />
              </MainLayout>
            )}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default RouterMain;
