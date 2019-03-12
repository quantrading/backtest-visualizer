import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  Route,
  NavLink,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Example1 from "./pages/Example1";
import Example2 from "./pages/Example2";
import Example3s from "./pages/Example3";
import AssetAllocationChart from "./pages/Example4";
import Example5 from "./pages/Example5";
import Notfound from "./pages/notfound";
import { ApolloProvider } from "react-apollo";
import client from "./apollo";

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example1">
            Example1
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example2">
            Example2
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example3">
            Example3
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example4">
            Example4
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/example5">
            Example5
          </NavLink>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/example1" component={Example1} />
        <Route path="/example2" component={Example2} />
        <Route path="/example3" component={Example3s} />
        <Route path="/example4" component={AssetAllocationChart} />
        <Route path="/example5" component={Example5} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(
  <ApolloProvider client={client}>{routing}</ApolloProvider>,
  document.getElementById("root")
);
