import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SeatsPage from './SeatsPage';
import WelcomePage from './WelcomePage';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {ReturnPage} from './ReturnPage';

import {fetchSeatsData } from "./cinemaSlice";


import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";



store.dispatch(fetchSeatsData());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/seat">
                    <SeatsPage />
                </Route>
                <Route path="/return">
                    <ReturnPage />
                </Route>
                <Route path="/">
                    <WelcomePage />
                </Route>
            </Switch>
        </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
